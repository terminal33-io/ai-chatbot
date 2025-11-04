'use client'
import { Message } from 'ai'

import { ChatMessage } from '@/components/chat-message'
import { type UseChatHelpers } from 'ai/react'
import { useEffect, useState } from 'react'
import { ChatSuggestions } from './chat-suggestions'
import { Button } from './ui/button'
import ChartView from './chart-view'

export interface ChatList extends Pick<UseChatHelpers, 'isLoading' | 'append'> {
  messages: Message[]
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
  // check messages length is changing
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

  return (
    <>
      <div className="relative mx-auto max-w-3xl px-4">
        {messages.map((message, index) => {
          const isEvenIndex = index % 2 === 1
          return (
            <div key={index} className={isEvenIndex ? 'mb-8 md:mb-12' : ''}>
              <ChatMessage message={message} />
            </div>
          )
        })}

        {isLoading && !incomingMsg && <ChatMessage message={dummyMessage} />}
      </div>

      {latestUserMsg && latestUserMsg.data == undefined && (
        <ChatSuggestions
          isLoading={isLoading}
          message={latestUserMsg}
          append={append}
          id={id}
        />
      )}
    </>
  )
}
