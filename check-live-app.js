// Quick script to check live app status
import axios from 'axios'

const BACKEND_URL = 'https://gsquad-forever.onrender.com'
const FRONTEND_URL = 'https://gsquad-forever-client.vercel.app'

console.log('🔍 Checking Live App Status...\n')

// Test Backend Health
async function checkBackend() {
  try {
    console.log('📡 Testing Backend API...')
    const response = await axios.get(`${BACKEND_URL}/api/health`, {
      timeout: 10000
    })
    console.log('✅ Backend is UP!')
    console.log('   Status:', response.status)
    console.log('   Response:', response.data)
    return true
  } catch (error) {
    console.log('❌ Backend is DOWN or unreachable')
    if (error.response) {
      console.log('   Status:', error.response.status)
      console.log('   Error:', error.response.data)
    } else if (error.request) {
      console.log('   Error: No response from server')
      console.log('   This might mean:')
      console.log('   - Server is starting up (wait 2-3 minutes)')
      console.log('   - Server crashed (check Render logs)')
      console.log('   - Network issue')
    } else {
      console.log('   Error:', error.message)
    }
    return false
  }
}

// Test Frontend
async function checkFrontend() {
  try {
    console.log('\n🌐 Testing Frontend...')
    const response = await axios.get(FRONTEND_URL, {
      timeout: 10000,
      validateStatus: () => true // Accept any status code
    })
    console.log('✅ Frontend is UP!')
    console.log('   Status:', response.status)
    if (response.status === 200) {
      console.log('   ✅ Frontend is serving content')
    } else if (response.status === 404) {
      console.log('   ⚠️  Frontend returned 404 - check vercel.json routing')
    }
    return true
  } catch (error) {
    console.log('❌ Frontend is DOWN or unreachable')
    if (error.response) {
      console.log('   Status:', error.response.status)
    } else if (error.request) {
      console.log('   Error: No response from server')
      console.log('   This might mean:')
      console.log('   - Vercel is deploying (wait 1-2 minutes)')
      console.log('   - Build failed (check Vercel logs)')
    } else {
      console.log('   Error:', error.message)
    }
    return false
  }
}

// Test Database Connection (via login endpoint)
async function checkDatabase() {
  try {
    console.log('\n💾 Testing Database Connection...')
    const response = await axios.post(
      `${BACKEND_URL}/api/admin/login`,
      {
        email: 'admin@gsquadforever.com',
        password: 'admin123'
      },
      {
        timeout: 15000,
        validateStatus: () => true // Accept any status code
      }
    )
    
    if (response.status === 200) {
      console.log('✅ Database is CONNECTED!')
      console.log('   Login successful - database and tables exist')
      return true
    } else if (response.status === 401) {
      console.log('⚠️  Database connected but login failed')
      console.log('   Status:', response.status)
      console.log('   Response:', response.data)
      console.log('   This might mean:')
      console.log('   - Wrong credentials')
      console.log('   - Admin user not created')
      return false
    } else if (response.status === 500) {
      console.log('❌ Database connection FAILED')
      console.log('   Status:', response.status)
      console.log('   Error:', response.data?.message || response.data)
      if (response.data?.message?.includes('migrations')) {
        console.log('   💡 Solution: Run migrations in Neon SQL Editor')
      } else if (response.data?.message?.includes('Tenant')) {
        console.log('   💡 Solution: Run migrations in Neon SQL Editor')
      }
      return false
    } else {
      console.log('⚠️  Unexpected response')
      console.log('   Status:', response.status)
      console.log('   Response:', response.data)
      return false
    }
  } catch (error) {
    console.log('❌ Database test FAILED')
    if (error.response) {
      console.log('   Status:', error.response.status)
      console.log('   Error:', error.response.data)
    } else if (error.request) {
      console.log('   Error: No response from server')
    } else {
      console.log('   Error:', error.message)
    }
    return false
  }
}

// Run all checks
async function runChecks() {
  const backendOk = await checkBackend()
  const frontendOk = await checkFrontend()
  const databaseOk = await checkDatabase()
  
  console.log('\n' + '='.repeat(50))
  console.log('📊 Summary:')
  console.log('   Backend:', backendOk ? '✅ UP' : '❌ DOWN')
  console.log('   Frontend:', frontendOk ? '✅ UP' : '❌ DOWN')
  console.log('   Database:', databaseOk ? '✅ CONNECTED' : '❌ FAILED')
  console.log('='.repeat(50))
  
  if (backendOk && frontendOk && databaseOk) {
    console.log('\n🎉 All systems operational!')
    console.log('   Frontend:', FRONTEND_URL)
    console.log('   Backend:', BACKEND_URL)
  } else {
    console.log('\n⚠️  Some issues detected. Check the details above.')
  }
}

runChecks().catch(console.error)

