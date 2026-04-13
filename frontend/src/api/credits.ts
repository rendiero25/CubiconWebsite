import { supabase } from './supabase'

// Read credit balance — safe to call from frontend (anon key + RLS)
export async function getCredits(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('credits')
    .select('balance')
    .eq('user_id', userId)
    .single()
  if (error) throw new Error(error.message)
  return (data as { balance: number } | null)?.balance ?? 0
}

// Credit deduction is handled server-side inside POST /api/generate.
// This function is intentionally a no-op on the frontend — the backend
// deducts using the service role key before returning a result.
export async function deductCredits(_userId: string, _amount: number): Promise<void> {
  // Deduction happens in backend/src/routes/generate.js
}
