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

// Parse connection string to validate format and detect Supabase
let isSupabase = false
let connectionHost = ''
try {
  const url = new URL(process.env.DATABASE_URL)
  if (url.protocol !== 'postgresql:' && url.protocol !== 'postgres:') {
    throw new Error('Invalid protocol. Must be postgresql:// or postgres://')
  }
  connectionHost = url.hostname
  // Detect Supabase by hostname
  isSupabase = connectionHost.includes('supabase.co') || connectionHost.includes('supabase.com')
} catch (error) {
  console.error('❌ Invalid DATABASE_URL format:', error.message)
  console.error('Expected format: postgresql://username:password@host:port/database')
  process.exit(1)
}

// Configure SSL - Supabase always requires SSL
// For Supabase, always use SSL. For others, use SSL in production only.
const sslConfig = isSupabase || process.env.NODE_ENV === 'production'
  ? { rejectUnauthorized: false }
  : false

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
  // Connection pool settings for better reliability
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

// Test connection on startup
let connectionTested = false

const testConnection = async () => {
  if (connectionTested) return
  
  try {
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version')
    connectionTested = true
    console.log('✅ Database connection successful')
    if (isSupabase) {
      console.log('📊 Connected to Supabase PostgreSQL')
    }
    console.log(`🕐 Server time: ${result.rows[0].current_time}`)
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message)
    console.error('💡 Check your DATABASE_URL in environment variables')
    if (error.message.includes('password')) {
      console.error('💡 Tip: Special characters in passwords need URL encoding')
      console.error('   Example: @ becomes %40, # becomes %23')
    }
    if (error.message.includes('SSL') || error.message.includes('ssl')) {
      console.error('💡 Tip: Supabase requires SSL. Make sure SSL is enabled.')
    }
    // Don't exit - let the app try to connect on first query
  }
}

// Test connection after a short delay (to allow server to start)
setTimeout(testConnection, 1000)

// Connection event handlers
pool.on('connect', (client) => {
  if (!connectionTested) {
    console.log('✅ New database connection established')
  }
})

pool.on('error', (err, client) => {
  console.error('❌ Database connection pool error:', err.message)
  console.error('   This might be a temporary issue. The app will retry on next query.')
  
  if (err.message.includes('password') || err.message.includes('authentication')) {
    console.error('💡 Check your DATABASE_URL password is correct')
  }
  if (err.message.includes('SSL') || err.message.includes('ssl')) {
    console.error('💡 Supabase requires SSL connections')
  }
  if (err.message.includes('timeout') || err.message.includes('ECONNREFUSED')) {
    console.error('💡 Check that your database is accessible and DATABASE_URL is correct')
  }
})

export default pool

