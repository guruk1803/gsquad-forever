import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../db/connection.js'

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email])

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
    res.status(500).json({ message: 'Login failed' })
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



