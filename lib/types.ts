import { type Message } from 'ai'

export interface Chat extends Record<string, any> {
  id: string
  title: string
  created_at: Date
  user_id: string
  messages: Message[]
  share_path?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export type JwtPayload = {
  username: string;
  name: string;
  email: string;
  location_name?: string
  location_id?: number
}


export type User = {
  id: string,
  username: string;
  name: string;
  email: string;
  additional_info?: {
    location_id?: number
    location_name?: string
  }
}

export type NewUser = Omit<User,'id'>

export interface SessionData {
  accessToken: string,
  user: User
  isLoggedIn: boolean;
}