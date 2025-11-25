'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { IconSpinner, IconCheck } from '@/components/ui/icons'

interface ToolProcessingProps {
  toolName: string
  className?: string
  isComplete?: boolean
}

export function ToolProcessing({
  toolName,
  className,
  isComplete = false
}: ToolProcessingProps) {
  const [dots, setDots] = useState('')

  useEffect(() => {
    if (isComplete) return

    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'))
    }, 500)

    return () => clearInterval(interval)
  }, [isComplete])

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-4 py-2 text-sm text-muted-foreground',
        className
      )}
    >
      {isComplete ? (
        <IconCheck className="size-4 text-green-600" />
      ) : (
        <IconSpinner className="size-4" />
      )}
      <span>
        <span className="font-medium text-foreground">{toolName}</span>
        {!isComplete && <span className="inline-block w-4">{dots}</span>}
      </span>
    </div>
  )
}
