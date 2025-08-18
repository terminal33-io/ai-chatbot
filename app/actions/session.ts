'use server'

import { getIronSession } from 'iron-session'
import { cookies } from 'next/dist/client/components/headers'
import * as jose from 'jose'
import { sessionOptions } from '@/lib/utils'
import { JwtPayload, NewUser, SessionData } from '@/lib/types'
import { createUser, getUser } from './user'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'


export async function verifyToken(token: string): Promise<JwtPayload> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jose.jwtVerify<JwtPayload>(token, secret)
    return payload
  } catch (err) {
    console.error('[verifyToken] Error:', err)
    throw new Error('Invalid or expired token')
  }
}


export async function checkLoginConflict(newUser: any) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  const currentUser = session.user

  if (!currentUser) return null

  const isSameUser = currentUser.username === newUser.username

  if (!isSameUser) {
    return {
      hasConflict: true,
      existingUser: currentUser,
      newUser
    }
  }

  return null
}


export async function login(token: string, qid: number | null = null) {
  try {
    const payload = await verifyToken(token)

    let userData: NewUser = {
      username: payload.username,
      name: payload.name,
      email: payload.email
    }

    if (payload.location_id) {
      userData.additional_info = {
        location_id: payload.location_id,
        location_name: payload.location_name
      }
    }

    let user = await getUser(payload.username)
    if (!user) {
      user = await createUser(userData)
    }
    if (!user) throw new Error('User not found')

    const conflict = await checkLoginConflict(user)
    if (conflict) return { conflict }

    const response = await fetch(`${process.env.API_URL}/auth/generate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        SECRET: process.env.APP_SECRET || ''
      },
      body: JSON.stringify(user),
      cache: 'no-store'
    })
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

    const { data } = await response.json()

    const session = await getIronSession<SessionData>(cookies(), sessionOptions)
    session.isLoggedIn = true
    session.accessToken = data.token
    session.user = user
    await session.save()

    return { success: true }
  } catch (e) {
    console.error('[loginUser] Error:', e)
    return { error: e instanceof Error ? e.message : 'An unknown error occurred' }
  }
}


export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  return session.user ? session : null
}


export async function logoutUser() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  session.destroy()
  redirect('/logout')
}
