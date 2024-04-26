import NextAuth, { type DefaultSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { getSupabaseClient } from './lib/utils'

declare module 'next-auth' {
  interface Session {
    accessToken: string,
    user: {
      /** The user's id. */
      id: string
    } & DefaultSession['user']
  }
}


export const {
  handlers: { GET, POST },
  auth
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (profile) {
        const supabase = getSupabaseClient()
        const { data: user, error } = await supabase
          .from('users')
          .select()
          .eq('email', profile.email)
          .maybeSingle()

        if(error) console.log('error fetching user', error);

        if (!user) {
          console.log('creating user')
          const { data, error } = await supabase.from('users').insert({
            email: profile.email,
            name: profile.name,
            profile_image: profile.picture
          })

          if (error) console.log('error creating user', error)
        }        
      }

      if (account?.provider === "google" && profile?.email && profile?.email_verified) {
        return profile.email_verified && (profile.email.endsWith("@nuclaysolutions.com") || profile.email.endsWith("@givecentral.org") || profile.email.endsWith("@terminal33.io"))
      }

      return true
    },
    async jwt({ token, user }) {
      // append database userid to token
      if (user) {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase
          .from('users')
          .select()
          .eq('email', token.email)
          .limit(1)
          .single()

        if(error) console.log('error fetching user', error)

        // generate api jwt token to session
        const response = await fetch(`${process.env.API_URL}/generate-token`,{
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email,
            name: data.name
          })
        })


        const {data: apiData} = await response.json()
        token.id = data.id
        token.accessToken = apiData.token
      }

      return token
    },
    session: ({ session, token }) => {
      if (session?.user && token?.id) {
        session.user.id = String(token.id)
        session.accessToken = token.accessToken as string
      }
      return session
    },
    authorized({ auth }) {
      return !!auth?.user // this ensures there is a logged in user for -every- request
    }
  },
  pages: {
    signIn: '/sign-in' // overrides the next-auth default signin page https://authjs.dev/guides/basics/pages
  }
})
