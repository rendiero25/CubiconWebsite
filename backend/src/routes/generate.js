const express = require('express')
const router = express.Router()
const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// POST /api/generate
router.post('/', async (req, res) => {
  try {
    const { prompt, style, resolution } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    // TODO Task 7: implement full generation logic
    // Placeholder response for now
    res.json({ message: 'Generate endpoint ready', prompt, style, resolution })
  } catch (err) {
    console.error('Generate error:', err.message)
    res.status(500).json({ error: 'Failed to generate icon' })
  }
})

module.exports = router
