'use server'

import { getIronSession } from 'iron-session'
import { cookies } from 'next/dist/client/components/headers'
import * as jose from 'jose'
import { sessionOptions } from '@/lib/utils'
import { JwtPayload, NewUser, SessionData } from '@/lib/types'
import { createUser, getUser } from './user'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(
  token: string,
  qid: number | null = null,
  opts?: { forceSwitch?: boolean }
) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)

  try {
    const { payload } = await jose.jwtVerify<JwtPayload>(token, secret)

    const newUserData: NewUser = {
      username: payload.username,
      name: payload.name,
      email: payload.email,
      additional_info: payload.location_id
        ? {
          location_id: payload.location_id,
          location_name: payload.location_name
        }
        : undefined
    }

    let newUser = await getUser(payload.username)
    if (!newUser) {
      newUser = await createUser(newUserData)
    }

    const existingUser = session?.user || null

    const isSameUser = existingUser?.email === newUser.email
    const isSameUsername = existingUser?.username === newUser.username

    const shouldProceed =
      !existingUser || isSameUser || opts?.forceSwitch === true

    if (shouldProceed) {
      const response = await fetch(`${process.env.API_URL}/auth/generate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser),
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const { data } = await response.json()

      session.isLoggedIn = true
      session.accessToken = data.token
      session.user = newUser
      await session.save()

      return {
        success: true,
        isSameUser,
        isSameUsername,
        newUser,
        qid
      }
    }

    return {
      success: false,
      isSameUser: false,
      isSameUsername: false,
      newUser,
      existingUser
    }
  } catch (e) {
    console.error('SSO login error:', e)
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred'
    revalidatePath('/sso')
    return { error: errorMessage }
  }
}





export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.user) return null
  return session
}


export async function logout() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  session.destroy()
  redirect('/logout')
}
