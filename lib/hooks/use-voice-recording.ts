import { useState, useRef, useCallback } from 'react'

interface UseVoiceRecordingOptions {
  onTranscriptionComplete?: (text: string) => void
  onError?: (error: string) => void
}

export function useVoiceRecording(options: UseVoiceRecordingOptions = {}) {
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const mediaStreamRef = useRef<MediaStream | null>(null)

  const transcribeAudio = useCallback(
    async (audioBlob: Blob): Promise<string> => {
      try {
        const formData = new FormData()
        formData.append('audio', audioBlob, 'recording.webm')

        const response = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error('Transcription failed')
        }

        const data = await response.json()
        return data.text || ''
      } catch (error) {
        console.error('Transcription error:', error)
        throw error
      }
    },
    []
  )

  const startRecording = useCallback(async () => {
    if (isRecording) return

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      mediaStreamRef.current = stream

      // Set up MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : 'audio/webm' // fallback

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType
      })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onerror = event => {
        console.error('MediaRecorder error:', event)
        setIsRecording(false)
        options.onError?.('Recording failed')
      }

      // Start recording
      mediaRecorder.start(100) // Collect data every 100ms
      setIsRecording(true)
    } catch (error) {
      console.error('Failed to start recording:', error)
      const errorMessage =
        'Could not access microphone. Please check permissions.'
      options.onError?.(errorMessage)
    }
  }, [isRecording, options])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
      setIsRecording(false)

      // Stop media stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop())
        mediaStreamRef.current = null
      }
    }
  }, [isRecording])

  const cancelRecording = useCallback(() => {
    stopRecording()
    audioChunksRef.current = []
  }, [stopRecording])

  const confirmRecording = useCallback(async () => {
    if (!mediaRecorderRef.current || !isRecording) return

    setIsTranscribing(true)

    // Set up the onstop handler before stopping
    const mediaRecorder = mediaRecorderRef.current
    const mimeType = mediaRecorder.mimeType || 'audio/webm'

    return new Promise<void>(resolve => {
      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: mimeType
          })

          // Transcribe the audio
          const transcribedText = await transcribeAudio(audioBlob)

          if (transcribedText.trim()) {
            options.onTranscriptionComplete?.(transcribedText.trim())
          }

          // Clean up
          audioChunksRef.current = []
        } catch (error) {
          console.error('Error transcribing audio:', error)
          options.onError?.('Failed to transcribe audio. Please try again.')
        } finally {
          setIsTranscribing(false)
          stopRecording()
          resolve()
        }
      }

      // Stop the recording (this will trigger onstop)
      if (mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop()
      } else {
        // Already stopped, process immediately
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })
        transcribeAudio(audioBlob)
          .then(transcribedText => {
            if (transcribedText.trim()) {
              options.onTranscriptionComplete?.(transcribedText.trim())
            }
            audioChunksRef.current = []
          })
          .catch(error => {
            console.error('Error transcribing audio:', error)
            options.onError?.('Failed to transcribe audio. Please try again.')
          })
          .finally(() => {
            setIsTranscribing(false)
            stopRecording()
            resolve()
          })
      }
    })
  }, [isRecording, transcribeAudio, stopRecording, options])

  // Cleanup function for component unmount
  const cleanup = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop()
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
    }
  }, [])

  return {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    cancelRecording,
    confirmRecording,
    cleanup
  }
}
