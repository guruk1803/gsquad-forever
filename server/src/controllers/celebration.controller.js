import pool from '../db/connection.js'
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const getAllCelebrations = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM celebrations ORDER BY created_at DESC'
    )
    res.json(result.rows)
  } catch (error) {
    console.error('Get celebrations error:', error)
    res.status(500).json({ message: 'Failed to fetch celebrations' })
  }
}

export const getCelebrationById = async (req, res) => {
  try {
    // Get ID from params with defensive checks
    const id = req.params?.id
    
    // Early return for invalid IDs - check before any database operations
    if (!id || 
        id === 'undefined' || 
        id === 'null' || 
        id === 'new' || 
        id === '' || 
        String(id).trim() === '' ||
        String(id).toLowerCase() === 'undefined') {
      console.warn('⚠️ Invalid celebration ID received:', id)
      return res.status(400).json({ 
        message: 'Invalid celebration ID',
        received: id 
      })
    }
    
    // Parse as integer with radix
    const celebrationId = parseInt(String(id).trim(), 10)
    
    // Validate it's a valid positive integer
    if (isNaN(celebrationId) || !Number.isInteger(celebrationId) || celebrationId <= 0) {
      console.warn('⚠️ ID is not a valid positive integer:', id, '->', celebrationId)
      return res.status(400).json({ 
        message: 'Invalid celebration ID: must be a positive integer',
        received: id 
      })
    }
    
    // Now safe to query database
    const result = await pool.query('SELECT * FROM celebrations WHERE id = $1', [celebrationId])

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Celebration not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Get celebration error:', error)
    res.status(500).json({ message: 'Failed to fetch celebration' })
  }
}

