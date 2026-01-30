import pool from '../db/connection.js'

export const getAllWishes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT w.*, c.title as celebration_title, c.slug as celebration_slug
       FROM wishes w
       LEFT JOIN celebrations c ON w.celebration_id = c.id
       ORDER BY w.created_at DESC`
    )
    
    // Format the response
    const wishes = result.rows.map(wish => ({
      ...wish,
      celebration: wish.celebration_title ? {
        title: wish.celebration_title,
        slug: wish.celebration_slug,
      } : null,
    }))
    
    res.json(wishes)
  } catch (error) {
    console.error('Get wishes error:', error)
    res.status(500).json({ message: 'Failed to fetch wishes' })
  }
}

export const getWishesByCelebration = async (req, res) => {
  try {
    const { celebrationId } = req.params
    
    // Validate ID is a number
    if (!celebrationId || celebrationId === 'undefined' || isNaN(parseInt(celebrationId))) {
      return res.status(400).json({ message: 'Invalid celebration ID' })
    }
    
    const id = parseInt(celebrationId)
    const result = await pool.query(
      'SELECT * FROM wishes WHERE celebration_id = $1 ORDER BY created_at DESC',
      [id]
    )
    res.json(result.rows)
  } catch (error) {
    console.error('Get wishes by celebration error:', error)
    res.status(500).json({ message: 'Failed to fetch wishes' })
  }
}

export const createWish = async (req, res) => {
  try {
    const { celebrationId, name, message, amount } = req.body

    if (!celebrationId || !name || !message) {
      return res.status(400).json({ message: 'Celebration ID, name, and message are required' })
    }

    // Verify celebration exists
    const celebrationCheck = await pool.query('SELECT id FROM celebrations WHERE id = $1', [celebrationId])
    if (celebrationCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Celebration not found' })
    }

    // Wishes need admin approval before showing on public page
    const result = await pool.query(
      `INSERT INTO wishes (celebration_id, name, message, amount, approved)
       VALUES ($1, $2, $3, $4, false)
       RETURNING *`,
      [celebrationId, name, message, amount || null]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Create wish error:', error)
    res.status(500).json({ message: 'Failed to create wish' })
  }
}

export const approveWish = async (req, res) => {
  try {
    const { id } = req.params
    
    // Validate ID is a number
    if (!id || id === 'undefined' || isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid wish ID' })
    }
    
    const wishId = parseInt(id)
    const result = await pool.query(
      'UPDATE wishes SET approved = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [wishId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Wish not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Approve wish error:', error)
    res.status(500).json({ message: 'Failed to approve wish' })
  }
}

export const deleteWish = async (req, res) => {
  try {
    const { id } = req.params
    
    // Validate ID is a number
    if (!id || id === 'undefined' || isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid wish ID' })
    }
    
    const wishId = parseInt(id)
    const result = await pool.query('DELETE FROM wishes WHERE id = $1 RETURNING id', [wishId])

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Wish not found' })
    }

    res.json({ message: 'Wish deleted successfully' })
  } catch (error) {
    console.error('Delete wish error:', error)
    res.status(500).json({ message: 'Failed to delete wish' })
  }
}

