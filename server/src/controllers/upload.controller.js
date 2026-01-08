import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'
import dotenv from 'dotenv'

dotenv.config()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Configure multer for memory storage
const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(file.originalname.toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  },
})

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'gsquad-forever',
        transformation: [{ width: 1920, height: 1080, crop: 'limit' }],
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )
    
    const readable = new Readable()
    readable.push(buffer)
    readable.push(null)
    readable.pipe(uploadStream)
  })
}

export const uploadImage = async (req, res) => {
  console.log('📤 Image upload request received')
  console.log('Request headers:', {
    'content-type': req.headers['content-type'],
    'content-length': req.headers['content-length'],
  })
  
  // Check Cloudinary configuration
  if (!process.env.CLOUDINARY_CLOUD_NAME || 
      !process.env.CLOUDINARY_API_KEY || 
      !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Cloudinary not configured! Missing credentials in .env')
    return res.status(500).json({ 
      message: 'Image upload service not configured. Please contact administrator.',
      error: 'CLOUDINARY_NOT_CONFIGURED'
    })
  }
  
  upload.single('image')(req, res, async (err) => {
    if (err) {
      console.error('❌ Multer error:', err.message)
      console.error('Error details:', err)
      return res.status(400).json({ 
        message: err.message || 'File upload error',
        error: 'UPLOAD_ERROR'
      })
    }

    if (!req.file) {
      console.error('❌ No file in request')
      return res.status(400).json({ 
        message: 'No file uploaded',
        error: 'NO_FILE'
      })
    }

    console.log('📁 File received:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      bufferLength: req.file.buffer?.length,
    })

    // Validate file size
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (req.file.size > maxSize) {
      console.error('❌ File too large:', req.file.size, 'bytes')
      return res.status(400).json({ 
        message: 'File size exceeds 10MB limit',
        error: 'FILE_TOO_LARGE'
      })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(req.file.mimetype)) {
      console.error('❌ Invalid file type:', req.file.mimetype)
      return res.status(400).json({ 
        message: 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed',
        error: 'INVALID_FILE_TYPE'
      })
    }

    try {
      console.log('☁️ Uploading to Cloudinary...')
      const result = await uploadToCloudinary(req.file.buffer)
      
      if (!result || !result.secure_url) {
        throw new Error('Cloudinary returned invalid response')
      }
      
      console.log('✅ Cloudinary upload successful:', {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      })
      
      res.json({
        url: result.secure_url,
        publicId: result.public_id,
      })
    } catch (uploadError) {
      console.error('❌ Cloudinary upload error:', uploadError)
      console.error('Error details:', {
        message: uploadError.message,
        http_code: uploadError.http_code,
        name: uploadError.name,
      })
      
      let errorMessage = 'Failed to upload image to cloud storage'
      
      if (uploadError.http_code === 401) {
        errorMessage = 'Cloudinary authentication failed. Check API credentials.'
      } else if (uploadError.http_code === 400) {
        errorMessage = 'Invalid image file or format'
      } else if (uploadError.message) {
        errorMessage = uploadError.message
      }
      
      res.status(500).json({ 
        message: errorMessage,
        error: 'CLOUDINARY_UPLOAD_FAILED',
        details: process.env.NODE_ENV === 'development' ? uploadError.message : undefined
      })
    }
  })
}

