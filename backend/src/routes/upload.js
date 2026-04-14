const express = require('express')
const router = express.Router()
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// POST /api/upload
// Body: { imageBase64: string (data URL or raw base64), fileName?: string }
// Returns: { url: string } — Cloudinary secure URL
router.post('/', async (req, res) => {
  try {
    const { imageBase64, fileName } = req.body

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' })
    }

    const uploadResult = await cloudinary.uploader.upload(imageBase64, {
      public_id: `${fileName || 'cubicon'}-${Date.now()}`,
      folder: 'cubicon',
      resource_type: 'image',
      overwrite: false,
    })

    return res.json({ url: uploadResult.secure_url })
  } catch (err) {
    console.error('Upload error:', err.message)
    return res.status(500).json({ error: err.message || 'Failed to upload image' })
  }
})

module.exports = router
