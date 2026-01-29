/**
 * Test Live Deployment Script
 * Run with: node test-live-deployment.js
 */

const https = require('https');

const BACKEND_URL = 'https://gsquad-forever.onrender.com';
const FRONTEND_URL = 'https://gsquad-forever-client.vercel.app';

console.log('🧪 Testing Live Deployment...\n');
console.log(`Backend: ${BACKEND_URL}`);
console.log(`Frontend: ${FRONTEND_URL}\n`);

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
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data,
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

// Test 1: Backend Health Check
async function testBackendHealth() {
  console.log('📡 Test 1: Backend Health Check');
  try {
    const response = await makeRequest(`${BACKEND_URL}/api/health`);
    if (response.status === 200) {
      console.log('✅ Backend is running');
      console.log(`   Response: ${response.data}\n`);
      return true;
    } else {
      console.log(`❌ Backend returned status ${response.status}`);
      console.log(`   Response: ${response.data}\n`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Backend health check failed: ${error.message}\n`);
    return false;
  }
}

// Test 2: CORS Preflight Check
async function testCORS() {
  console.log('🌐 Test 2: CORS Configuration');
  try {
    const response = await makeRequest(`${BACKEND_URL}/api/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': FRONTEND_URL,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type,Authorization',
      },
    });
    
    const corsHeaders = {
      'access-control-allow-origin': response.headers['access-control-allow-origin'],
      'access-control-allow-methods': response.headers['access-control-allow-methods'],
      'access-control-allow-headers': response.headers['access-control-allow-headers'],
      'access-control-allow-credentials': response.headers['access-control-allow-credentials'],
    };

    console.log('   CORS Headers:', JSON.stringify(corsHeaders, null, 2));
    
    if (corsHeaders['access-control-allow-origin']) {
      console.log('✅ CORS is configured');
      if (corsHeaders['access-control-allow-origin'] === FRONTEND_URL || 
          corsHeaders['access-control-allow-origin'] === '*') {
        console.log('✅ Frontend origin is allowed\n');
        return true;
      } else {
        console.log(`⚠️  Allowed origin: ${corsHeaders['access-control-allow-origin']}`);
        console.log(`   Expected: ${FRONTEND_URL}\n`);
        return false;
      }
    } else {
      console.log('❌ CORS headers not found\n');
      return false;
    }
  } catch (error) {
    console.log(`❌ CORS test failed: ${error.message}\n`);
    return false;
  }
}

// Test 3: Login Endpoint (without credentials - just check if it exists)
async function testLoginEndpoint() {
  console.log('🔐 Test 3: Login Endpoint');
  try {
    const response = await makeRequest(`${BACKEND_URL}/api/admin/login`, {
      method: 'POST',
      body: {
        email: 'test@test.com',
        password: 'wrong',
      },
    });
    
    // We expect 401 or 400, not 404
    if (response.status === 404) {
      console.log('❌ Login endpoint not found (404)');
      console.log(`   Response: ${response.data}\n`);
      return false;
    } else if (response.status === 401 || response.status === 400) {
      console.log(`✅ Login endpoint exists (returned ${response.status} as expected)`);
      console.log(`   Response: ${response.data}\n`);
      return true;
    } else {
      console.log(`⚠️  Login endpoint returned unexpected status: ${response.status}`);
      console.log(`   Response: ${response.data}\n`);
      return true; // Endpoint exists, just unexpected response
    }
  } catch (error) {
    console.log(`❌ Login endpoint test failed: ${error.message}\n`);
    return false;
  }
}

// Test 4: Check Frontend is accessible
async function testFrontend() {
  console.log('🌐 Test 4: Frontend Accessibility');
  try {
    const response = await makeRequest(`${FRONTEND_URL}`);
    if (response.status === 200) {
      console.log('✅ Frontend is accessible');
      console.log(`   Status: ${response.status}\n`);
      return true;
    } else {
      console.log(`⚠️  Frontend returned status ${response.status}\n`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Frontend test failed: ${error.message}\n`);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  const results = {
    backendHealth: await testBackendHealth(),
    cors: await testCORS(),
    loginEndpoint: await testLoginEndpoint(),
    frontend: await testFrontend(),
  };

  console.log('\n📊 Test Results Summary:');
  console.log('='.repeat(50));
  console.log(`Backend Health:     ${results.backendHealth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`CORS Configuration: ${results.cors ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Login Endpoint:    ${results.loginEndpoint ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Frontend Access:   ${results.frontend ? '✅ PASS' : '❌ FAIL'}`);
  console.log('='.repeat(50));

  const allPassed = Object.values(results).every(r => r);
  
  if (allPassed) {
    console.log('\n🎉 All tests passed!');
    console.log('\n💡 Next steps:');
    console.log('   1. Verify VITE_API_URL is set in Vercel');
    console.log('   2. Verify ALLOWED_ORIGINS is set in Render');
    console.log('   3. Try logging in at the frontend');
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above for details.');
    console.log('\n💡 Common fixes:');
    console.log('   1. Set ALLOWED_ORIGINS in Render: https://gsquad-forever-client.vercel.app');
    console.log('   2. Set VITE_API_URL in Vercel: https://gsquad-forever.onrender.com/api');
    console.log('   3. Wait for Render to redeploy after environment variable changes');
  }
}

runAllTests().catch(console.error);







