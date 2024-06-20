import { getSession } from '@/app/actions/session'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const messageId = searchParams.get('message_id')
  const session = await getSession()
  const apiUrl = process.env.API_URL
  const secret = process.env.APP_SECRET as string
  const accessToken = session?.accessToken

  const url = apiUrl + '/download-csv/' + messageId
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'X-SECRET': secret
      },
      method: 'GET'
    })

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to download the file' }),
        {
          status: res.status,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    const fileBuffer = await res.arrayBuffer()
    const fileName = `${messageId}.csv`

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename=${fileName}`,
        'Content-Type': 'application/octet-stream'
      }
    })
  } catch (error) {
    console.error('Error downloading the file:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
