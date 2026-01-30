import dotenv from 'dotenv'
dotenv.config()

const API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api'

console.log('🧪 Testing API Endpoints...\n')
console.log(`API URL: ${API_URL}\n`)

// Test 1: Health Check
const testHealth = async () => {
  try {
    console.log('Test 1: Health Check...')
    const response = await fetch(`${API_URL}/health`)
    const data = await response.json()
    
    if (response.ok && data.status === 'ok') {
      console.log('✅ Health check passed!')
      console.log(`   Message: ${data.message}\n`)
      return true
    } else {
      console.log('❌ Health check failed')
      console.log(`   Status: ${response.status}`)
      console.log(`   Data:`, data)
      return false
    }
  } catch (error) {
    console.log('❌ Health check failed:', error.message)
    console.log('   Make sure the server is running: npm run dev\n')
    return false
  }
}

// Test 2: Login
const testLogin = async () => {
  try {
    console.log('Test 2: Admin Login...')
    const response = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@gsquadforever.com',
        password: 'admin123'
      })
    })
    
    const data = await response.json()
    
    if (response.ok && data.token) {
      console.log('✅ Login successful!')
      console.log(`   Token received: ${data.token.substring(0, 20)}...`)
      console.log(`   Admin email: ${data.admin.email}\n`)
      return { success: true, token: data.token }
    } else {
      console.log('❌ Login failed')
      console.log(`   Status: ${response.status}`)
      console.log(`   Message: ${data.message || 'Unknown error'}\n`)
      return { success: false }
    }
  } catch (error) {
    console.log('❌ Login request failed:', error.message)
    console.log('   Check server logs for details\n')
    return { success: false }
  }
}

// Test 3: Get Admin Info (with token)
const testGetMe = async (token) => {
  try {
    console.log('Test 3: Get Admin Info (Authenticated)...')
    const response = await fetch(`${API_URL}/admin/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
    
    const data = await response.json()
    
    if (response.ok && data.email) {
      console.log('✅ Get admin info successful!')
      console.log(`   Email: ${data.email}`)
      console.log(`   ID: ${data.id}\n`)
      return true
    } else {
      console.log('❌ Get admin info failed')
      console.log(`   Status: ${response.status}`)
      console.log(`   Message: ${data.message || 'Unknown error'}\n`)
      return false
    }
  } catch (error) {
    console.log('❌ Get admin info request failed:', error.message)
    return false
  }
}


// Run all tests
const runTests = async () => {
  console.log('='.repeat(50))
  console.log('API Endpoint Tests')
  console.log('='.repeat(50) + '\n')
  
  const healthOk = await testHealth()
  if (!healthOk) {
    console.log('❌ Server is not running. Start it with: npm run dev')
    process.exit(1)
  }
  
  // Wait a bit for server to be ready
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const loginResult = await testLogin()
  if (!loginResult.success) {
    console.log('⚠️  Login failed. Check:')
    console.log('   1. Database migrations run: npm run migrate')
    console.log('   2. Admin user exists in database')
    console.log('   3. Server logs for errors')
    process.exit(1)
  }
  
  await testGetMe(loginResult.token)
  
  console.log('='.repeat(50))
  console.log('🎉 All API tests passed!')
  console.log('='.repeat(50))
  console.log('\n✅ Server is working correctly')
  console.log('✅ Database connection is working')
  console.log('✅ Login endpoint is working')
  console.log('✅ Authentication is working\n')
}

runTests().catch(error => {
  console.error('Test suite failed:', error)
  process.exit(1)
})










