// import { UseChatHelpers } from 'ai/react'
import { Button } from '@/components/ui/button'
import { IconPlus, IconSparkle } from '@/components/ui/icons'
import { useEffect, useState } from 'react'
import { Input } from './ui/input'
import Image from "next/image"



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


const prompts = [
  "Write me an Easter linkedin post Celebrating Easter: A Season of Renewal and Hope ✨🌸 This Easter, let’s reflect on the power of renewal, community, and generosity.",
  "Write an email to parishioners asking for their input in starting a $20 million capital campaign to help build a parish life center to provide a spiritual and physical space for the community",
  "Give me a list of donors whose cards are going to expire this month and also have recurring donations set up",
  "Write me an Easter linkedin post Celebrating Easter: A Season of Renewal and Hope ✨🌸 This Easter, let’s reflect on the power of renewal, community, and generosity.",
  "Write an email to parishioners asking for their input in starting a $20 million capital campaign to help build a parish life center to provide a spiritual and physical space for the community",
  "Give me a list of donors whose cards are going to expire this month and also have recurring donations set up",
];

export function ExamplePrompts() {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-6">Try some example prompts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {prompts.map((prompt, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-200 shadow-sm p-4 bg-white hover:shadow-md transition cursor-pointer"
          >
            <div className="flex gap-2 items-start">
              <IconSparkle className="w-4 h-4 mt-1  shrink-0" />
              <p className="text-sm text-gray-800 leading-relaxed">{prompt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



export default function PromptCard({ text }: { text?: string }) {
  return (
    <div
      className="rounded-2xl border border-gray-200 flex space-x-2 shadow-sm p-4 py-8 bg-white hover:shadow-md transition cursor-pointer"
    >
      {/* Image */}
      <div className="flex-shrink-0">
        <Image
          alt="heart in hands"
          src="https://imgs.search.brave.com/ULcOnqa-t54Vp2srXKcF_6iJ5MfBKOyClI_PglT7KU0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9j/bG9zZS11cC1oYW5k/cy1ob2xkaW5nLWhl/YXJ0XzIzLTIxNDkx/OTEzNTQuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZCZ3PTc0MCZxPTgw"
          height={100}
          width={100}
          className="rounded-lg object-cover"
        />
      </div>

      {/* Text */}
      <p className="text-base font-medium text-gray-800">
        {text}
      </p>
    </div>
  )
}


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

  return (
    <div className="mx-auto max-w-5xl w-[100%] mt-8 flex flex-col space-y-3 font-poppins text-black">
      <div className='flex flex-col space-y-8'>
        <h1 className='text-4xl text-black text-center font-poppins'>Welcome to <span className='font-bold'>Guru AI</span></h1>
        <div className="flex items-center w-full p-4 rounded-full border bg-white shadow-sm overflow-hidden">
          <Input
            placeholder="Ask Guru Ai anything like show me top 10 donors in 2025"
            className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-4 text-black"
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100 mx-1 border border-gray-300"
          >
            <IconPlus className="h-5 w-5 text-black" />
          </Button>

          <Button
            type="submit"
            className="rounded-full px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white"
          >
            Run
          </Button>
        </div>
      </div>

      <div className='px-3 flex flex-col space-y-4'>
        <h2 className='text-lg'>Your smart assistant with answers to all your questions!</h2>
        <div className='flex gap-4 py-2'>
          <div className='bg-gray-300 text-black text-sm rounded-2xl p-2 w-max cursor-pointer hover:bg-gray-400'>FAQs</div>
          <div className='bg-gray-300 text-black text-sm rounded-2xl p-2 w-max cursor-pointer hover:bg-gray-400'>Data based</div>
          <div className='bg-gray-300 text-black text-sm rounded-2xl p-2 w-max cursor-pointer hover:bg-gray-400'>All reports</div>
          <div className='bg-gray-300 text-black text-sm rounded-2xl p-2 w-max cursor-pointer hover:bg-gray-400'>Communication</div>
          <div className='bg-gray-300 text-black text-sm rounded-2xl p-2 w-max cursor-pointer hover:bg-gray-400'>Personalized Giving Page</div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <PromptCard text='Give me donors that had declined payments last month' />
          <PromptCard text='How do I set up a personalized giving page?' />
          <PromptCard text='Write an email to thanks donors for thier Easter Gifts' />
          <PromptCard text="How to run last month's transaction report? " />
        </div>
        <ExamplePrompts />
      </div>
    </div>
  )
}
