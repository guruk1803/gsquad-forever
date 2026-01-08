import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envPath = path.join(__dirname, '.env')
const templatePath = path.join(__dirname, '.env.example')

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists')
  process.exit(0)
}

// Check if .env.example exists
if (fs.existsSync(templatePath)) {
  fs.copyFileSync(templatePath, envPath)
  console.log('✅ Created .env file from .env.example')
  console.log('⚠️  Please edit .env and add your DATABASE_URL and other configuration')
} else {
  // Create a basic .env file
  const envContent = `# Database Configuration
# Format: postgresql://username:password@host:port/database_name
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/gsquad_forever

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Default Admin Password (change after first login)
DEFAULT_ADMIN_PASSWORD=admin123
`
  fs.writeFileSync(envPath, envContent)
  console.log('✅ Created .env file with default values')
  console.log('⚠️  Please edit .env and update DATABASE_URL with your actual database connection string')
}

console.log('\n📝 Next steps:')
console.log('1. Edit server/.env file')
console.log('2. Update DATABASE_URL with your PostgreSQL connection string')
console.log('3. Run: npm run migrate')


