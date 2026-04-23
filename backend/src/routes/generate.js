const express = require('express')
const router = express.Router()
const { GoogleGenAI } = require('@google/genai')
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

const ANGLE_MAP = {
  isometric:    'isometric 45-degree equal-axis angle view',
  front_34:     'front three-quarter view, slight perspective depth',
  top_down:     'top-down bird\'s eye view, looking straight down',
  cinematic:    'low cinematic angle, slight upward tilt, dramatic perspective',
  floating_sym: 'perfectly centered front-facing view, fully symmetrical',
}

const STYLE_TEMPLATES = {
  clay_pastel: (obj, angle, bg) =>
    `A 3D icon of a ${obj}, ${angle}, soft clay material, pastel color palette, matte finish, rounded puffy edges, subtle ambient occlusion, smooth clay texture, gentle studio lighting, ${bg}, centered composition, no text, no watermark, no shadow`,
  studio_float: (obj, angle, bg) =>
    `A photorealistic ${obj}, ${angle}, product photography style, soft studio lighting with subtle key light from upper left, ${bg}, high detail surface texture, sharp focus, commercial product shot aesthetic, square 1:1 composition, centered subject, no text, no watermark, no humans`,
  frosted_glass: (obj, angle, bg) =>
    `A 3D icon of a ${obj}, ${angle}, frosted matte translucent glass material, monochromatic cool blue tones, soft embossed surface detail, sandblasted texture, subtle inner glow, soft ambient lighting, no harsh shadows, ${bg}, centered composition, no text, no watermark`,
  obsidian: (obj, angle, bg) =>
    `A 3D icon of a ${obj}, ${angle}, glossy jet black material, chrome silver edge highlights, deep reflective surfaces, luxury dark tech aesthetic, dramatic rim lighting, high contrast, ${bg}, centered composition, no text, no watermark`,
  holographic: (obj, angle, bg) =>
    `A 3D icon of a ${obj}, ${angle}, iridescent holographic crystal material, rainbow chromatic light dispersion, prismatic refraction, translucent with multicolor light play, futuristic ethereal look, soft dark vignette lighting, glowing edges, ${bg}, centered composition, no text, no watermark`,
  soft_render: (obj, angle, bg) =>
    `A 3D icon of a ${obj}, ${angle}, soft semi-realistic 3D render, muted natural colors, slightly toy-like proportions, smooth clean surfaces, diffused HDRI studio lighting, no harsh shadows, subtle soft ground shadow, ${bg}, Blender render aesthetic, centered composition, no text, no watermark`,
}

/**
 * Build the final Gemini prompt from icon generation params.
 */
function buildPrompt({ prompt, mode, style, angle, hasStyleRef }) {
  // Always white background — client removes it after generation
  const bgDesc = 'pure white background, flat and clean, no gradients, no vignette'

  let fullPrompt
  if (mode === 'free') {
    fullPrompt = `${prompt}, rendered as a clean 3D icon, ${bgDesc}, centered square 1:1 composition, no text, no watermark, no humans`
  } else {
    const angleDesc = ANGLE_MAP[angle] || ANGLE_MAP.isometric
    const templateFn = STYLE_TEMPLATES[style] || STYLE_TEMPLATES.clay_pastel
    fullPrompt = templateFn(prompt, angleDesc, bgDesc)
  }

  if (hasStyleRef) {
    fullPrompt += ', closely matching the visual style of the uploaded reference image'
  }

  return fullPrompt
}

/**
 * Call Gemini image generation model and return base64 data URL.
 */
async function callGemini({ prompt, mode, style, angle, resolution, hasStyleRef, isAdmin }) {
  const apiKey = isAdmin ? adminFreeKey : geminiKey
  const ai = new GoogleGenAI({ apiKey: apiKey ?? '' })

  const fullPrompt = buildPrompt({ prompt, mode, style, angle, hasStyleRef })

  const result = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: fullPrompt,
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
      imageConfig: {
        imageSize: resolution, // "1K" | "2K" | "4K" — must be uppercase
        aspectRatio: '1:1',
      },
    },
  })

  const parts = result.candidates?.[0]?.content?.parts ?? []
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

  // PGRST116 = no row found → treat as 0 balance
  if (readErr && readErr.code !== 'PGRST116') throw new Error(readErr.message)

  const current = data?.balance ?? 0
  if (current < amount) throw new Error('Insufficient credits')

  const { error: updateErr } = await supabase
    .from('credits')
    .update({ balance: current - amount, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
  if (updateErr) throw new Error(updateErr.message)

  return current - amount
}

router.post('/', async (req, res) => {
  try {
    const { prompt, mode, style, angle, hasStyleRef, resolution, userId, isAdmin } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const cost = CREDIT_COST[resolution] ?? 1

    // Deduct credits for all authenticated users (including admin)
    if (userId) {
      try {
        await deductCredits(userId, cost)
      } catch (creditErr) {
        const isInsufficientCredits = creditErr.message === 'Insufficient credits'
        const status = isInsufficientCredits ? 402 : 500
        return res.status(status).json({ error: creditErr.message })
      }
    }

    const imageUrl = await callGemini({
      prompt,
      mode,
      style,
      angle,
      hasStyleRef,
      resolution,
      isAdmin,
    })

    res.json({
      imageUrl,
      creditsUsed: cost,
    })
  } catch (err) {
    console.error('Generate error:', err.message)
    res.status(500).json({ error: err.message || 'Failed to generate icon' })
  }
})

module.exports = router
