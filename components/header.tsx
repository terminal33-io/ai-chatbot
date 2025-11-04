import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getSession } from '@/app/actions/session'
import { Button } from './ui/button'
import { Sidebar } from './sidebar'
import { SidebarToggle } from './sidebar-toggle'
import { IconSeparator } from './ui/icons'
import { UserMenu } from './user-menu'

async function UserInfo() {
  const session = await getSession()

  if (!session?.user) {
    return (
      <Button variant="link" asChild>
        <Link href="/sign-in?callbackUrl=/">Login</Link>
      </Button>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      <p className="text-sm text-white">
        Welcome <span className="font-semibold">{session.user.name}</span>, You
        have been logged for{' '}
        <span className="font-semibold">
          {session.user.additional_info?.location_name}
        </span>
      </p>
      {session.user.image && (
        <Image
          src={session.user.image}
          alt={session.user.name}
          width={36}
          height={36}
          className="rounded-full border"
        />
      )}

      <IconSeparator className="size-6 text-muted-foreground/50" />
      {session?.user ? (
        <UserMenu user={session.user} />
      ) : (
        <Button variant="link" asChild className="-ml-2">
          <Link href="/sign-in?callbackUrl=/">Login</Link>
        </Button>
      )}
    </div>
  )
}

export function Header() {
  return (
    <header className="bg-[#2A3B4B] text-white sticky top-0 z-50 flex items-center justify-between w-full h-16 backdrop-blur-xl">
      <div className="flex gap-2 min-w-[250px] lg:min-w-[300px] bg-[#33485C] h-full items-center justify-between px-3">
        <div className="flex items-center space-x-1 justify-center grow">
          <span className="text-lg font-light">GiveCentral</span>
          <span className="text-lg font-bold">Guru AI</span>
        </div>

        <SidebarToggle />
      </div>
      <React.Suspense fallback={<div />}>
        <UserInfo />
      </React.Suspense>
    </header>
  )
}
