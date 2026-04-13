import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[Cubicon] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. ' +
      'Create frontend/.env.local with your Supabase project credentials. ' +
      'Auth and credit features will be unavailable until then.'
  )
}

// Placeholder values used when env vars are missing — app loads without crashing,
// Supabase calls fail gracefully at call-time instead.
export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseKey ?? 'placeholder-anon-key'
)
