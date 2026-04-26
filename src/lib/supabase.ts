import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').trim()
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim()

export const isSupabaseConfigured = supabaseUrl.length > 0 && supabaseAnonKey.length > 0

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export type SubmissionRow = {
  id: string
  title: string
  description: string | null
  image_url: string
  year: string | null
  location: string | null
  created_at: string
}
