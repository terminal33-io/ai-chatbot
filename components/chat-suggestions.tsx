import { Message } from 'ai'
import { ReactElement, useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { Button } from './ui/button'
import ChartView from './chart-view'
import { IconGitHub, IconSpinner } from './ui/icons'
import { UseChatHelpers } from 'ai/react'

type CreateMessage = Omit<Message, 'id'> & {
  id?: Message['id']
}

export interface ChatSuggestions extends Pick<UseChatHelpers, 'append'> {
  isLoading: boolean
  message: Message
  id?: string
}

type Action = {
  label: string
  link?: string
  code?: string
}

type ActionResponse = {
  type: 'rag' | 'db'
  data: Action[] | []
}

const initActions: ActionResponse = {
  type: 'rag',
  data: []
}

const DbAction = ({ item }: { item: Action }) => {
  let component: ReactElement
  switch (item.code) {
    case 'CHART':
      component = (
        <Button key={item.label} variant={'outline'} className="mr-3">
          {item.label}
        </Button>
      )
      break
    case 'DOWNLOAD_DATA':
      component = (
        <Button key={item.label} variant={'outline'} className="mr-3">
          {item.label}
        </Button>
      )
      break
    default:
      component = (
        <Button key={item.label} variant={'outline'} className="mr-3">
          {item.label}
        </Button>
      )
  }

  return component
}

export const ChatSuggestions = ({
  isLoading,
  message,
  append,
  id
}: ChatSuggestions) => {
  const [actionsData, setActionsData] = useState<ActionResponse>(initActions)
  const [displayChart, setDisplayChart] = useState(false)
  const [chartLoading, setChartLoading] = useState(false)
  const [actionsLoading, setActionsLoading] = useState(false)

  const showChart = () => {
    setDisplayChart(!displayChart)
  }

  useEffect(() => {
    if (!isLoading) {
      //resey everthing

      setActionsData(initActions)
      setDisplayChart(false)

      const fetchData = async (message: Message) => {
        setActionsLoading(true)
        try {
          const response = await fetch('/api/actions', {
            method: 'POST',
            body: JSON.stringify({
              message: message.content,
              message_id: message.id,
              chat_id: id
            })
          })
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          const json = await response.json()
          console.log(json)
          setActionsData(json)
        } catch (error) {
          console.log(error)
        }
        setActionsLoading(false)
      }
      fetchData(message)
    }
  }, [message, id, isLoading])

  if (isLoading || actionsLoading) {
    return (
      <div className="mx-auto max-w-2xl pr-4 pt-1">
        <Skeleton count={3} />
      </div>
    )
  }

  // if actions are resolved and actions length is > 0
  if (actionsData.data.length == 0) return null

  if (actionsData.type == 'db')
    return (
      <div className="mx-auto max-w-2xl pr-4 pt-1">
        <div className="mb-4">
          <div className="px-1 ml-4">
            <div className="flex space-y-3 items-baseline flex-wrap">
              <ChartView
                show={displayChart}
                messageId={message.id}
                chatId={id as string}
                setChartLoading={setChartLoading}
              />
              {actionsData.data.length > 0 &&
                actionsData.data.map((item: Action) => {
                  let component
                  switch (item.code) {
                    case 'CHART':
                      component = (
                        <Button
                          key={item.label}
                          className="mr-3"
                          onClick={() => showChart()}
                          style={{
                            backgroundColor: chartLoading ? 'gray' : ''
                          }}
                        >
                          {chartLoading && <IconSpinner className="mr-2" />}
                          {item.label}
                        </Button>
                      )
                      break
                    case 'DOWNLOAD_DATA':
                      component = (
                        <Button
                          key={item.label}
                          className="mr-3"
                          onClick={() =>
                            window.open(
                              `/api/download?message_id=${message.id}`,
                              '_blank'
                            )
                          }
                        >
                          {item.label}
                        </Button>
                      )
                      break
                    case 'SEND_EMAIL':
                      component = (
                        <Button
                          key={item.label}
                          className="mr-3"
                          onClick={async () => {
                            await append({
                              content: 'Send Email Campaign',
                              role: 'user',
                              createdAt: new Date(),
                              data: {
                                message_id: message.id,
                                action_code: 'system-send-email'
                              }
                            })
                          }}
                        >
                          {item.label}
                        </Button>
                      )
                      break
                    default:
                      component = (
                        <Button
                          key={item.label}
                          className="mr-3"
                          variant={'outline'}
                        >
                          {item.label}
                        </Button>
                      )
                      break
                  }
                  return component
                })}
            </div>
          </div>
        </div>
      </div>
    )

  return (
    <div className="mx-auto max-w-2xl pr-4 pt-1">
      <div className="mb-4">
        <div className="px-1 ml-4 mt-2">
          <div className="text-md font-bold">Recommendations</div>
          <div className="flex space-y-3 items-baseline flex-wrap mt-3">
            {actionsData.data.length > 0 &&
              actionsData.data.map((item: Action) => (
                <Button
                  key={item.label}
                  variant={'outline'}
                  className="mr-3"
                  onClick={async () => {
                    if (item.link) {
                      window.open(item.link, '_blank')
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
