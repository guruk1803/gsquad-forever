import pool from './connection.js'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'

dotenv.config()

// Verify DATABASE_URL is set before proceeding
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set')
  console.error('\nPlease create a .env file in the server directory:')
  console.error('\nDATABASE_URL=postgresql://username:password@localhost:5432/database_name')
  console.error('\nExample for local PostgreSQL:')
  console.error('DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/gsquad_forever')
  console.error('\nExample for Supabase:')
  console.error('DATABASE_URL=postgresql://user:password@db.xxxxx.supabase.co:5432/postgres')
  process.exit(1)
}

const createTables = async () => {
  try {
    // Test connection first
    console.log('🔄 Testing database connection...')
    await pool.query('SELECT NOW()')
    console.log('✅ Database connection successful\n')
    // Admins table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Celebrations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS celebrations (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        slug VARCHAR(255) UNIQUE NOT NULL,
        event_type VARCHAR(50) DEFAULT 'wedding',
        event_date DATE,
        story TEXT,
        cover_image TEXT,
        images TEXT[],
        videos TEXT[],
        qr_image TEXT,
        money_collection_enabled BOOLEAN DEFAULT false,
        theme JSONB DEFAULT '{"primaryColor": "#9B7EDE", "secondaryColor": "#E8D5FF", "animationsEnabled": true}'::jsonb,
        sections JSONB DEFAULT '{"header": true, "story": true, "gallery": true, "wishes": true, "contribution": true}'::jsonb,
        quotes TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Wishes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wishes (
        id SERIAL PRIMARY KEY,
        celebration_id INTEGER REFERENCES celebrations(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        amount DECIMAL(10, 2),
        approved BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_celebrations_slug ON celebrations(slug)
    `)
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_wishes_celebration_id ON wishes(celebration_id)
    `)
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_wishes_approved ON wishes(approved)
    `)

    console.log('✅ Database tables created successfully')
    
    // Create default admin if not exists
    const adminCheck = await pool.query('SELECT * FROM admins WHERE email = $1', ['admin@gsquadforever.com'])
    if (adminCheck.rows.length === 0) {
      const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'
      const passwordHash = await bcrypt.hash(defaultPassword, 10)
      
      await pool.query(
        'INSERT INTO admins (email, password_hash) VALUES ($1, $2)',
        ['admin@gsquadforever.com', passwordHash]
      )
      console.log('✅ Default admin created: admin@gsquadforever.com / ' + defaultPassword)
    }
    
  } catch (error) {
    console.error('❌ Error creating tables:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

createTables()

