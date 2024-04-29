import { Message } from 'ai'
import { UseChatHelpers } from 'ai/react/dist'
import Skeleton from 'react-loading-skeleton'

type CreateMessage = Omit<Message, 'id'> & {
  id?: Message['id']
}

type Action = {
  code: string
  label: string
}

const actionsArray: Action[] = [
  { code: 'send-email-campaign', label: 'Send an email to the donors' }
]

export interface ChatSuggestions extends Pick<UseChatHelpers, 'append'> {
    isLoading: boolean
    message: Message
  }

export const ChatSuggestions = ({
  isLoading,
  message,
  append
}: ChatSuggestions) => {
    // TODO::get actions from server
  const getValidActions = (message: Message) => {
    if (message.content.includes('donor')) {
      return actionsArray
    }

    return []
  }

  const actions = getValidActions(message)

  // if state is loading and action promise is not resolved
  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl pr-4 pt-1">
        <div className="mb-4">
          <div className="px-1 ml-4 mt-4">
            <div className="text-md font-bold">
              <Skeleton />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <Skeleton containerClassName="col-span-1" height={70} />
              <Skeleton containerClassName="col-span-1" height={70} />
              <Skeleton containerClassName="col-span-1" height={70} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // if actions are resolved and actions length is > 0

  if (actions.length == 0) return null

  return (
    <div className="mx-auto max-w-2xl pr-4 pt-1">
      <div className="mb-4">
        <div className="px-1 ml-4 mt-4">
          <div className="text-md font-bold">RECOMMENDATIONS</div>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {actions.length > 0 &&
              actions.map(item => (
                <div
                  key={item.code}
                  className="bg-gray-200 text-blue-800 hover:bg-gray-300 hover:font-semibold hover:underline p-3 rounded-sm cursor-pointer col-span-1"
                  onClick={async () => {
                    await append({
                      content: item.label,
                      role: 'user',
                      createdAt: new Date(),
                      data: {"message_id": message.id, "action_code": item.code}
                    })
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
