import { sessionOptions } from '@/lib/session'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/dist/client/components/headers'
import { redirect } from 'next/navigation'
import * as jose from 'jose'
import { JwtPayload, SessionData, User } from '@/lib/types'
import { NextRequest } from 'next/server'
import { createUser, getUser } from '@/app/actions/user'

export async function GET(req: NextRequest) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const token = req.nextUrl.searchParams.get('token')
  if (token) {
    try {
      const { payload } = await jose.jwtVerify<JwtPayload>(token, secret)
      let userData: any = {
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
      console.log("payload", payload)
      // get user
      let user = await getUser(payload.username)

      if (!user) {
        user = await createUser(userData)
      }

      // generate access token
      const response = await fetch(`${process.env.API_URL}/generate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user.email,
          name: user.name
        })
      })

      const { data: apiData } = await response.json()

      // create session
      if (user) {
        const session = await getIronSession<SessionData>(
          cookies(),
          sessionOptions
        )
        session.isLoggedIn = true
        session.accessToken = apiData.token
        session.user = {
          id: user.id,
          ...userData
        }
        await session.save()
      }
    } catch (e) {
      console.log(e)
      return new Response(`Error: ${e.message}`, {
        status: 500,
      })
    }
  }

  redirect("/")
}
