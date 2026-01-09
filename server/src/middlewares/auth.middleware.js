import jwt from 'jsonwebtoken'
import pool from '../db/connection.js'

export const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Verify admin still exists
    const result = await pool.query('SELECT id, email FROM admins WHERE id = $1', [decoded.adminId])
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Admin not found' })
    }

    req.admin = result.rows[0]
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }
    res.status(500).json({ message: 'Authentication error' })
  }
}



