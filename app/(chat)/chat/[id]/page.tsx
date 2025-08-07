import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getChat } from '@/app/actions/chat'
import { Chat } from '@/components/chat'
import { getSession } from '@/app/actions/session'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const session = await getSession()

  if (!session?.user) {
    return {}
  }

  const chat = await getChat(params.id, session.user.id)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}
// TODO: we already have page, we just need to redirect the user here(?)
export default async function ChatPage({ params }: ChatPageProps) {
  const session = await getSession()

  if (!session?.user) {
    redirect(`/sign-in?next=/chat/${params.id}`)
  }

  const chat = await getChat(params.id, session.user.id)

  if (!chat) {
    notFound()
  }

  if (chat?.user_id !== session?.user?.id) {
    notFound()
  }

  return <Chat id={chat.id} initialMessages={chat.messages} />
}
