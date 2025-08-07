'use server'

import { getIronSession } from 'iron-session'
import { cookies } from 'next/dist/client/components/headers'
import * as jose from 'jose'
import { sessionOptions } from '@/lib/utils'
import { JwtPayload, NewUser, SessionData } from '@/lib/types'
import { createUser, getUser } from './user'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'


export async function resolveToken(token: string):Promise<JwtPayload> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jose.jwtVerify<JwtPayload>(token, secret)
    return payload;
  } catch (err) {
    console.error("[RESOLVE TOKEN] Error: ", err)
    throw err
 }
}

export async function login(
  token: string,
  qid: number | null = null,
  opts?: { forceSwitch?: boolean }
) {

  const session = await getIronSession<SessionData>(cookies(), sessionOptions)

  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)
    const currentUser = session.user
    const newUserData = await resolveToken(token)

    let newUser = await getUser(newUserData.username)
    if (!newUser) {
      newUser = await createUser(newUserData)
    }
    
    const isSameUser = currentUser?.email === newUser.email

    if (currentUser && !isSameUser) {
      return {
        conflict: true,
        existingUser: currentUser,
        newUser
      }
    }

      const response = await fetch(`${process.env.API_URL}/auth/generate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'secret': process.env.ADMIN_SECRET!
        },
        body: JSON.stringify({ username: newUser.username }),
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
        user: newUser
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
