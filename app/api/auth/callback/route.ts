import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions } from '@/lib/utils'
import { SessionData } from '@/lib/types'

export async function GET(request: Request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 401 })
    }

    // Forward the token to backend for verification
    const response = await fetch(
      `${process.env.API_URL}/auth/callback?token=${token}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          SECRET: process.env.APP_SECRET || ''
        }
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.message || 'Verification failed' },
        { status: response.status }
      )
    }

    const { token: accessToken, user } = await response.json()

    // Create new session using iron-session
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)
    session.isLoggedIn = true
    session.accessToken = accessToken
    session.user = user
    await session.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
