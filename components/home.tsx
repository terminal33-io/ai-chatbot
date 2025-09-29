import { useEffect, useState } from 'react'
import { QueryInput } from './home/query-input'
import { TabSelector, TabType } from './home/tab-selector'
import { SampleQuestions } from './home/sample-questions'
import { ExamplePrompts } from './home/example-prompts'

export function Home({
  onSubmit,
  qid
}: {
  onSubmit: (value: string) => void
  qid: string | null
}) {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('faqs')

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

  const handleQuestionClick = (question: string) => {
    onSubmit(question)
  }

  if (qid && loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 flex items-center space-x-2">
        <svg
          className="animate-spin size-5 text-muted-foreground"
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
    <div className="mx-auto max-w-5xl w-full mt-8 flex flex-col space-y-3 font-poppins text-black">
      <QueryInput onSubmit={onSubmit} />

      <div className="px-3 flex flex-col space-y-4">
        <h2 className="text-md mt-6 font-regular text-black">
          Your smart assistant with answers to all your questions!
        </h2>

        <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />

        <SampleQuestions
          activeTab={activeTab}
          onQuestionClick={handleQuestionClick}
        />

        <ExamplePrompts
          activeTab={activeTab}
          onExampleClick={handleQuestionClick}
        />
      </div>
    </div>
  )
}
