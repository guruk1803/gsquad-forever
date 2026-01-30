# Database Migration Guide

## Quick Migration

### Option 1: Using Migration Script (Recommended)

```bash
cd server
npm run migrate
```

This will:
- Create all tables
- Create indexes
- Create default admin user

### Option 2: Manual SQL

1. Open your database SQL editor (Neon/Supabase dashboard)
2. Copy contents of `migrate.sql`
3. Paste and run

## Schema Overview

### Admins Table
```sql
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Celebrations Table
```sql
CREATE TABLE celebrations (
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
  spotify_code TEXT,
  money_collection_enabled BOOLEAN DEFAULT false,
  theme JSONB,
  sections JSONB,
  quotes TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Wishes Table
```sql
CREATE TABLE wishes (
  id SERIAL PRIMARY KEY,
  celebration_id INTEGER REFERENCES celebrations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  amount DECIMAL(10, 2),
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Adding Spotify Code Column

If you have an existing database without `spotify_code`:

```sql
ALTER TABLE celebrations 
ADD COLUMN IF NOT EXISTS spotify_code TEXT;
```

## Default Admin User

After migration, default admin credentials:
- **Email**: `admin@gsquadforever.com`
- **Password**: `admin123`

**Important**: Change password after first login!

