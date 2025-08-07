'use client';
import Link from "next/link";
import { ChatHistory } from "./chat-history";
import { SidebarMobile } from "./sidebar-mobile";
import { SidebarToggle } from "./sidebar-toggle";
import { IconApp, IconSeparator } from "./ui/icons";
import { UserMenu } from "./user-menu";
import { Button } from "./ui/button";
import ClientLocationSelector from "./client-location-selector";

export function UserOrLogin(session:any) {

    const handleLocationSelect = (location: { id: number; name: string }) => {
        console.log('Selected location:', location)
        // Optionally: update user context, session, etc.
    }

    return (
        <>
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
            <div className="flex items-center">
                <IconSeparator className="w-6 h-6 text-muted-foreground/50" />
                <div className="bg-red-500 flex space-x-5">
                    {session?.user ? (
                        <UserMenu user={session.user} />
                    ) : (
                        <Button variant="link" asChild className="-ml-2">
                            <Link href="/sign-in?callbackUrl=/">Login</Link>
                        </Button>
                    )}

                    <ClientLocationSelector onSelect={handleLocationSelect} />
              </div>
            </div>
        </>
    )
}