# How to Run Database Migrations in Render

## 🎯 Quick Steps

### Step 1: Access Render Shell

1. **Go to Render Dashboard:**
   - Visit: https://dashboard.render.com
   - Sign in if needed

2. **Find Your Service:**
   - Click on your service: `gsquad-forever-backend`
   - (Or whatever you named it)

3. **Open Shell:**
   - Look for tabs at the top: "Overview", "Logs", **"Shell"**
   - Click on **"Shell"** tab
   - A terminal will open in your browser

### Step 2: Run Migrations

1. **In the Shell terminal, type:**
   ```bash
   npm run migrate
   ```

2. **Press Enter**

3. **Wait for completion:**
   - You'll see output like:
     ```
     ✅ Database tables created successfully
     ✅ Default admin created: admin@gsquadforever.com / admin123
     ```

4. **Done!** Your database is now set up.

---

## 🔍 What You'll See

### Success Output:
```
🔄 Testing database connection...
✅ Connected to PostgreSQL database
✅ Database connection successful

✅ Database tables created successfully
✅ Default admin created: admin@gsquadforever.com / admin123
```

### If You See Errors:

**"DATABASE_URL not set":**
- Go to Render → Your Service → Environment
- Make sure `DATABASE_URL` is set correctly

**"Connection refused":**
- Check your `DATABASE_URL` format
- Verify Supabase database is accessible
- Test connection in Supabase SQL Editor

**"Table already exists":**
- That's okay! Tables are already created
- You can skip this step

---

## ✅ Alternative: Use Supabase SQL Editor (Easier!)

If Render Shell doesn't work, use Supabase directly:

1. **Go to Supabase:**
   - Visit: https://supabase.com/dashboard/project/xojqojqeavgkabepehai
   - Click **SQL Editor** (left sidebar)

2. **Run This SQL:**

```sql
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
```

3. **Click "Run"** or press `Ctrl+Enter`

4. **Create Admin User:**
   - Run this in SQL Editor (password: admin123):

```sql
INSERT INTO admins (email, password_hash) 
VALUES (
  'admin@gsquadforever.com',
  '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq'
)
ON CONFLICT (email) DO NOTHING;
```

**✅ Done!** This is actually easier than using Render Shell!

---

## 🎯 Which Method to Use?

- **Supabase SQL Editor** = Easier, recommended ✅
- **Render Shell** = More technical, but works too

Both methods do the same thing - create your database tables!

---

**I recommend using Supabase SQL Editor - it's simpler and you can see the results immediately!**



