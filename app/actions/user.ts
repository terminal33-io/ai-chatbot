import { NewUser, User } from '../../lib/types'
import { getSupabaseClient } from '@/lib/utils'

const supabase = getSupabaseClient()

export async function getUser(username: string) {
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('username', username)
    .single()

  if (error) {
    console.log('Error getting chats: ', error)
    return null
  }

  return data
}

export async function createUser(userData: NewUser) {
  const { data, error } = await supabase.from('users').insert(userData)
  if (error) {
    console.log('Error getting chats: ', error)
    return null
  }
  return data
}
