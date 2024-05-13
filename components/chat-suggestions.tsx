import { Message } from 'ai'
import { UseChatHelpers } from 'ai/react/dist'
import { ok } from 'assert'
import { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'

type CreateMessage = Omit<Message, 'id'> & {
  id?: Message['id']
}

export interface ChatSuggestions extends Pick<UseChatHelpers, 'append'> {
  isLoading: boolean
  message: Message
  id?: string
}

type Action = {
  label: string,
  link?: string
  code?: string
}

export const ChatSuggestions = ({
  isLoading,
  message,
  append,
  id
}: ChatSuggestions) => {
  const [actionsData, setActionsData] = useState<Action[] | [] >([])

  useEffect(() => {
    const fetchData = async (message: Message) => {
      try {
        const response = await fetch('/api/actions', {
          method: 'POST',
          body: JSON.stringify({message: message.content, message_id: message.id, chat_id: id})
        })
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const json = await response.json()
        // console.log(json)
        setActionsData(json.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData(message)
  }, [message, id])

  // if state is loading and action promise is not resolved
  if (isLoading) {
    return  <div className="mx-auto max-w-2xl pr-4 pt-1"><Skeleton count={3} /></div>;
  }

  // if actions are resolved and actions length is > 0
if (actionsData.length == 0) return null

  return (
    <div className="mx-auto max-w-2xl pr-4 pt-1">
      <div className="mb-4">
        <div className="px-1 ml-4 mt-4">
          <div className="text-md font-bold">RECOMMENDATIONS</div>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {actionsData.length > 0 &&
              actionsData.map((item:Action) => (
                <div
                  key={item.label}
                  className="bg-gray-200 text-blue-800 hover:bg-gray-300 hover:underline p-3 rounded-sm cursor-pointer col-span-1"
                  onClick={async () => {
                    if(item.link) {window.open(item.link, "_blank")}
                    else if(item.code) {
                      await append({
                        content: item.label,
                        role: 'user',
                        createdAt: new Date(),
                        data: { message_id: message.id, action_code: item.code }
                      })
                    }
                  }}
                >
                  {item.label}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
