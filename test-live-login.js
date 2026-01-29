/**
 * Test Live Login Endpoint
 * Run with: node test-live-login.js
 */

const https = require('https');

const BACKEND_URL = 'https://gsquad-forever.onrender.com';

console.log('🧪 Testing Live Login Endpoint...\n');
console.log(`Backend: ${BACKEND_URL}\n`);

// Helper function to make HTTPS requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        let parsedData;
        try {
          parsedData = JSON.parse(data);
        } catch (e) {
          parsedData = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsedData,
          rawData: data,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// Test 1: Health check
async function testHealth() {
  console.log('📡 Test 1: Backend Health Check');
  try {
    const response = await makeRequest(`${BACKEND_URL}/api/health`);
    if (response.status === 200) {
      console.log('✅ Backend is running');
      console.log(`   Response: ${JSON.stringify(response.data)}\n`);
      return true;
    } else {
      console.log(`❌ Backend returned status ${response.status}\n`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Backend health check failed: ${error.message}\n`);
    return false;
  }
}

// Test 2: Login with correct credentials
async function testLogin() {
  console.log('🔐 Test 2: Login with Admin Credentials');
  console.log('   Email: admin@gsquadforever.com');
  console.log('   Password: admin123\n');
  
  try {
    const response = await makeRequest(`${BACKEND_URL}/api/admin/login`, {
      method: 'POST',
      body: {
        email: 'admin@gsquadforever.com',
        password: 'admin123',
      },
    });
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data, null, 2)}\n`);
    
    if (response.status === 200) {
      console.log('✅ Login successful!');
      if (response.data.token) {
        console.log('✅ Token received');
      }
      return true;
    } else if (response.status === 401) {
      console.log('❌ Login failed: Invalid credentials');
      console.log('   💡 This means:');
      console.log('      - Backend is working');
      console.log('      - Admin user might not exist or password is wrong');
      console.log('      - Check if migrations were run');
      return false;
    } else if (response.status === 500) {
      console.log('❌ Login failed: 500 Internal Server Error');
      console.log('   💡 This means:');
      console.log('      - Backend is running but something is wrong');
      console.log('      - Possible causes:');
      console.log('        1. JWT_SECRET not set in Render environment variables');
      console.log('        2. Database connection failed');
      console.log('        3. Database tables not created (migrations not run)');
      console.log('        4. Admin user doesn\'t exist');
      console.log('\n   🔍 Check Render logs for detailed error message');
      return false;
    } else {
      console.log(`⚠️  Unexpected status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Login test failed: ${error.message}\n`);
    return false;
  }
}

// Test 3: Login with wrong credentials (should return 401)
async function testWrongCredentials() {
  console.log('🔐 Test 3: Login with Wrong Credentials (should fail)');
  try {
    const response = await makeRequest(`${BACKEND_URL}/api/admin/login`, {
      method: 'POST',
      body: {
        email: 'wrong@email.com',
        password: 'wrongpassword',
      },
    });
    
    if (response.status === 401) {
      console.log('✅ Correctly rejected wrong credentials (401)\n');
      return true;
    } else if (response.status === 500) {
      console.log('❌ Still returning 500 even with wrong credentials');
      console.log('   This confirms a server-side issue, not authentication\n');
      return false;
    } else {
      console.log(`⚠️  Unexpected status: ${response.status}\n`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}\n`);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  const healthOk = await testHealth();
  
  if (!healthOk) {
    console.log('❌ Backend is not running. Cannot proceed with login tests.');
    return;
  }
  
  const loginOk = await testLogin();
  const wrongCredsOk = await testWrongCredentials();
  
  console.log('\n📊 Test Results Summary:');
  console.log('='.repeat(50));
  console.log(`Backend Health:     ${healthOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Login (correct):    ${loginOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Login (wrong):      ${wrongCredsOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log('='.repeat(50));
  
  if (loginOk) {
    console.log('\n🎉 Login is working! The 500 error should be fixed.');
  } else {
    console.log('\n⚠️  Login is still failing. Follow these steps:');
    console.log('\n🔧 Fix Steps:');
    console.log('1. Go to Render Dashboard → Your service → Environment');
    console.log('2. Verify JWT_SECRET is set (32+ characters)');
    console.log('3. Verify DATABASE_URL is correct');
    console.log('4. Check Logs tab for detailed error message');
    console.log('5. If logs say "Database tables not found":');
    console.log('   - Go to Supabase SQL Editor');
    console.log('   - Copy/paste contents of migrate.sql');
    console.log('   - Run the SQL script');
    console.log('6. Wait 2-3 minutes for Render to restart');
    console.log('7. Test again');
  }
}

runAllTests().catch(console.error);

