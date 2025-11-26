// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import { Message } from 'ai'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeRaw from 'rehype-raw'
import { cn } from '@/lib/utils'
import { CodeBlock } from '@/components/ui/codeblock'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { IconOpenAI } from '@/components/ui/icons'
import { ChatMessageActions } from '@/components/chat-message-actions'
import { ToolProcessing } from '@/components/tool-processing'
import Image from 'next/image'
import { useMemo } from 'react'

export interface ChatMessageProps {
  message: Message
  chatId?: string
  isGenerating?: boolean
}

export function ChatMessage({
  message,
  chatId,
  isGenerating = false,
  ...props
}: ChatMessageProps) {
  const isUser = message.role === 'user'

  // Parse tool completion states - each tool is complete when content appears after its closing tag
  const toolStates = useMemo(() => {
    const toolRegex = /<tool>(.*?)<\/tool>/g
    const tools: Array<{ name: string; isComplete: boolean; position: number }> = []
    let match
    let toolCounter: Record<string, number> = {}

    while ((match = toolRegex.exec(message.content)) !== null) {
      const toolName = match[1] || 'tool'
      const toolEndIndex = match.index + match[0].length
      
      // Track position of this tool name (for handling duplicate tool names)
      toolCounter[toolName] = (toolCounter[toolName] || 0) + 1
      const position = toolCounter[toolName]
      
      // Check if there's any content (including other tools) after this tool's closing tag
      const contentAfter = message.content.slice(toolEndIndex).trim()
      const hasContentAfter = contentAfter.length > 0
      
      tools.push({
        name: toolName,
        isComplete: hasContentAfter,
        position: position
      })
    }

    return tools
  }, [message.content])

  return (
    <>
      <div
        className={cn(
          'group/message relative flex items-start gap-3',
          isUser ? 'flex-row-reverse md:justify-end' : 'md:-ml-12'
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
            'flex-1 space-y-1 overflow-hidden',
            isUser ? 'flex items-end flex-col group' : ''
          )}
        >
          <div
            className={cn(
              'rounded-2xl px-4 py-3 max-w-full',
              isUser
                ? 'bg-muted text-foreground rounded-br-sm'
                : 'text-foreground py-0'
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
              rehypePlugins={[rehypeRaw as any]}
              linkTarget="_blank"
              components={{
                // @ts-ignore - Custom HTML element for dynamic component rendering
                tool: (() => {
                  // Track which occurrence of each tool name we're rendering
                  const toolOccurrences: Record<string, number> = {}
                  
                  const ToolRenderer = ({ children, ...props }: any) => {
                    const toolName = String(children)
                    
                    // Increment occurrence counter for this tool name
                    toolOccurrences[toolName] = (toolOccurrences[toolName] || 0) + 1
                    const currentPosition = toolOccurrences[toolName]
                    
                    // Find this specific tool's completion state by name and position
                    const toolState = toolStates.find(
                      t => t.name === toolName && t.position === currentPosition
                    )
                    const isComplete = toolState?.isComplete ?? false
                    
                    return (
                      <ToolProcessing
                        toolName={toolName}
                        isComplete={isComplete}
                      />
                    )
                  }
                  
                  return ToolRenderer
                })() as any,
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
            chatId={chatId}
            showOnHover={isUser}
            alignLeft={!isUser}
            hideForBotWhenGenerating={!isUser && isGenerating}
          />
        </div>
      </div>
    </>
  )
}
