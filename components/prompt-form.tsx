import * as React from 'react'
import { useEffect } from 'react'
import Textarea from 'react-textarea-autosize'
import { UseChatHelpers } from 'ai/react'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { useVoiceRecording } from '@/lib/hooks/use-voice-recording'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { IconArrowElbow } from '@/components/ui/icons'
import { VoiceRecordingButtons } from '@/components/voice-recording-buttons'

export interface PromptProps
  extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: (value: string) => void
  isLoading: boolean
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  const {
    isRecording,
    isTranscribing,
    startRecording,
    cancelRecording,
    confirmRecording,
    cleanup
  } = useVoiceRecording({
    onTranscriptionComplete: async (text: string) => {
      setInput(text)
      // await onSubmit(text)
      // setInput('')
    },
    onError: (error: string) => {
      alert(error)
    }
  })

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    return cleanup
  }, [cleanup])

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        if (!input?.trim()) {
          return
        }
        setInput('')
        await onSubmit(input)
      }}
      ref={formRef}
    >
      <div className="relative flex flex-col w-full overflow-hidden max-h-60 grow bg-background sm:rounded-md sm:border">
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={e => {
                e.preventDefault()
                router.refresh()
                router.push('/')
              }}
              className={cn(
                buttonVariants({ size: 'sm', variant: 'outline' }),
                'absolute left-0 top-4 size-8 rounded-full bg-background p-0 sm:left-4'
              )}
            >
              <IconPlus />
              <span className="sr-only">New Chat</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip> */}
        <div className="relative w-full">
          <Textarea
            ref={inputRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={
              isTranscribing
                ? 'Transcribing...'
                : isRecording
                  ? 'Listening...'
                  : 'Send a message.'
            }
            spellCheck={false}
            className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          />
        </div>
        <div className="absolute right-0 top-4 flex gap-2 sm:right-4">
          <VoiceRecordingButtons
            isRecording={isRecording}
            isTranscribing={isTranscribing}
            onStartRecording={startRecording}
            onCancelRecording={cancelRecording}
            onConfirmRecording={confirmRecording}
          />
          {!isRecording && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || input === ''}
                >
                  <IconArrowElbow />
                  <span className="sr-only">Send message</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send message</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </form>
  )
}
