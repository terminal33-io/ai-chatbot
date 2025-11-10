import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { IconMicrophone, IconClose, IconCheck } from '@/components/ui/icons'

interface VoiceRecordingButtonsProps {
  isRecording: boolean
  isTranscribing: boolean
  onStartRecording: () => void
  onCancelRecording: () => void
  onConfirmRecording: () => void
  className?: string
}

export function VoiceRecordingButtons({
  isRecording,
  isTranscribing,
  onStartRecording,
  onCancelRecording,
  onConfirmRecording,
  className = ''
}: VoiceRecordingButtonsProps) {
  if (isRecording) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={onCancelRecording}
              disabled={isTranscribing}
              className="text-muted-foreground"
            >
              <IconClose />
              <span className="sr-only">Cancel</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isTranscribing ? 'Transcribing...' : 'Cancel recording'}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={onConfirmRecording}
              disabled={isTranscribing}
              className="text-muted-foreground"
            >
              <IconCheck />
              <span className="sr-only">Confirm</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isTranscribing ? 'Transcribing...' : 'Confirm and send'}
          </TooltipContent>
        </Tooltip>
      </div>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={onStartRecording}
          className={`text-muted-foreground ${className}`}
        >
          <IconMicrophone />
          <span className="sr-only">Voice input</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Voice input</TooltipContent>
    </Tooltip>
  )
}
