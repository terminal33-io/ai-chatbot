'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { login } from '@/app/actions/session'

// TODO: check if session already exist, show logout option
const SSOPage = () => {
  const [,setError] = useState()
  const params = useSearchParams()
  const token = params.get('token')

  useEffect(() => {
    if (token) {
      const initSSO = async () => {
        const {error} = (await login(token)) || {}
        if(error) {
          setError(() => {
              throw error
          });
        }
      }
      initSSO()
    }
  }, [token])

  return (
    <>
      <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10">
        Signing In, Please wait...
      </div>
    </>
  )
}

export default SSOPage
