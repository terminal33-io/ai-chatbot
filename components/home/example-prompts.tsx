import { IconSparkle } from '@/components/ui/icons'

// Examples for each tab category
const examples = {
  faqs: [
    'How do I add a new donor to the system?',
    'How can I update donor contact information?',
    'How do I set up automated thank you messages?',
    'What security measures are taken to protect donor payment information in givecentral?'
  ],
  analytics: [
    'Give me summary of transactions for the last week.',
    'How much recurring donations are scheduled to process this month?',
    'Give me a list of donors whose cards are going to expire this month and also have recurring donations set up.',
    'Give me a list of donors that have made a single donation greater than $2000 this year.'
  ],
  reports: [
    'Generate a Deposit Total Report for this month',
    'Run a Declined Payment Method Report for failed transactions',
    'Create a Parish Soft Report for last quarter',
    'Generate an All Fee Reports summary for annual review'
  ],
  communication: [
    'Write an email to thank donors for their Easter Gifts',
    'Write a year-end solicitation to donors',
    'Write a blog post regarding Giving Tuesday',
    'Write a twitter post regarding Christmas',
    'Write an email to donors asking for help with repairing the rectory roof'
  ]
}

export function ExamplePrompts({
  activeTab,
  onExampleClick
}: {
  activeTab: 'faqs' | 'analytics' | 'reports' | 'communication'
  onExampleClick: (example: string) => void
}) {
  const currentExamples = examples[activeTab]

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Try some more examples</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {currentExamples.map((example, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-200 shadow-sm p-4 bg-white hover:shadow-md transition cursor-pointer"
            onClick={() => onExampleClick(example)}
          >
            <div className="flex gap-2 items-start">
              <IconSparkle className="size-4 mt-1 shrink-0" />
              <p className="text-sm text-gray-800 leading-relaxed">{example}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
