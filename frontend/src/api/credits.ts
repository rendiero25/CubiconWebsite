import { supabase } from './supabase'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'

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

/**
 * Admin-only: add credits to the admin's own balance in Supabase.
 * Calls backend /api/admin/topup which verifies JWT + admin role.
 * Returns the new balance.
 */
export async function topUpCredits(amount: number): Promise<number> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) throw new Error('Not authenticated')

  const res = await fetch(`${BASE_URL}/api/admin/topup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ amount }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`)
  }

  const { newBalance } = await res.json() as { newBalance: number }
  return newBalance
}

// Credit deduction is handled server-side inside POST /api/generate.
// This function is intentionally a no-op on the frontend — the backend
// deducts using the service role key before returning a result.
export async function deductCredits(_userId: string, _amount: number): Promise<void> {
  // Deduction happens in backend/src/routes/generate.js
}
