const express = require('express')
const router = express.Router()
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// POST /api/upload
router.post('/', async (req, res) => {
  try {
    const { imageBase64, fileName } = req.body

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' })
    }

    // TODO Task 13: implement full upload logic
    // Placeholder response for now
    res.json({ message: 'Upload endpoint ready' })
  } catch (err) {
    console.error('Upload error:', err.message)
    res.status(500).json({ error: 'Failed to upload image' })
  }
})

module.exports = router
