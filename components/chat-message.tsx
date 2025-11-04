// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import { Message } from 'ai'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { cn } from '@/lib/utils'
import { CodeBlock } from '@/components/ui/codeblock'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { IconOpenAI } from '@/components/ui/icons'
import { ChatMessageActions } from '@/components/chat-message-actions'
import Image from 'next/image'

export interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <>
      <div
        className={cn(
          'group relative mb-4 flex items-start gap-3',
          isUser ? 'flex-row-reverse md:justify-end' : 'md:-ml-12 mt-10'
        )}
        {...props}
      >
        {!isUser && (
          <div
            className={cn(
              'flex size-8 shrink-0 select-none items-center justify-center text-foreground'
            )}
          >
            <Image
              src="/gc_icon.svg"
              width="30"
              height="30"
              alt="GC logo"
              className=""
            />
          </div>
        )}
        <div
          className={cn(
            'flex-1 space-y-2 overflow-hidden',
            isUser ? 'flex items-end flex-col group' : ''
          )}
        >
          <div
            className={cn(
              'rounded-2xl px-4 py-3 max-w-full',
              isUser
                ? 'bg-muted text-foreground rounded-br-sm'
                : 'border border-gray-200/70 text-foreground rounded-bl-sm'
            )}
          >
            <MemoizedReactMarkdown
              className={cn(
                'prose break-words prose-p:leading-relaxed prose-pre:p-0',
                isUser
                  ? 'dark:prose-invert prose-p:text-foreground prose-headings:text-foreground prose-strong:text-foreground'
                  : 'dark:prose-invert prose-p:text-foreground'
              )}
              remarkPlugins={[remarkGfm, remarkMath]}
              linkTarget="_blank"
              components={{
                p({ children }) {
                  return (
                    <p
                      className={cn(
                        'mb-2 last:mb-0',
                        isUser ? 'text-primary-foreground' : ''
                      )}
                    >
                      {children}
                    </p>
                  )
                },
                code({ node, inline, className, children, ...props }) {
                  if (children.length) {
                    if (children[0] == '▍') {
                      return (
                        <span
                          className={cn(
                            'mt-1 cursor-default animate-pulse',
                            isUser ? 'text-primary-foreground' : ''
                          )}
                        >
                          ▍
                        </span>
                      )
                    }

                    children[0] = (children[0] as string).replace('`▍`', '▍')
                  }

                  const match = /language-(\w+)/.exec(className || '')

                  if (inline) {
                    return (
                      <code
                        className={cn(
                          className,
                          isUser
                            ? 'bg-background/50 text-foreground'
                            : 'bg-background/50'
                        )}
                        {...props}
                      >
                        {children}
                      </code>
                    )
                  }

                  return (
                    <CodeBlock
                      key={Math.random()}
                      language={(match && match[1]) || ''}
                      value={String(children).replace(/\n$/, '')}
                      {...props}
                    />
                  )
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">{children}</table>
                    </div>
                  )
                },
                th({ children, ...props }) {
                  return (
                    <th className="whitespace-nowrap" {...props}>
                      {children}
                    </th>
                  )
                },
                a({ children, ...props }) {
                  return (
                    <a
                      className={cn(
                        isUser
                          ? 'text-foreground underline decoration-foreground/50'
                          : ''
                      )}
                      {...props}
                    >
                      {children}
                    </a>
                  )
                }
              }}
            >
              {message.content}
            </MemoizedReactMarkdown>
          </div>
          <ChatMessageActions
            message={message}
            showOnHover={isUser}
            alignLeft={!isUser}
          />
        </div>
      </div>
    </>
  )
}
