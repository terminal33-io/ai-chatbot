'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getSession, login, logout, resolveToken } from '@/app/actions/session'
import { Button } from '@/components/ui/button'

const SSOPage = () => {
  const router = useRouter()
  const params = useSearchParams()

  const [error, setError] = useState<Error | null>(null)
  const [newUser, setNewUser] = useState<any>(null)
  const [existingUser, setExistingUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const token = params.get('token')
  const qid = params.get('qid') ? parseInt(params.get('qid')!) : null

  useEffect(() => {
    if (!token) return

    const initSSO = async () => {
      setLoading(true)

      try {
        const result = await login(token, qid)

        if (result?.error) {
          throw new Error(result.error)
        }

        if (result?.conflict) {
          setNewUser(result.newUser)
          setExistingUser(result.existingUser)
          return setLoading(false)
        }

        router.replace(qid ? `/?qid=${qid}` : '/')
      } catch (err: any) {
        setError(err)
        setLoading(false)
      }
    }

    initSSO()
  }, [token, qid, router])

  const handleContinueAsNewUser = async () => {
    try {
      await logout()
      await login(token!, qid)
      router.replace('/')
    } catch (err: any) {
      setError(err)
    }
  }

  const handleKeepExistingUser = () => {
    router.replace('/')
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10">
        Signing In, Please wait...
      </div>
    )
  }

  if (existingUser && newUser) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center">
        <h2 className="text-xl font-semibold mb-4">Different session detected</h2>
        <p className="mb-6 text-gray-600">
          You're trying to sign in with a different account. What would you like to do?
        </p>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="p-4 py-8 border rounded shadow-sm bg-gray-900">
            <h3 className="font-medium mb-2">Current User</h3>
            <p className="text-sm">Username: {existingUser.username}</p>
            <p className="text-sm">Email: {existingUser.email}</p>
          </div>
          <div className="p-4 py-8 border rounded shadow-sm bg-gray-900">
            <h3 className="font-medium mb-2">New User</h3>
            <p className="text-sm">Username: {newUser.username}</p>
            <p className="text-sm">Email: {newUser.email}</p>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={handleKeepExistingUser}>
            Keep Current User
          </Button>
          <Button onClick={handleContinueAsNewUser}>Continue as New User</Button>
        </div>
      </div>
    )
  }

  return error ? (
    <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10 text-red-600">
      {error.message || 'Something went wrong'}
    </div>
  ) : null
}

export default SSOPage
