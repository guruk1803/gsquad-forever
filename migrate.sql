-- Gsquad Forever Database Migration
-- Run this in Supabase SQL Editor

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Celebrations table
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
);

-- Wishes table
CREATE TABLE IF NOT EXISTS wishes (
  id SERIAL PRIMARY KEY,
  celebration_id INTEGER REFERENCES celebrations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  amount DECIMAL(10, 2),
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_celebrations_slug ON celebrations(slug);
CREATE INDEX IF NOT EXISTS idx_wishes_celebration_id ON wishes(celebration_id);
CREATE INDEX IF NOT EXISTS idx_wishes_approved ON wishes(approved);

-- Create default admin (password: admin123)
-- This hash is for 'admin123' - generated with bcrypt
INSERT INTO admins (email, password_hash) 
VALUES (
  'admin@gsquadforever.com',
  '$2a$10$FgBedt/JedODo1G9ojD3r.GUoipiqDOpOe073rFSi3B9b47.jyvea'
)
ON CONFLICT (email) DO NOTHING;

-- Success message
SELECT '✅ Database migration completed successfully!' as status;










