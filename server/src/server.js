import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import rateLimit from 'express-rate-limit'

// Routes
import adminRoutes from './routes/admin.routes.js'
import celebrationRoutes from './routes/celebration.routes.js'
import wishRoutes from './routes/wish.routes.js'
import uploadRoutes from './routes/upload.routes.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('🌐 CORS: Allowing request with no origin')
      return callback(null, true)
    }
    
    console.log(`🌐 CORS: Checking origin: ${origin}`)
    
    // In development, allow localhost on any port
    if (process.env.NODE_ENV === 'development') {
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        console.log('✅ CORS: Allowed (development localhost)')
        return callback(null, true)
      }
    }
    
    // Build allowed origins list
    const defaultOrigins = ['http://localhost:3000', 'http://localhost:3001']
    
    // Get allowed origins from environment variable
    const envOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(o => o)
      : []
    
    // Combine all allowed origins
    const allowedOrigins = [...defaultOrigins, ...envOrigins]
    
    // Also allow common Vercel deployment URLs (for this specific project)
    // This is a fallback - ideally set ALLOWED_ORIGINS in Render
    const commonVercelUrls = [
      'https://gsquad-forever-client.vercel.app',
      'https://gsquad-forever.vercel.app',
    ]
    
    // Check if origin is in allowed list or common Vercel URLs
    const isAllowed = allowedOrigins.includes(origin) || 
                     (process.env.NODE_ENV === 'production' && commonVercelUrls.includes(origin))
    
    if (isAllowed) {
      console.log(`✅ CORS: Allowed origin: ${origin}`)
      callback(null, true)
    } else {
      console.error(`❌ CORS: Blocked origin: ${origin}`)
      console.error(`   Allowed origins: ${allowedOrigins.join(', ')}`)
      console.error(`   💡 Set ALLOWED_ORIGINS environment variable in Render to include: ${origin}`)
      callback(new Error(`Not allowed by CORS. Origin: ${origin} is not in allowed list.`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use('/api/', limiter)

// Routes
app.use('/api/admin', adminRoutes)
app.use('/api/celebrations', celebrationRoutes)
app.use('/api/wishes', wishRoutes)
app.use('/api/upload', uploadRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Gsquad Forever API is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// 404 handler - Log details for debugging
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`)
  console.log(`   Headers:`, req.headers)
  res.status(404).json({ 
    message: 'Route not found',
    method: req.method,
    path: req.originalUrl,
    availableRoutes: {
      admin: ['POST /api/admin/login', 'GET /api/admin/me'],
      celebrations: ['GET /api/celebrations/slug/:slug', 'GET /api/celebrations', 'POST /api/celebrations', 'PUT /api/celebrations/:id', 'DELETE /api/celebrations/:id'],
      wishes: ['GET /api/wishes/celebration/:celebrationId', 'POST /api/wishes', 'GET /api/wishes', 'PATCH /api/wishes/:id/approve', 'DELETE /api/wishes/:id'],
      upload: ['POST /api/upload/image'],
      health: ['GET /api/health']
    }
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📡 API Health: http://localhost:${PORT}/api/health`)
  console.log(`\n💡 Make sure your frontend is running to connect to this server\n`)
  console.log(`💡 Database connection will be tested automatically...\n`)
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`)
    console.error(`   Either stop the other process or change PORT in .env`)
    console.error(`   To find what's using the port: netstat -ano | findstr :${PORT}`)
  } else {
    console.error('❌ Failed to start server:', err.message)
  }
  process.exit(1)
})

