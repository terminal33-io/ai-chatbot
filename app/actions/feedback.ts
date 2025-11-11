'use server'

import { getSupabaseClient } from '@/lib/utils'

const supabase = getSupabaseClient()

export async function submitFeedback({
  chatId,
  messageId,
  feedback
}: {
  chatId?: string
  messageId: string
  feedback: string
}) {
  try {
    const { data, error } = await supabase
      .from('chat_feedback')
      .insert({
        chat_id: chatId,
        message_id: messageId,
        feedback: feedback
      })
      .select()
      .single()

    if (error) {
      console.error('Error submitting feedback:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return { success: false, error: 'Failed to submit feedback' }
  }
}
