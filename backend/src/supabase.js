const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.warn(
    '[Cubicon backend] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. ' +
      'Add them to backend/.env. Credit deduction will not work until then.'
  )
}

// Service role client -- bypasses RLS, only safe server-side.
// NEVER expose SUPABASE_SERVICE_ROLE_KEY to the frontend.
const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  serviceRoleKey ?? 'placeholder-service-role-key',
  { auth: { persistSession: false } }
)

module.exports = { supabase }
