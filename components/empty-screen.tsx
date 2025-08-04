// import { UseChatHelpers } from 'ai/react'
import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@/components/ui/icons'
import { useEffect, useState } from 'react'

const exampleMessages = [
  {
    heading: 'Show me top 10 donors',
    message: `Show me top 10 donors with their donation amounts\n`
  },
  {
    heading: 'How do i issue refund',
    message: 'How do i issue refund? \n'
  },
  {
    heading: 'Draft an email',
    message: `Draft an email to send new year wishes to the donors \n`
  }
]

export function EmptyScreen({
  onSubmit,
  qid
}: {
  onSubmit: (value: string) => void
  qid: string | null
}) {
  const [loading, setLoading] = useState(false)
  // TODO: Check for valid response from the api, in case of errror, show the empty screen
  useEffect(() => {
    const fetchBootQuestion = async () => {
      if (!qid) return

      try {
        setLoading(true)
        const res = await fetch(`/api/question?qid=${qid}`)
        if (!res.ok) throw new Error('Failed to fetch question')
        const data = await res.json()
        if (data?.question_title) {
          onSubmit(data.question_title)
        }
      } catch (error) {
        console.error('Error fetching question:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBootQuestion()
  }, [qid, onSubmit])

  if (qid && loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 flex items-center space-x-2">
        <svg
          className="animate-spin h-5 w-5 text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>
    )
  }

  // TODO: The default messages need to be fetched from the api
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">Welcome to GC Guru!</h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          I am here to help you have fun doing business with your data.
        </p>

        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => {
                onSubmit(message.message)
              }}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
