'use client'

import { type Message } from 'ai'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { IconCheck, IconCopy, IconThumbsDown, IconSpinner } from '@/components/ui/icons'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { submitFeedback } from '@/app/actions/feedback'

interface ChatMessageActionsProps extends React.ComponentProps<'div'> {
  message: Message
  chatId?: string
  showOnHover?: boolean
  alignLeft?: boolean
  hideForBotWhenGenerating?: boolean
}

export function ChatMessageActions({
  message,
  chatId,
  className,
  showOnHover = false,
  alignLeft = false,
  hideForBotWhenGenerating = false,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(message.content)
  }

  const handleFeedbackSubmit = async () => {
    setIsSubmitting(true)
    try {
      const result = await submitFeedback({
        chatId,
        messageId: message.id,
        feedback
      })

      if (result.success) {
        setFeedbackSubmitted(true)
        setTimeout(() => {
          setFeedbackOpen(false)
          setFeedback('')
          setFeedbackSubmitted(false)
        }, 1500)
      } else {
        console.error('Failed to submit feedback:', result.error)
        // Optionally show error to user
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Hide copy action for bot messages when they're still being generated
  if (hideForBotWhenGenerating) {
    return null
  }

  const isAssistant = message.role === 'assistant'

  return (
    <div
      className={cn(
        'flex items-center gap-1 transition-opacity px-2',
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

      {isAssistant && (
        <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              title="Provide feedback"
            >
              <IconThumbsDown className="size-4" />
              <span className="sr-only">Provide feedback</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Provide Feedback</DialogTitle>
              <DialogDescription>
                Help us improve by sharing what went wrong with this response.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Textarea
                placeholder="What could be better about this response?"
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                className="min-h-[100px]"
                disabled={feedbackSubmitted}
              />
            </div>
            <DialogFooter>
              {feedbackSubmitted ? (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <IconCheck className="size-4" />
                  <span>Thank you for your feedback!</span>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setFeedbackOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleFeedbackSubmit}
                    disabled={!feedback.trim() || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <IconSpinner className="mr-2 size-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Feedback'
                    )}
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
