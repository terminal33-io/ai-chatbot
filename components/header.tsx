
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

const UserOrLoginClient = dynamic(() => import('./user-or-login-client'), {
  ssr: false
})

export default async function UserOrLogin() {
  const session = await getSession()
  return <UserOrLoginClient session={session} />
}

export async function Header() {
  const session = await getSession()
  return (
    <header className="bg-[#131533] text-white sticky top-0 z-50 flex items-center justify-between lg:justify-normal w-full h-16 px-4 border-b shrink-0 backdrop-blur-xl">
      <div className="flex items-center lg:w-[250px] xl:w-[300px]">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>
      <div className="flex items-center justify-end space-x-2">

        {/* <a
          target="_blank"
          href="https://github.com/vercel/nextjs-ai-chatbot/"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          <IconGitHub />
          <span className="hidden ml-2 md:flex">GitHub</span>
        </a> */}
        {/* <a
          href="https://github.com/vercel/nextjs-ai-chatbot/"
          target="_blank"
          className={cn(buttonVariants())}
        >
          <IconVercel className="mr-2" />
          <span className="hidden sm:block">Deploy to Vercel</span>
          <span className="sm:hidden">Deploy</span>
        </a> */}
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="pl-0">
            <span className="pl-4">GPT 4</span> <IconChevronUpDown className='inline'/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8} align="start" className="w-[300px]">
          <DropdownMenuItem className="flex-col items-start gap-2">
            <div className="text-xs font-medium">GPT 4</div>
            <div className="text-xs text-zinc-500">For the best answers.</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex-col items-start gap-2">
            <div className="text-xs font-medium">GPT 3.5</div>
            <div className="text-xs text-zinc-500">Great for system related questions.</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
      </div>
    </header>
  )
}
