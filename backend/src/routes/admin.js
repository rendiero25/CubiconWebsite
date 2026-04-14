const express = require('express')
const router = express.Router()
const { supabase } = require('../supabase')

const ADMIN_EMAILS = ['workspace.rendy@gmail.com']
const MAX_TOPUP = 10000

async function addCredits(userId, amount) {
  const { data, error: readErr } = await supabase
    .from('credits')
    .select('balance')
    .eq('user_id', userId)
    .single()
  if (readErr) throw new Error(readErr.message)

  const current = data?.balance ?? 0
  const { error: updateErr } = await supabase
    .from('credits')
    .update({ balance: current + amount, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
  if (updateErr) throw new Error(updateErr.message)

  return current + amount
}

/**
 * POST /api/admin/topup
 * Body: { amount: number }
 * Header: Authorization: Bearer <supabase_jwt>
 *
 * Fills the admin's own credit balance in Supabase.
 * Only accessible to verified admin users.
 */
router.post('/topup', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'] ?? ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' })
    }

    // Verify token and get user identity
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token)
    if (authErr || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    // Verify admin identity — dual check: app_metadata role OR email allowlist
    const isAdmin =
      user.app_metadata?.role === 'admin' ||
      ADMIN_EMAILS.includes(user.email ?? '')

    if (!isAdmin) {
      return res.status(403).json({ error: 'Forbidden: admin access required' })
    }

    const amount = Number(req.body.amount)
    if (!Number.isInteger(amount) || amount <= 0 || amount > MAX_TOPUP) {
      return res.status(400).json({ error: `Amount must be an integer between 1 and ${MAX_TOPUP}` })
    }

    const newBalance = await addCredits(user.id, amount)

    return res.json({ newBalance })
  } catch (err) {
    console.error('[Cubicon admin] Top-up error:', err.message)
    return res.status(500).json({ error: err.message || 'Failed to top up credits' })
  }
})

module.exports = router
