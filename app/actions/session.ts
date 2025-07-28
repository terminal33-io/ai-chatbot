'use server'

import { getIronSession, IronSession, SessionOptions } from 'iron-session'
import { cookies } from 'next/dist/client/components/headers'
import { redirect } from 'next/navigation'
import * as jose from 'jose'
import { sessionOptions } from '@/lib/utils'
import { JwtPayload, NewUser, SessionData, User } from '@/lib/types'
import { createUser, getUser } from './user'
import { revalidatePath } from 'next/cache'

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.user) return null
  return session
}

export async function login(token: string, qid: number | null = null) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  try {
    //validate token
    const { payload } = await jose.jwtVerify<JwtPayload>(token, secret)

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
    // get user
    let user = await getUser(payload.username)

    // console.log(user)
    if (!user) {
      user = await createUser(userData)
    }

    if (user) {
      // generate access token
      const response = await fetch(
        `${process.env.API_URL}/auth/generate-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user),
          cache: 'no-store'
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const { data } = await response.json()
      // create new session
      const session = await getIronSession<SessionData>(
        cookies(),
        sessionOptions
      )
      session.isLoggedIn = true
      session.accessToken = data.token
      session.user = user
      await session.save()
    } else throw new Error('User not found')
  } catch (e) {
    console.log(e)
    let errorMessage: string
    if (e instanceof Error) {
      errorMessage = e.message
    } else {
      errorMessage = 'An unknown error occurred'
    }
    revalidatePath('/sso')
    return { error: errorMessage }
  }
  let redirectPath = '/'
  if (qid) {
    redirectPath = `${redirectPath}?qid=${qid}`
  }
  redirect(redirectPath)
}

export async function logout() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  session.destroy()
  redirect('/logout')
}
