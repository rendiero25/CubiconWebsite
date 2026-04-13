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

const CREDIT_COST = { '1K': 1, '2K': 2, '4K': 3 }

const STYLE_PROMPTS = {
  'clay-pastel':
    'soft 3D clay render style, pastel colors, smooth rounded shapes, matte finish, cute and friendly aesthetic',
  glassmorphism:
    'glassmorphism style, frosted glass material, translucent surfaces, subtle reflections, modern and sleek',
  'flat-minimal':
    'flat design style, minimal detail, bold solid colors, clean geometric shapes, simple and modern',
  'neon-glow':
    'neon glow style, vibrant neon colors, glowing light effects, dark background contrast, cyberpunk aesthetic',
  'retro-pixel':
    'retro pixel art style, 16-bit or 8-bit aesthetic, crisp pixels, limited color palette, nostalgic game art',
  metallic:
    'metallic chrome style, shiny metal material, specular highlights, industrial and premium feel',
}

/**
 * Build a comprehensive Gemini prompt from icon generation params.
 */
function buildPrompt({ prompt, style, resolution, background, bgColor, bgGradient }) {
  const styleDesc = STYLE_PROMPTS[style] || STYLE_PROMPTS['clay-pastel']

  let bgDesc
  if (background === 'transparent') {
    bgDesc = 'transparent background, no background'
  } else if (background === 'gradient' && bgGradient?.length === 2) {
    bgDesc = `gradient background from ${bgGradient[0]} to ${bgGradient[1]}`
  } else {
    bgDesc = `solid ${bgColor || '#ffffff'} background`
  }

  const resDesc = resolution === '4K' ? 'ultra high detail' : resolution === '2K' ? 'high detail' : 'clean detail'

  return [
    `Create a single 3D isometric icon of: ${prompt}.`,
    `Style: ${styleDesc}.`,
    `Background: ${bgDesc}.`,
    `Quality: ${resDesc}, sharp edges, centered composition, square aspect ratio.`,
    'The icon should be professional, visually striking, and suitable for app or product use.',
    'Do not include any text, labels, or watermarks in the image.',
  ].join(' ')
}

/**
 * Call Gemini image generation model and return base64 data URL.
 */
async function callGemini({ prompt, style, resolution, background, bgColor, bgGradient, isAdmin }) {
  const apiKey = isAdmin ? adminFreeKey : geminiKey
  const ai = new GoogleGenerativeAI(apiKey ?? '')

  const model = ai.getGenerativeModel({
    model: 'gemini-3.1-flash-image-preview',
  })

  const fullPrompt = buildPrompt({ prompt, style, resolution, background, bgColor, bgGradient })

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
    generationConfig: {
      responseModalities: ['IMAGE'],
    },
  })

  const parts = result.response.candidates?.[0]?.content?.parts ?? []
  const imagePart = parts.find((p) => p.inlineData)

  if (!imagePart) {
    throw new Error('Gemini did not return an image. Check model availability and API key.')
  }

  const { data: base64, mimeType } = imagePart.inlineData
  return `data:${mimeType};base64,${base64}`
}

/**
 * Deduct credits server-side using the service role key.
 * Returns the new balance or throws on failure.
 */
async function deductCredits(userId, amount) {
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
    const { prompt, style, resolution, background, bgColor, bgGradient, userId, isAdmin } = req.body

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

    const imageUrl = await callGemini({
      prompt,
      style,
      resolution,
      background,
      bgColor,
      bgGradient,
      isAdmin,
    })

    res.json({
      imageUrl,
      creditsUsed: isAdmin ? 0 : cost,
      freeQuota: !!isAdmin,
    })
  } catch (err) {
    console.error('Generate error:', err.message)
    res.status(500).json({ error: err.message || 'Failed to generate icon' })
  }
})

module.exports = router
