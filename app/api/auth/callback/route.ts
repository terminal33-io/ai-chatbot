import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(
        new URL('/magic-link?error=missing_token', request.url)
      )
    }

    // Forward the token to backend for verification
    const response = await fetch(`${process.env.API_URL}/auth/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.redirect(
        new URL(
          `/magic-link?error=${error.message || 'verification_failed'}`,
          request.url
        )
      )
    }

    const { user, sessionToken } = await response.json()

    // Set the session cookie
    cookies().set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    // Get the redirect URL from the query params or default to home
    const redirectTo = searchParams.get('redirect_to') || '/'

    return NextResponse.redirect(new URL(redirectTo, request.url))
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(
      new URL('/magic-link?error=internal_error', request.url)
    )
  }
}
