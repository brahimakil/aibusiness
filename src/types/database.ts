import { Database } from '@supabase/supabase-js'

export type BusinessIdea = {
  id: string
  title: string
  description: string | null
  category: string
  created_at: string
  metadata: Record<string, any>
}

export type DbResult<T> = {
  data: T | null
  error: Error | null
} 