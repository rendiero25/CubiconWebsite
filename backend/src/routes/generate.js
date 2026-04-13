const express = require('express')
const router = express.Router()
const { GoogleGenerativeAI } = require('@google/generative-ai')
const { supabase } = require('../supabase')

// Use production key when NODE_ENV=production, otherwise fall back to dev key
const geminiKey =
  process.env.NODE_ENV === 'production'
    ? process.env.GEMINI_API_KEY_PRODUCTION
    : process.env.GEMINI_API_KEY

// Free-tier API key for admin users ("google nano banana" quota)
// Set GEMINI_API_KEY_ADMIN_FREE in .env to use a dedicated free-tier key for admin
const adminFreeKey = process.env.GEMINI_API_KEY_ADMIN_FREE || geminiKey

if (!geminiKey) {
  console.warn('[Cubicon] Gemini API key is not set. Icon generation will fail.')
}

const genAI = new GoogleGenerativeAI(geminiKey ?? '')

const CREDIT_COST = { '1K': 1, '2K': 2, '4K': 3 }

/**
 * Deduct credits server-side using the service role key.
 * Returns the new balance or throws on failure.
 */
async function deductCredits(userId, amount) {
  // Read current balance
  const { data, error: readErr } = await supabase
    .from('credits')
    .select('balance')
    .eq('user_id', userId)
    .single()
  if (readErr) throw new Error(readErr.message)

  const current = data?.balance ?? 0
  if (current < amount) throw new Error('Insufficient credits')

  const { error: updateErr } = await supabase
    .from('credits')
    .update({ balance: current - amount, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
  if (updateErr) throw new Error(updateErr.message)

  return current - amount
}

/**
 * Add credits server-side — used for admin free-quota generations.
 * The cost is credited back to the admin's balance so they never run out.
 */
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

router.post('/', async (req, res) => {
  try {
    const { prompt, style, resolution, background, userId, isAdmin } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const cost = CREDIT_COST[resolution] ?? 1

    // Admin uses free API quota — add the cost back as free credits
    if (userId && isAdmin) {
      try {
        await addCredits(userId, cost)
      } catch (creditErr) {
        console.warn('[Cubicon] Failed to credit admin balance:', creditErr.message)
      }
    } else if (userId && !isAdmin) {
      try {
        await deductCredits(userId, cost)
      } catch (creditErr) {
        return res.status(402).json({ error: creditErr.message })
      }
    }

    // TODO Task 7: call Gemini API and return real imageUrl
    // When isAdmin, use adminFreeKey instead of the standard geminiKey
    // const activeGenAI = isAdmin ? new GoogleGenerativeAI(adminFreeKey) : genAI

    // Placeholder SVG until Gemini is wired up
    const label = (prompt ?? '').slice(0, 18)
    const svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">',
      '<rect width="512" height="512" rx="72" fill="#3B5BDB"/>',
      '<text x="256" y="300" font-family="sans-serif" font-size="200" text-anchor="middle" dominant-baseline="middle" fill="white">🎨</text>',
      `<text x="256" y="440" font-family="sans-serif" font-size="32" font-weight="600" text-anchor="middle" fill="rgba(255,255,255,0.75)">${label}</text>`,
      '</svg>',
    ].join('')
    const imageUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`

    res.json({
      imageUrl,
      creditsUsed: isAdmin ? 0 : cost,
      freeQuota: !!isAdmin,
    })
  } catch (err) {
    console.error('Generate error:', err.message)
    res.status(500).json({ error: 'Failed to generate icon' })
  }
})

module.exports = router
