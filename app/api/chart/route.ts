import { getSession } from "@/app/actions/session"
import { NextRequest } from "next/server"


const apiUrl = process.env.API_URL

export async function POST(req: NextRequest) {
    const session = await getSession()
    const accessToken = session?.accessToken
    const json = await req.json()

    const payload = {
      chat_id: json.chat_id,
      message_id: json.message_id
    }

    const response = await fetch(`${apiUrl}/chat/chart`, {
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

    return Response.json(data)
}