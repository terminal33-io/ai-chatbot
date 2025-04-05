import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, redirect_to } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      )
    }

    // Forward the request to backend
    const response = await fetch(`${process.env.API_URL}/auth/magic-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        redirect_to
      })
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { message: error.message || 'Failed to send magic link' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Magic link error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
