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
    console.log('User not found: ', error)
    return null
  }

  return data
}

export async function createUser(userData: NewUser) {
  const { data, error } = await supabase.from('users').insert(userData).select().single()
  if (error) {
    console.log('Error creating new user: ', error)
    return null
  }
  return data
}
