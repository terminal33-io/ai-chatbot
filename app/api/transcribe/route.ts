import { getSession } from '@/app/actions/session'
import OpenAI from 'openai'

export const maxDuration = 60

export async function POST(req: Request) {
  const session = await getSession()

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return new Response('No audio file provided', { status: 400 })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'gpt-4o-transcribe',
      language: 'en'
    })

    return Response.json({ text: transcription.text })
  } catch (error) {
    console.error('Transcription error:', error)
    return new Response(
      error instanceof Error ? error.message : 'Transcription failed',
      { status: 500 }
    )
  }
}
