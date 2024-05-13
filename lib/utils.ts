import { createClient } from '@supabase/supabase-js'
import { clsx, type ClassValue } from 'clsx'
import { SessionOptions } from 'iron-session'
import { customAlphabet } from 'nanoid'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
) // 7-character random string

// export async function fetcher<JSON = any>(
//   input: RequestInfo,
//   init?: RequestInit
// ): Promise<JSON> {
//   const res = await fetch(input, init)

//   if (!res.ok) {
//     const json = await res.json()
//     if (json.error) {
//       const error = new Error(json.error) as Error & {
//         status: number
//       }
//       error.status = res.status
//       throw error
//     } else {
//       throw new Error('An unexpected error occurred')
//     }
//   }

//   return res.json()
// }

export function formatDate(input: string | number | Date): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export function getSupabaseClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_KEY
  return createClient(url as string, key as string)
}

export const sessionOptions: SessionOptions = {
  password: process.env.AUTH_SECRET as string,
  cookieName: 'gcguru-sso',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production'
  }
}