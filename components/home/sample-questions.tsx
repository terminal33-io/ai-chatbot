import PromptCard from './prompt-card'
import { TabType } from './tab-selector'

// Sample questions for each tab category
const sampleQuestions = {
  faqs: [
    {
      text: 'How do I set up a personalized giving page?',
      image:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop&crop=center'
    },
    {
      text: 'What are the steps to process a refund?',
      image:
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop&crop=center'
    }
  ],
  analytics: [
    {
      text: 'Show me top 10 donors for the last month with their donation amounts.',
      image:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&crop=center'
    },
    {
      text: 'Give me total deposits for the last month.',
      image:
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop&crop=center'
    },
    {
      text: 'Show donors that had declined payments last week.',
      image:
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=400&fit=crop&crop=center'
    },
    {
      text: 'Give me a list of donors that have made the most donations this year.',
      image:
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=400&fit=crop&crop=center'
    }
  ],
  reports: [
    {
      text: 'Generate a QuickBooks Desktop Deposit report for last month.',
      image:
        'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&h=400&fit=crop&crop=center'
    },
    {
      text: 'Run a Transaction Report for the last quarter.',
      image:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop&crop=center'
    }
  ],
  communication: [
    {
      text: 'Write an email to thank donors for their Easter gifts.',
      image:
        'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=400&h=400&fit=crop&crop=center'
    },
    {
      text: 'Create a Facebook post for Giving Tuesday campaign.',
      image:
        'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop&crop=center'
    },
    {
      text: 'Write a blog post about community impact stories.',
      image:
        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop&crop=center'
    },
    {
      text: 'Write a Twitter post announcing new parish programs and ministries.',
      image:
        'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop&crop=center'
    }
  ]
}

interface SampleQuestionsProps {
  activeTab: TabType
  onQuestionClick: (question: string) => void
}

export function SampleQuestions({
  activeTab,
  onQuestionClick
}: SampleQuestionsProps) {
  return (
    <div className="grid grid-cols-2 gap-6 pb-6">
      {sampleQuestions[activeTab].map((question, index) => (
        <PromptCard
          key={index}
          text={question.text}
          onClick={() => onQuestionClick(question.text)}
          imageUrl={question.image}
        />
      ))}
    </div>
  )
}
