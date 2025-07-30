import { getSession } from '@/app/actions/session'

const apiUrl = process.env.API_URL 
const secret = process.env.APP_SECRET as string

export async function POST(req: Request) {
    const session = await getSession()
    const accessToken = session?.accessToken

    if (!accessToken) {
        return new Response('Unauthorized', { status: 401 })
    }

    const { keyword }: {keyword: string} = await req.json()

    try {
        const response = await fetch(`${apiUrl}/search/location/${keyword}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'X-SECRET': secret
            },
        })

        if ([401, 403].includes(response.status)) {
            return new Response('Unauthorized', { status: 401 })
        }

        if (!response.ok) {
            return new Response('Error from backend', { status: response.status })
        }

        const data = await response.json()
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        console.error('Location search error:', error)
        return new Response('Server Error', { status: 500 })
    }
}
