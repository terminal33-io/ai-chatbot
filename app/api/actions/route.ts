import { getSession } from "@/app/actions/session"


const apiUrl = process.env.API_URL

export async function POST(req: Request) {
    const session = await getSession()
    const accessToken = session?.accessToken
    const json = await req.json()
    const message = json.message

    const payload = {
      message: json.message,
      chat_id: json.chat_id,
      message_id: json.message_id
    }
    // console.log(payload)
    const response = await fetch(`${apiUrl}/chat/actions`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        method: 'POST',
        body: JSON.stringify(payload)
      })

    if (!response.ok) {
      console.log(response.status)
    }

    const data = await response.json()
    // console.log(data)

    return Response.json(data)
}