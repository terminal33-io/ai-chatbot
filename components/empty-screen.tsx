// import { UseChatHelpers } from 'ai/react'
import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@/components/ui/icons'

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
  // TODO: Fetch the boot question from the api and hit the onSubmit function
  // TODO: Check for valid response from the api, in case of errror, show the empty screen
  if (qid) {
    return (
      <div className="mx-auto max-w-2xl px-4">Loading Boot Question...</div>
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
