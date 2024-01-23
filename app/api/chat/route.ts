import { AIStream, StreamingTextResponse } from 'ai'
import { auth } from '@/auth'
import { getSupabaseClient, nanoid } from '@/lib/utils'

export const runtime = 'edge'

const apiUrl = process.env.API_URL
const secret = process.env.APP_SECRET as string

export async function POST(req: Request) {
  const json = await req.json()
  const { messages } = json
  const message = messages[messages.length - 1].content
  const userId = (await auth())?.user?.id
  const model = 'gpt-4-1106-preview'
  const version = '1.0.0'
  const source = 'webapp'

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  try {
    const response = await fetch(`${apiUrl}/chat`, {
      headers: {
        'Content-Type': 'application/json',
        'X-SECRET': secret,
      },
      method: 'POST',
      body: JSON.stringify({
        message,
        model
      })
    })



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
        const createdAt = Date.now()
        const payload = {
          id,
          title,
          user_id: userId,
          messages: [
            ...messages,
            {
              content: completion,
              role: 'assistant',
              created_at: createdAt
            }
          ],
          additional_info: {
            model,
            temperature,
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
