"use client"
import { Message } from 'ai'

import { Separator } from '@/components/ui/separator'
import { ChatMessage } from '@/components/chat-message'
import { type UseChatHelpers } from 'ai/react'
import { useEffect, useState } from 'react'
import { ChatSuggestions } from './chat-suggestions'

export interface ChatList extends Pick<UseChatHelpers, 'isLoading' | 'append'> {
  messages: Message[],
  id?: string
}

export function ChatList({ messages, isLoading, append, id }: ChatList) {
  const [latestUserMsg, setLatestUserMsg] = useState<Message | null>(null)
  const [latestBotMsg, setLatestBotMsg] = useState<Message | null>(null)
  const [incomingMsg, setIncomingMsg] = useState(false)

  // set latest User & AI message
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      const botMessages = messages.filter(msg => msg.role == 'assistant')
      setLatestBotMsg(botMessages[botMessages.length - 1])
    }
  }, [messages, isLoading])

  // set user Message
  useEffect(() => {
    if (messages.length > 0) {
      const userMessages = messages.filter(msg => msg.role == 'user')
      setLatestUserMsg(userMessages[userMessages.length - 1])
    }
  }, [messages, isLoading])

  // detect incoming bot message
  // check messages length is change 
  useEffect(() => {
    if (messages.length > 1 && isLoading) {
      const botMessages = messages.filter(msg => msg.role == 'assistant')
      const latestMsg = botMessages[botMessages.length - 1]
      if (latestMsg.id != latestBotMsg?.id) setIncomingMsg(true)
    }

    if (!isLoading) {
      setIncomingMsg(false)
    }
  }, [messages, isLoading])

  if (!messages.length) {
    return null
  }

  const dummyMessage: Message = {
    id: '',
    content: '![Loading](/238.gif)',
    role: 'assistant'
  }

  // console.log(latestUserMsg)


  return (
    <>
      <div className="relative mx-auto max-w-2xl px-4">
        {messages.map((message, index) => (
          <div key={index}>
            <ChatMessage message={message} />
            {index < messages.length - 1 && (
              <Separator className="my-4 md:my-8" />
            )}
            {/* load suggestions for last message */}
            {/* {!isLoading && index == messages.length-1 && <div>load suggestions</div>}
            {isLoading && index == messages.length-1 && <div>loading...</div>} */}
          </div>
        ))}

        {isLoading && !incomingMsg && (
          <>
            <Separator className="my-4 md:my-8" />
            <ChatMessage message={dummyMessage} />
          </>
        )}
      </div>

      {latestUserMsg && latestUserMsg.data == undefined && (
        <ChatSuggestions
          isLoading={incomingMsg || isLoading}
          message={latestUserMsg}
          append={append}
          id={id}
        />
      )}
    </>
  )
}
