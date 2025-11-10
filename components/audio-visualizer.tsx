'use client'

import { useEffect, useRef } from 'react'

interface AudioVisualizerProps {
  isActive: boolean
  isPaused?: boolean
  className?: string
}

export function AudioVisualizer({
  isActive,
  isPaused = false,
  className = ''
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const barsRef = useRef<number[]>([])

  useEffect(() => {
    if (!isActive) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    updateCanvasSize()

    // Initialize waveform points
    const pointCount = 100
    if (barsRef.current.length === 0) {
      barsRef.current = Array.from({ length: pointCount }, () => Math.random() * 0.5)
    }

    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Update waveform points
      if (!isPaused) {
        barsRef.current.forEach((_, index) => {
          const targetHeight = Math.sin(Date.now() * 0.002 + index * 0.2) * 0.3 + Math.random() * 0.2
          barsRef.current[index] += (targetHeight - barsRef.current[index]) * 0.15
        })
      }

      // Draw waveform
      const centerY = height / 2
      const amplitude = height * 0.4

      // Create gradient for the waveform
      const gradient = ctx.createLinearGradient(0, 0, width, 0)
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)') // blue-500
      gradient.addColorStop(0.5, 'rgba(37, 99, 235, 0.9)') // blue-600
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.8)') // blue-500

      ctx.strokeStyle = gradient
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // Draw the waveform path
      ctx.beginPath()
      barsRef.current.forEach((point, index) => {
        const x = (index / (pointCount - 1)) * width
        const y = centerY + point * amplitude

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, isPaused])

  if (!isActive) return null

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none px-4 ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
