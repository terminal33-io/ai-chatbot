import { getSession } from "@/app/actions/session"
import { NextRequest } from "next/server"


const apiUrl = process.env.API_URL

export async function GET(req: NextRequest) {
    const session = await getSession()
    const accessToken = session?.accessToken
    const searchParams = req.nextUrl.searchParams
    const messageId = searchParams.get('messageId')
    console.log(messageId)

    const response = await fetch(`${apiUrl}/chart/${messageId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      })

    if (!response.ok) {
      console.log(response.status)
    }

    const data = await response.json()

    return Response.json(data)
}