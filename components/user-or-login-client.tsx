'use client'

import { ChatHistory } from './chat-history'
import { SidebarMobile } from './sidebar-mobile'
import { SidebarToggle } from './sidebar-toggle'
import { IconApp, IconSeparator } from './ui/icons'
import { UserMenu } from './user-menu'
import { Button } from './ui/button'
import ClientLocationSelector from './client-location-selector'
import Link from 'next/link'

export default function UserOrLoginClient({
    session
}: {
    session: any
}) {
    const handleLocationSelect = (location: { id: number; name: string }) => {
        localStorage.setItem('selectedLocation', JSON.stringify(location))
    }

    return (
        <div className="w-full flex items-center justify-between px-4">
            <div className="flex items-center space-x-4">
                {session?.user ? (
                    <>
                        <SidebarMobile>
                            <ChatHistory userId={session.user.id} />
                        </SidebarMobile>
                        <SidebarToggle />
                    </>
                ) : (
                    <Link href="/" target="_blank" rel="nofollow">
                        <IconApp className="w-6 h-6 mr-2 dark:fill-white" />
                    </Link>
                )}
                <IconSeparator className="w-6 h-6 text-muted-foreground/50" />
                {session?.user ? (
                    <UserMenu user={session.user} />
                ) : (
                    <Button variant="link" asChild className="-ml-2">
                        <Link href="/sign-in?callbackUrl=/">Login</Link>
                    </Button>
                )}
            </div>

            <div className="ml-auto">
                <ClientLocationSelector onSelect={handleLocationSelect} />
            </div>
        </div>
    )
}
