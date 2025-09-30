'use client'

import { useChat, type Message } from 'ai/react'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { Home } from '@/components/home'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { toast } from 'react-hot-toast'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { QueryInput } from './home/query-input'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const qid = searchParams.get('qid')
  const path = usePathname()
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      id,
      sendExtraMessageFields: true,
      body: {
        id
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText)
          signOut({
            redirect: true,
            callbackUrl: '/sign-in'
          })
        }
      },
      onFinish(message: Message) {
        if (!path.includes('chat')) {
          router.push(`/chat/${id}`, { shallow: true, scroll: false })
          router.refresh()
        }
      }
    })
  return (
    <>
      <div className={cn('pt-6 bg-white min-h-[91vh] flex flex-col', className)}>
        {messages.length ? (
          <div className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto px-4">
              <ChatList
                messages={messages}
                isLoading={isLoading}
                append={append}
                id={id}
              />
              <ChatScrollAnchor trackVisibility={isLoading} />
            </div>

            <div className="">
              <div className="mx-8 py-2">
                <QueryInput
                  existingChat={true}
                  onSubmit={async (value: string) => {
                    await append({
                      content: value,
                      role: "user",
                      createdAt: new Date(),
                    })
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <Home
              qid={qid}
              onSubmit={async (value: string) => {
                await append({
                  content: value,
                  role: "user",
                  createdAt: new Date(),
                })
              }}
            />
          </div>
        )}
      </div>
      {/* <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      /> */}
    </>
  )
}
