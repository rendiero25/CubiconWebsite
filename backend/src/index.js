require('dotenv').config()

const express = require('express')
const cors = require('cors')
const path = require('path')

const generateRoute = require('./routes/generate')
const uploadRoute = require('./routes/upload')
const adminRoute = require('./routes/admin')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))

// API Routes
app.use('/api/generate', generateRoute)
app.use('/api/upload', uploadRoute)
app.use('/api/admin', adminRoute)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Serve frontend build (production)
const frontendBuild = path.join(__dirname, '../../frontend/dist')
app.use(express.static(frontendBuild))
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuild, 'index.html'))
})

app.listen(PORT, () => {
  const env = process.env.NODE_ENV ?? 'development'
  console.log(`Cubicon server running at http://localhost:${PORT} [${env}]`)
  console.log(`Frontend origin: ${process.env.FRONTEND_URL ?? 'http://localhost:5173'}`)
})
