import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Check if .env exists
const envPath = join(__dirname, '.env')
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!')
  console.error('   Run: npm run setup-env')
  process.exit(1)
}

// Check if DATABASE_URL is set
import dotenv from 'dotenv'
dotenv.config()

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('yourpassword')) {
  console.error('❌ DATABASE_URL not configured!')
  console.error('   Please edit server/.env and set your DATABASE_URL')
  process.exit(1)
}

console.log('✅ Environment configured')
console.log('🚀 Starting server...\n')

// Start the server
const server = spawn('node', ['--watch', 'src/server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true,
})

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error.message)
  process.exit(1)
})

server.on('exit', (code) => {
  if (code !== 0) {
    console.error(`\n❌ Server exited with code ${code}`)
  }
})

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n🛑 Stopping server...')
  server.kill()
  process.exit(0)
})

process.on('SIGTERM', () => {
  server.kill()
  process.exit(0)
})



