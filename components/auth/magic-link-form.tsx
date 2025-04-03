'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface MagicLinkFormProps {
  redirectTo: string
}

export function MagicLinkForm({ redirectTo }: MagicLinkFormProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      switch (errorParam) {
        case 'missing_token':
          setError('Invalid magic link. Please try again.')
          break
        case 'verification_failed':
          setError('Failed to verify magic link. Please request a new one.')
          break
        case 'internal_error':
          setError('An error occurred. Please try again later.')
          break
        default:
          setError(errorParam)
      }
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          redirect_to: redirectTo
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to send magic link')
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-300"
        >
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="block w-full appearance-none rounded-md border border-gray-600 bg-gray-700 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-white"
            placeholder="you@example.com"
          />
        </div>
      </div>

      {error && <div className="text-sm text-red-400">{error}</div>}

      {success && (
        <div className="text-sm text-green-400">
          Check your email for the magic link!
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Send Magic Link'}
        </button>
      </div>
    </form>
  )
}
