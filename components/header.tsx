
import * as React from 'react'

import { getSession } from '@/app/actions/session'

import Link from "next/link";
import { ChatHistory } from "./chat-history";
import { SidebarMobile } from "./sidebar-mobile";
import { SidebarToggle } from "./sidebar-toggle";
import { IconApp, IconSeparator } from "./ui/icons";
import { UserMenu } from "./user-menu";
import { Button } from "./ui/button";
import ClientLocationSelector from "./client-location-selector";
import { LocationSelector } from './location-dropdown';
import dynamic from 'next/dynamic';
import UserOrLoginClient from './user-or-login-client';



export default async function UserOrLogin() {
  const session = await getSession()
  return <UserOrLoginClient session={session} />
}

export async function Header() {
  const session = await getSession()
  return (
    <header className="bg-[#131533] text-white sticky top-0 z-50 flex items-center justify-between lg:justify-normal w-full h-16 px-4 border-b shrink-0 backdrop-blur-xl">
      <div className="flex items-center w-full ">
        <React.Suspense fallback={<div className="flex-1 w-full overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>

    </header>
  )
}
