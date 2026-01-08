import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in environment variables')
  console.error('Please create a .env file in the server directory with:')
  console.error('DATABASE_URL=postgresql://username:password@localhost:5432/database_name')
  process.exit(1)
}

// Parse connection string to validate format
try {
  const url = new URL(process.env.DATABASE_URL)
  if (url.protocol !== 'postgresql:' && url.protocol !== 'postgres:') {
    throw new Error('Invalid protocol. Must be postgresql:// or postgres://')
  }
} catch (error) {
  console.error('❌ Invalid DATABASE_URL format:', error.message)
  console.error('Expected format: postgresql://username:password@host:port/database')
  process.exit(1)
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err.message)
  if (err.message.includes('password')) {
    console.error('💡 Tip: Check that your DATABASE_URL password is properly URL-encoded')
    console.error('   Special characters in passwords need to be encoded (e.g., @ becomes %40)')
  }
})

export default pool

