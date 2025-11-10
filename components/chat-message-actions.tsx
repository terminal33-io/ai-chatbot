'use client'

import { type Message } from 'ai'

import { Button } from '@/components/ui/button'
import { IconCheck, IconCopy } from '@/components/ui/icons'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'

interface ChatMessageActionsProps extends React.ComponentProps<'div'> {
  message: Message
  showOnHover?: boolean
  alignLeft?: boolean
  hideForBotWhenGenerating?: boolean
}

export function ChatMessageActions({
  message,
  className,
  showOnHover = false,
  alignLeft = false,
  hideForBotWhenGenerating = false,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(message.content)
  }

  // Hide copy action for bot messages when they're still being generated
  if (hideForBotWhenGenerating) {
    return null
  }

  return (
    <div
      className={cn(
        'flex items-center transition-opacity px-2',
        alignLeft ? 'justify-start' : 'justify-end',
        showOnHover
          ? 'opacity-0 group-hover/message:opacity-100'
          : 'opacity-100',
        className
      )}
      {...props}
    >
      <Button variant="ghost" size="icon" onClick={onCopy} className="size-7">
        {isCopied ? (
          <IconCheck className="size-4" />
        ) : (
          <IconCopy className="size-4" />
        )}
        <span className="sr-only">Copy message</span>
      </Button>
    </div>
  )
}
