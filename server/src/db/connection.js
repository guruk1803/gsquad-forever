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

// Parse connection string to check if we should use pooler
const connectionString = process.env.DATABASE_URL
const usePooler = connectionString.includes('pooler.supabase.com') || connectionString.includes(':6543')

// For Supabase, prefer pooler connection (port 6543) over direct (port 5432)
// Pooler is more reliable for serverless/hosting platforms and avoids IPv6 issues
if (isSupabase && !usePooler) {
  console.warn('⚠️  Using direct Supabase connection. Consider using pooler for better reliability.')
  console.warn('   Pooler URL format: postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres')
}

// Connection pool settings - optimized for pooler connections
const poolConfig = {
  connectionString: connectionString,
  ssl: sslConfig,
  // Connection pool settings for better reliability
  max: usePooler ? 10 : 20, // Pooler has connection limits, use fewer connections
  idleTimeoutMillis: 30000,
  // Increase timeout for pooler connections (they can be slower to establish)
  connectionTimeoutMillis: usePooler ? 30000 : 10000, // 30s for pooler, 10s for direct
  // Statement timeout for queries (prevent hanging queries)
  statement_timeout: 30000, // 30 seconds
}

// Log connection details
if (usePooler) {
  console.log('🔗 Using Supabase pooler connection (port 6543)')
  console.log('   Connection timeout: 30s')
} else if (isSupabase) {
  console.log('🔗 Using Supabase direct connection (port 5432)')
  console.log('   Connection timeout: 10s')
}

const pool = new Pool(poolConfig)

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
    
    if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      console.error('💡 Connection timeout - possible causes:')
      console.error('   1. Network issue between Render and Supabase')
      console.error('   2. Supabase project might be paused (check dashboard)')
      console.error('   3. Firewall blocking connection')
      if (usePooler) {
        console.error('   4. Pooler might be overloaded (try again in a moment)')
        console.error('   💡 The app will retry on first query - this might work')
      }
    }
    
    if (error.message.includes('password') || error.message.includes('authentication')) {
      console.error('💡 Tip: Special characters in passwords need URL encoding')
      console.error('   Example: @ becomes %40, # becomes %23')
    }
    if (error.message.includes('SSL') || error.message.includes('ssl')) {
      console.error('💡 Tip: Supabase requires SSL. Make sure SSL is enabled.')
    }
    if (error.message.includes('ENOTFOUND') || error.message.includes('ENETUNREACH')) {
      console.error('💡 Tip: Check that the hostname in DATABASE_URL is correct')
      if (usePooler) {
        console.error('   Pooler format: aws-0-[REGION].pooler.supabase.com:6543')
      }
    }
    
    // Don't exit - let the app try to connect on first query
    // Sometimes the initial test fails but actual queries work
  }
}

// Test connection after a short delay (to allow server to start)
// Only test if pool hasn't been closed (not in migration script)
if (typeof process.env.SKIP_CONNECTION_TEST === 'undefined') {
  setTimeout(() => {
    if (!pool.ended) {
      testConnection().catch(() => {
        // Ignore errors in background test
      })
    }
  }, 1000)
}

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

