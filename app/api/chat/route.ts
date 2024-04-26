import { AIStream, StreamingTextResponse } from 'ai'
import { auth } from '@/auth'
import { getSupabaseClient, nanoid } from '@/lib/utils'

// export const runtime = 'edge'
export const maxDuration = 300

const apiUrl = process.env.API_URL
const secret = process.env.APP_SECRET as string

type ChatPayload = {
  message: string,
  model: string,
  chat_id: string,
  message_id: string,
  data?: string
}

export async function POST(req: Request) {
  const json = await req.json()
  const { messages } = json
  const userMessage = messages[messages.length - 1]
  const message = userMessage.content
  const userId = (await auth())?.user?.id
  const accessToken = (await auth())?.accessToken
  const model = 'gpt-4-0125-preview'
  const version = '1.0.0'
  const source = 'webapp'
  const chatId = json.id
  const messageId = userMessage.id
  const data = userMessage.data


  if (!userId || !accessToken) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  let payload: ChatPayload = {
    message,
    model,
    chat_id: chatId,
    message_id: messageId,
  };

  if (typeof data !== 'undefined') {
    payload.data = data;
  }

  console.log(payload)

  try {
    const response = await fetch(`${apiUrl}/chat/db`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-SECRET': secret,
      },
      method: 'POST',
      body: JSON.stringify(payload)
    })

    if([400,401,403].includes(response.status)) {
      return new Response('Unauthorized', {
        status: 401
      })
    }

    if (!response.ok) {
      return new Response('Error', {
        status: response.status
      })
    }

    const callback = {
      onCompletion: async (completion: string) => {
        //save to database
        const supabase = getSupabaseClient()
        const id = json.id ?? nanoid()
        const title = json.messages[0].content.substring(0, 100)
        const payload = {
          id,
          title,
          user_id: userId,
          messages: [
            ...messages,
            {
              id: nanoid(),
              content: completion,
              role: 'assistant',
              created_at: new Date()
            }
          ],
          additional_info: {
            model,
            version,
            source
          }
        }
        const { error } = await supabase.from('chats').upsert(payload)

        if (error) {
          console.log('error storing chat', error)
        }
      }
    }

    const stream = AIStream(response, undefined, callback)

    return new StreamingTextResponse(stream)
  } catch (e) {
    console.log('error', e)
  }
  
}
