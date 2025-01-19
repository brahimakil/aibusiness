import { Database } from '@supabase/supabase-js'

export type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  last_login: string | null
  preferences: Record<string, any>
}

export type BusinessIdea = {
  id: string
  title: string
  description: string | null
  category: string | null
  created_at: string
  ai_generated: boolean
  popularity_score: number
  metadata: Record<string, any>
}

export type AiPrompt = {
  id: string
  prompt_text: string
  icon_name: string | null
  created_at: string
  last_used: string | null
  usage_count: number
}

export type SavedIdea = {
  id: string
  user_id: string
  idea_id: string
  created_at: string
  notes: string | null
  is_favorite: boolean
}

export type UserActivity = {
  id: string
  user_id: string
  activity_type: string
  idea_id: string | null
  created_at: string
  metadata: Record<string, any>
}

export type DbResult<T> = {
  data: T | null
  error: Error | null
} 