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

// Add connection parameters to URL for pooler (helps with reliability)
let finalConnectionString = connectionString
if (usePooler) {
  // Add query parameters for pooler connection
  const url = new URL(connectionString)
  // Add pgbouncer=true for pooler connections
  url.searchParams.set('pgbouncer', 'true')
  // Add connection parameters
  url.searchParams.set('connect_timeout', '30')
  finalConnectionString = url.toString()
  console.log('🔧 Added pooler connection parameters')
}

// Connection pool settings - optimized for pooler connections
const poolConfig = {
  connectionString: finalConnectionString,
  ssl: sslConfig,
  // Connection pool settings for better reliability
  max: usePooler ? 5 : 20, // Reduce pooler connections further to avoid limits
  idleTimeoutMillis: 30000,
  // Increase timeout for pooler connections (they can be slower to establish)
  connectionTimeoutMillis: usePooler ? 60000 : 10000, // 60s for pooler, 10s for direct
  // Statement timeout for queries (prevent hanging queries)
  statement_timeout: 30000, // 30 seconds
  // Keep connections alive
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
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

// Retry connection with exponential backoff
const testConnectionWithRetry = async (retries = 3, delay = 2000) => {
  if (connectionTested) return
  
  for (let i = 0; i < retries; i++) {
    try {
      const result = await pool.query('SELECT NOW() as current_time, version() as pg_version')
      connectionTested = true
      console.log('✅ Database connection successful')
      if (isSupabase) {
        console.log('📊 Connected to Supabase PostgreSQL')
        if (usePooler) {
          console.log('   Using pooler connection (port 6543)')
        }
      }
      console.log(`🕐 Server time: ${result.rows[0].current_time}`)
      return // Success, exit retry loop
    } catch (error) {
      if (i === retries - 1) {
        // Last retry failed, log error
        throw error
      }
      // Wait before retrying with exponential backoff
      const waitTime = delay * Math.pow(2, i)
      console.log(`⚠️  Connection attempt ${i + 1}/${retries} failed, retrying in ${waitTime}ms...`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }
}

const testConnection = async () => {
  if (connectionTested) return
  
  try {
    await testConnectionWithRetry()
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message)
    console.error('💡 Check your DATABASE_URL in environment variables')
    
    if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      console.error('💡 Connection timeout - possible causes:')
      console.error('   1. Network issue between Render and Supabase')
      console.error('   2. Supabase project might be paused (check dashboard)')
      console.error('   3. Firewall blocking connection')
      if (usePooler) {
        console.error('   4. Pooler might be overloaded or region mismatch')
        console.error('   💡 Try: Transaction mode instead of Session mode')
        console.error('   💡 Or: Check if Supabase project region matches connection string')
        console.error('   💡 The app will retry on first query - this might work')
      }
      console.error('   💡 Connection will be retried automatically on next query')
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
    if (usePooler) {
      console.error('💡 If timeout persists, try Transaction mode instead of Session mode')
    }
  }
})

// Helper function to retry queries with exponential backoff
export const queryWithRetry = async (queryText, params = [], retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await pool.query(queryText, params)
    } catch (error) {
      const isLastAttempt = i === retries - 1
      const isTimeout = error.message.includes('timeout') || error.message.includes('ETIMEDOUT')
      
      if (isLastAttempt || !isTimeout) {
        throw error // Don't retry if not timeout or last attempt
      }
      
      // Wait before retrying (exponential backoff)
      const waitTime = 1000 * Math.pow(2, i)
      console.log(`⚠️  Query timeout, retrying in ${waitTime}ms... (attempt ${i + 1}/${retries})`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }
}

export default pool

