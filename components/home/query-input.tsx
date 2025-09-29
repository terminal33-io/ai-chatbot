import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface QueryInputProps {
  onSubmit: (value: string) => void
}

export function QueryInput({ onSubmit }: QueryInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSubmit(inputValue.trim())
      setInputValue('')
    }
  }

  const handleButtonClick = () => {
    if (inputValue.trim()) {
      onSubmit(inputValue.trim())
      setInputValue('')
    }
  }

  return (
    <div className="flex flex-col space-y-8">
      <h1 className="text-4xl text-black text-center font-poppins">
        Welcome to <span className="font-semibold">Guru AI</span>
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex items-center w-full p-4 rounded-full border bg-white shadow-sm overflow-hidden"
      >
        <Input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Ask me anything or choose a topic from below to start the conversation"
          className="flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 text-black outline-none border-none shadow-none"
        />
        <Button
          type="button"
          onClick={handleButtonClick}
          className="rounded-full px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white"
        >
          Chat
        </Button>
      </form>
    </div>
  )
}
