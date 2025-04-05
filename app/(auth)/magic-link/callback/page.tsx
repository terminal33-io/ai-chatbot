'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get the hash fragment
    const hash = window.location.hash.substring(1)
    const hashParams = new URLSearchParams(hash)
    const token = hashParams.get('access_token')

    if (!token) {
      router.push('/magic-link?error=missing_token')
      return
    }

    // Call our API endpoint with the token
    fetch('/api/auth/callback', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Verification failed')
        }
        return response.json()
      })
      .then(() => {
        const redirectTo = searchParams.get('redirect_to') || '/'
        router.push(redirectTo)
      })
      .catch(error => {
        console.error('Auth error:', error)
        router.push('/magic-link?error=verification_failed')
      })
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Verifying your login...</h2>
        <p className="text-gray-500">
          Please wait while we complete the authentication.
        </p>
      </div>
    </div>
  )
}
