import pool from '../db/connection.js'

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

export const deleteCelebration = async (req, res) => {
  try {
    const { id } = req.params
    
    // Validate ID is a number
    if (!id || id === 'new' || id === 'undefined' || isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid celebration ID' })
    }
    
    const celebrationId = parseInt(id)
    const result = await pool.query('DELETE FROM celebrations WHERE id = $1 RETURNING id', [celebrationId])

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Celebration not found' })
    }

    res.json({ message: 'Celebration deleted successfully' })
  } catch (error) {
    console.error('Delete celebration error:', error)
    res.status(500).json({ message: 'Failed to delete celebration' })
  }
}