export const getCelebrationBySlug = async (req, res) => {
  try {
    let { slug } = req.params
    
    // Clean slug - remove any URL parts that might have been included
    slug = slug.replace(/^https?:\/\/[^\/]+/, '').replace(/^\//, '')
    
    console.log('🔍 Fetching celebration by slug:', slug)
    
    const result = await pool.query('SELECT * FROM celebrations WHERE slug = $1', [slug])

    if (result.rows.length === 0) {
      console.log('❌ Celebration not found with slug:', slug)
      return res.status(404).json({ message: 'Celebration not found' })
    }

    console.log('✅ Celebration found:', result.rows[0].title)
    res.json(result.rows[0])
  } catch (error) {
    console.error('❌ Get celebration by slug error:', error)
    res.status(500).json({ message: 'Failed to fetch celebration' })
  }
}

export const createCelebration = async (req, res) => {
  try {
    console.log('Create celebration request received')
    const {
      title,
      subtitle,
      slug: rawSlug,
      eventType,
      eventDate,
      story,
      coverImage,
      images,
      videos,
      qrImage,
      moneyCollectionEnabled,
      theme,
      sections,
      quotes,
    } = req.body

    // Clean and validate slug
    let slug = rawSlug
    if (slug) {
      // Remove any URL parts
      slug = slug.replace(/^https?:\/\/[^\/]+/, '').replace(/^\//, '').trim()
      
      // Validate slug format (only lowercase letters, numbers, hyphens)
      if (!/^[a-z0-9-]+$/.test(slug)) {
        return res.status(400).json({ 
          message: 'Slug can only contain lowercase letters, numbers, and hyphens',
          received: rawSlug,
          cleaned: slug
        })
      }
      
      // Ensure slug is not empty after cleaning
      if (!slug || slug.length === 0) {
        return res.status(400).json({ message: 'Invalid slug format' })
      }
    }

    console.log('Received data:', { title, slug, eventType, originalSlug: rawSlug })

    if (!title || !slug) {
      return res.status(400).json({ message: 'Title and slug are required' })
    }

    // Check if slug already exists
    const existing = await pool.query('SELECT id FROM celebrations WHERE slug = $1', [slug])
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Slug already exists' })
    }

    const result = await pool.query(
      `INSERT INTO celebrations (
        title, subtitle, slug, event_type, event_date, story, cover_image,
        images, videos, qr_image, spotify_code, money_collection_enabled, theme, sections, quotes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        title,
        subtitle || null,
        slug,
        eventType || 'wedding',
        eventDate || null,
        story || null,
        coverImage || null,
        images || [],
        videos || [],
        qrImage || null,
        req.body.spotifyCode || null,
        moneyCollectionEnabled || false,
        JSON.stringify(theme || { primaryColor: '#9B7EDE', secondaryColor: '#E8D5FF', animationsEnabled: true }),
        JSON.stringify(sections || { header: true, story: true, gallery: true, wishes: true, contribution: true }),
        quotes || [],
      ]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Create celebration error:', error)
    res.status(500).json({ message: 'Failed to create celebration' })
  }
}

export const updateCelebration = async (req, res) => {
  try {
    const { id } = req.params
    
    // Validate ID is a number
    if (!id || id === 'new' || id === 'undefined' || isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid celebration ID' })
    }
    
    const celebrationId = parseInt(id)
    const {
      title,
      subtitle,
      slug,
      eventType,
      eventDate,
      story,
      coverImage,
      images,
      videos,
      qrImage,
      spotifyCode,
      moneyCollectionEnabled,
      theme,
      sections,
      quotes,
    } = req.body

    // Check if celebration exists
    const existing = await pool.query('SELECT id FROM celebrations WHERE id = $1', [celebrationId])
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Celebration not found' })
    }

    // Clean and validate slug if provided
    let cleanSlug = slug
    if (cleanSlug) {
      cleanSlug = cleanSlug.replace(/^https?:\/\/[^\/]+/, '').replace(/^\//, '').trim()
      if (!/^[a-z0-9-]+$/.test(cleanSlug)) {
        return res.status(400).json({ 
          message: 'Slug can only contain lowercase letters, numbers, and hyphens'
        })
      }
    }
    
    // Check if slug is being changed and if it's already taken
    if (cleanSlug) {
      const slugCheck = await pool.query('SELECT id FROM celebrations WHERE slug = $1 AND id != $2', [cleanSlug, celebrationId])
      if (slugCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Slug already exists' })
      }
    }

    const result = await pool.query(
      `UPDATE celebrations SET
        title = COALESCE($1, title),
        subtitle = COALESCE($2, subtitle),
        slug = COALESCE($3::text, slug),
        event_type = COALESCE($4, event_type),
        event_date = COALESCE($5, event_date),
        story = COALESCE($6, story),
        cover_image = COALESCE($7, cover_image),
        images = COALESCE($8, images),
        videos = COALESCE($9, videos),
        qr_image = COALESCE($10, qr_image),
        spotify_code = COALESCE($11, spotify_code),
        money_collection_enabled = COALESCE($12, money_collection_enabled),
        theme = COALESCE($13::jsonb, theme),
        sections = COALESCE($14::jsonb, sections),
        quotes = COALESCE($15, quotes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $16
      RETURNING *`,
      [
        title,
        subtitle,
        cleanSlug || null, // Use cleaned slug at position $3
        eventType,
        eventDate,
        story,
        coverImage,
        images,
        videos,
        qrImage,
        spotifyCode || null,
        moneyCollectionEnabled,
        theme ? JSON.stringify(theme) : null,
        sections ? JSON.stringify(sections) : null,
        quotes,
        celebrationId,
      ]
    )

    res.json(result.rows[0])
  } catch (error) {
    console.error('Update celebration error:', error)
    res.status(500).json({ message: 'Failed to update celebration' })
  }
}

/**
 * Extract Cloudinary public_id from a Cloudinary URL
 * Handles various Cloudinary URL formats:
 * - https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.{format}
 * - https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
 * - https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}.{format}
 * - https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{transformations}/{public_id}.{format}
 */
const extractPublicId = (url) => {
  if (!url || typeof url !== 'string') return null
  
  try {
    // Check if it's a Cloudinary URL
    if (!url.includes('cloudinary.com')) return null
    
    // Extract the path after /image/upload/
    // Pattern: /image/upload/(optional version/)(optional transformations/)(public_id).(format)
    const uploadMatch = url.match(/\/image\/upload\/(?:v\d+\/)?(?:[^\/]+\/)*(.+)/)
    if (!uploadMatch) return null
    
    // Get the public_id (last part after all transformations)
    let publicId = uploadMatch[1]
    
    // Remove file extension if present
    publicId = publicId.replace(/\.(jpg|jpeg|png|gif|webp|webm|mp4)$/i, '')
    
    // Remove query parameters if any
    publicId = publicId.split('?')[0]
    
    return publicId
  } catch (error) {
    console.error('Error extracting public_id from URL:', url, error)
    return null
  }
}

/**
 * Delete an image or video from Cloudinary by public_id
 */
const deleteCloudinaryMedia = async (publicId, resourceType = 'image') => {
  if (!publicId) return false
  
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      console.warn('⚠️ Cloudinary not configured, skipping media deletion')
      return false
    }
    
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    })
    
    if (result.result === 'ok' || result.result === 'not found') {
      console.log(`✅ Deleted ${resourceType} from Cloudinary: ${publicId}`)
      return true
    } else {
      console.warn(`⚠️ Failed to delete ${resourceType} from Cloudinary: ${publicId}`, result)
      return false
    }
  } catch (error) {
    console.error(`❌ Error deleting ${resourceType} from Cloudinary (${publicId}):`, error.message)
    return false
  }
}

/**
 * Delete all images and videos associated with a celebration from Cloudinary
 */
const deleteCelebrationMedia = async (celebration) => {
  const deletedMedia = []
  const failedMedia = []
  
  // Collect all image URLs
  const imageUrls = []
  
  // Cover image
  if (celebration.cover_image) {
    imageUrls.push({ url: celebration.cover_image, type: 'image' })
  }
  
  // Images array
  if (celebration.images && Array.isArray(celebration.images)) {
    imageUrls.push(...celebration.images.map(url => ({ url, type: 'image' })))
  }
  
  // QR image
  if (celebration.qr_image) {
    imageUrls.push({ url: celebration.qr_image, type: 'image' })
  }
  
  // Spotify code image
  if (celebration.spotify_code) {
    imageUrls.push({ url: celebration.spotify_code, type: 'image' })
  }
  
  // Videos array
  if (celebration.videos && Array.isArray(celebration.videos)) {
    imageUrls.push(...celebration.videos.map(url => ({ url, type: 'video' })))
  }
  
  // Delete each media item
  for (const { url, type } of imageUrls) {
    if (!url) continue
    
    const publicId = extractPublicId(url)
    if (!publicId) {
      console.warn(`⚠️ Could not extract public_id from URL: ${url}`)
      continue
    }
    
    const deleted = await deleteCloudinaryMedia(publicId, type)
    if (deleted) {
      deletedMedia.push({ publicId, type })
    } else {
      failedMedia.push({ publicId, type })
    }
  }
  
  return { deletedMedia, failedMedia }
}

export const deleteCelebration = async (req, res) => {
  try {
    const { id } = req.params
    
    // Validate ID is a number
    if (!id || id === 'new' || id === 'undefined' || isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid celebration ID' })
    }
    
    const celebrationId = parseInt(id)
    
    // First, fetch the celebration to get all image URLs
    const celebrationResult = await pool.query(
      'SELECT * FROM celebrations WHERE id = $1',
      [celebrationId]
    )
    
    if (celebrationResult.rows.length === 0) {
      return res.status(404).json({ message: 'Celebration not found' })
    }
    
    const celebration = celebrationResult.rows[0]
    
    // Delete all images and videos from Cloudinary
    console.log(`🗑️ Deleting media for celebration: ${celebration.title} (ID: ${celebrationId})`)
    const { deletedMedia, failedMedia } = await deleteCelebrationMedia(celebration)
    
    const imageCount = deletedMedia.filter(m => m.type === 'image').length
    const videoCount = deletedMedia.filter(m => m.type === 'video').length
    console.log(`✅ Deleted ${imageCount} images and ${videoCount} videos from Cloudinary`)
    if (failedMedia.length > 0) {
      console.warn(`⚠️ Failed to delete ${failedMedia.length} media items from Cloudinary`)
    }
    
    // Delete the celebration from database (this will cascade delete wishes due to ON DELETE CASCADE)
    const deleteResult = await pool.query(
      'DELETE FROM celebrations WHERE id = $1 RETURNING id',
      [celebrationId]
    )
    
    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ message: 'Celebration not found' })
    }
    
    res.json({ 
      message: 'Celebration deleted successfully',
      deletedMedia: deletedMedia.length,
      failedMedia: failedMedia.length
    })
  } catch (error) {
    console.error('Delete celebration error:', error)
    res.status(500).json({ message: 'Failed to delete celebration' })
  }
}

