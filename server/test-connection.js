import pool from './src/db/connection.js'
import dotenv from 'dotenv'

dotenv.config()

console.log('🧪 Testing Database Connection...\n')

const testConnection = async () => {
  try {
    // Test 1: Basic connection
    console.log('Test 1: Testing basic connection...')
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version')
    console.log('✅ Connection successful!')
    console.log(`   Server time: ${result.rows[0].current_time}`)
    console.log(`   PostgreSQL: ${result.rows[0].pg_version.split(' ')[0]} ${result.rows[0].pg_version.split(' ')[1]}\n`)

    // Test 2: Check if tables exist
    console.log('Test 2: Checking if tables exist...')
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('admins', 'celebrations', 'wishes')
      ORDER BY table_name
    `)
    
    const existingTables = tablesResult.rows.map(row => row.table_name)
    const requiredTables = ['admins', 'celebrations', 'wishes']
    const missingTables = requiredTables.filter(table => !existingTables.includes(table))
    
    if (missingTables.length === 0) {
      console.log('✅ All tables exist!')
      console.log(`   Found: ${existingTables.join(', ')}\n`)
    } else {
      console.log('⚠️  Missing tables:', missingTables.join(', '))
      console.log('   Run: npm run migrate\n')
    }

    // Test 3: Check if admin exists
    console.log('Test 3: Checking if admin user exists...')
    const adminResult = await pool.query('SELECT email FROM admins WHERE email = $1', ['admin@gsquadforever.com'])
    
    if (adminResult.rows.length > 0) {
      console.log('✅ Admin user exists!')
      console.log(`   Email: ${adminResult.rows[0].email}\n`)
    } else {
      console.log('⚠️  Admin user not found')
      console.log('   Run: npm run migrate\n')
    }

    // Test 4: Test a simple query
    console.log('Test 4: Testing query execution...')
    const queryResult = await pool.query('SELECT COUNT(*) as count FROM admins')
    console.log(`✅ Query executed successfully!`)
    console.log(`   Admin count: ${queryResult.rows[0].count}\n`)

    console.log('🎉 All tests passed! Database is ready.\n')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('\nError details:')
    console.error('   Code:', error.code)
    console.error('   Message:', error.message)
    
    if (error.message.includes('does not exist') || error.code === '42P01') {
      console.error('\n💡 Solution: Run migrations')
      console.error('   npm run migrate')
    } else if (error.message.includes('password') || error.message.includes('authentication')) {
      console.error('\n💡 Solution: Check DATABASE_URL in .env file')
      console.error('   Verify username and password are correct')
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('timeout')) {
      console.error('\n💡 Solution: Check database is running and accessible')
      console.error('   Verify DATABASE_URL host and port are correct')
    } else if (error.message.includes('SSL')) {
      console.error('\n💡 Solution: SSL connection issue')
      console.error('   For Supabase, SSL is automatically enabled')
    }
    
    process.exit(1)
  } finally {
    await pool.end()
  }
}

testConnection()









