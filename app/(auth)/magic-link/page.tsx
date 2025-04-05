'use client'

import { useRouter } from 'next/navigation'
import { MagicLinkForm } from '@/components/auth/magic-link-form'
import Image from 'next/image'

export default function MagicLinkPage() {
  const router = useRouter()
  const redirectTo = 'http://localhost:3000/magic-link/callback'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-black/50">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Image
            src="/gc_logo.png"
            alt="GiveCentral Logo"
            width={200}
            height={50}
            priority
            className="mb-6"
            unoptimized
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Sign in with Magic Link
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Enter your email address and we&apos;ll send you a magic link to
            sign in
          </p>
        </div>
        <MagicLinkForm redirectTo={redirectTo} />
      </div>
    </div>
  )
}
