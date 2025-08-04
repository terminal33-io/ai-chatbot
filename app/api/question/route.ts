import { getSession } from "@/app/actions/session"
import { NextRequest } from "next/server"


const apiUrl = process.env.API_URL 

export async function GET(req: NextRequest) {
    const session = await getSession()
    const accessToken = session?.accessToken

    const { searchParams } = new URL(req.url)
    const qid = searchParams.get("qid")

    if (!qid) {
        return new Response(JSON.stringify({ error: "Missing qid" }), {
            status: 400,
        })
    }

    try {
        const response = await fetch(`${apiUrl}/question/${qid}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error("Backend error:", errorText)

            return new Response(
                JSON.stringify({ error: "Failed to fetch question", details: errorText }),
                { status: response.status }
            )
        }

        const data = await response.json()
        return Response.json(data)

    } catch (err) {
        console.error("API /question error:", err)
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
        })
    }
}
