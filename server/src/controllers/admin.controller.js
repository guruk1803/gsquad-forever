import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../db/connection.js'

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Validate JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is not set in environment variables')
      return res.status(500).json({ message: 'Server configuration error' })
    }

    // Check if admins table exists first
    let result
    try {
      result = await pool.query('SELECT * FROM admins WHERE email = $1', [email])
    } catch (error) {
      if (error.message.includes('does not exist') || error.message.includes('relation') || error.code === '42P01') {
        console.error('❌ Database tables not found. Please run migrations first.')
        console.error('   Run: npm run migrate')
        return res.status(500).json({ 
          message: 'Database not initialized. Please run migrations.',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
      }
      throw error // Re-throw other errors
    }

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const admin = result.rows[0]
    const isValidPassword = await bcrypt.compare(password, admin.password_hash)

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    })
    res.status(500).json({ 
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

export const getMe = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, created_at FROM admins WHERE id = $1', [req.admin.id])
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Admin not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Get me error:', error)
    res.status(500).json({ message: 'Failed to get admin info' })
  }
}



