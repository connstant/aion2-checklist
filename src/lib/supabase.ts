import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// null until .env.local (or Vercel env vars) are filled in
export const supabase = url && anonKey ? createClient(url, anonKey) : null
