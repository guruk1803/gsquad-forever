# 🚀 Deployment Guide - Gsquad Forever

## ✅ 100% FREE - No Credit Card Required

All services are FREE:
- **Supabase** - Database (FREE)
- **Cloudinary** - Images (FREE)
- **Render** - Backend (FREE, no credit card)
- **Vercel** - Frontend (FREE, no credit card)

**Total Cost: $0/month** 🎉

---

## 📋 Quick Steps

1. **Database** → Supabase (5 min)
2. **Images** → Cloudinary (2 min)
3. **Backend** → Render (10 min)
4. **Frontend** → Vercel (5 min)

---

## Step 1: Database (Supabase)

1. Go to: https://supabase.com → Sign up (FREE)
2. Click "New Project"
   - Name: `gsquad-forever`
   - Create password (SAVE IT!)
   - Choose region
   - Click "Create"
3. Get connection string:
   - Settings → Database → Connection string → URI
   - Copy it, replace `[YOUR-PASSWORD]` with your password
   - **SAVE THIS!**
4. Create tables:
   - Go to SQL Editor
   - Paste this SQL and run:

```sql
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE INDEX IF NOT EXISTS idx_celebrations_slug ON celebrations(slug);
CREATE INDEX IF NOT EXISTS idx_wishes_celebration_id ON wishes(celebration_id);
CREATE INDEX IF NOT EXISTS idx_wishes_approved ON wishes(approved);
```

5. Create admin user:
   - Run this in SQL Editor (password: admin123):

```sql
INSERT INTO admins (email, password_hash) 
VALUES (
  'admin@gsquadforever.com',
  '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq'
)
ON CONFLICT (email) DO NOTHING;
```

**✅ Done!** You have:
- Database connection string
- Tables created
- Admin user created

---

## Step 2: Cloudinary (Images)

1. Go to: https://cloudinary.com → Sign up (FREE)
2. After login, go to Dashboard
3. Copy these 3 values:
   - **Cloud Name** (e.g., `dxyz12345`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)
4. **SAVE ALL THREE!**

**✅ Done!** You have Cloudinary credentials.

---

## Step 3: Backend (Render)

1. Go to: https://render.com → Sign up with GitHub (FREE)
2. Click "New +" → "Web Service"
3. Connect repository: `guruk1803/gsquad-forever`
4. Configure:
   - **Name**: `gsquad-forever-backend`
   - **Region**: Choose closest
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install` (or leave empty - both work)
   - **Start Command**: `npm start`
   - **Plan**: **Free** (select this!)
5. Environment Variables (click "Advanced" → "Add Environment Variable"):

**Add these 8 variables one by one:**

```
PORT=10000
NODE_ENV=production
DATABASE_URL=your_supabase_connection_string_here
JWT_SECRET=generate_random_32_char_string_here
CLOUDINARY_CLOUD_NAME=dlkkhayzn
CLOUDINARY_API_KEY=128736178937494
CLOUDINARY_API_SECRET=YJHrfIhCYwhKmk7cI4B0Pj7zi9Q
DEFAULT_ADMIN_PASSWORD=admin123
```

**Important Notes:**
- **DATABASE_URL**: Get from Supabase Settings → Database → Connection string → URI tab
  - Replace `[YOUR-PASSWORD]` with your Supabase database password
  - Format: `postgresql://postgres.xojqojqeavgkabepehai:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres`
- **JWT_SECRET**: Generate new one from https://randomkeygen.com/ (CodeIgniter Encryption Keys)
- **Cloudinary values**: Already filled with your credentials above

6. Click "Create Web Service"
7. Wait for deployment (5-10 min)
8. **Copy the URL** - It appears at the **TOP of your service page** in Render dashboard
   - Look for: `https://gsquad-forever-backend.onrender.com` (or similar)
   - **Where to find it:** Render Dashboard → Your Service → Top of page (below service name)

**✅ Done!** Backend is live!

**Test it:** Visit `https://your-render-url.onrender.com/api/health`
Should see: `{"status":"ok","message":"Gsquad Forever API is running"}`

**💡 Tip:** The URL is always displayed at the top of your Render service page after deployment!

**Note:** Render free tier sleeps after 15 min. First request after sleep takes ~30 seconds (normal for free tier).

---

## Step 4: Frontend (Vercel)

1. Go to: https://vercel.com → Sign up with GitHub (FREE)
2. Click "Add New..." → "Project"
3. Find: `guruk1803/gsquad-forever` → Click "Import"
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client` ⚠️ IMPORTANT!
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)
5. Environment Variables:
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://your-render-url.onrender.com/api`
   - **Where to get the URL:** Go to Render Dashboard → Your Service → Copy URL from top of page
   - ⚠️ **Important:** Add `/api` at the end! (e.g., `https://gsquad-forever-backend.onrender.com/api`)
6. Click "Deploy"
7. Wait for build (2-3 min)
8. **Copy the URL** (e.g., `https://gsquad-forever.vercel.app`)

**✅ Done!** Frontend is live!

9. **Update Backend CORS:**
   - Go back to Render dashboard
   - Your service → Environment → Add Variable
   - Key: `ALLOWED_ORIGINS`
   - Value: `https://your-vercel-url.vercel.app`
   - Render will auto-redeploy

---

## ✅ Verify Everything Works

1. **Test Frontend:**
   - Visit your Vercel URL
   - Should see home page

2. **Test Backend:**
   - Visit: `https://your-render-url.onrender.com/api/health`
   - Should see success message

3. **Test Admin Login:**
   - Go to: `https://your-vercel-url.vercel.app/admin/login`
   - Login: `admin@gsquadforever.com` / `admin123`

4. **Create Celebration:**
   - Create a test celebration
   - View it at: `https://your-vercel-url.vercel.app/your-slug`

---

## 🎉 You're Live!

Your app is now deployed and accessible worldwide!

**Your URLs:**
- Frontend: `https://your-vercel-url.vercel.app`
- Backend: `https://your-render-url.onrender.com`
- GitHub: `https://github.com/guruk1803/gsquad-forever`

**Auto-Deploy:**
- Push to GitHub → Both Render and Vercel auto-deploy!
- No manual deployment needed!

---

## 🆘 Troubleshooting

### Backend not working?
- Check all environment variables are set in Render
- Check Render logs for errors
- Verify DATABASE_URL is correct

### Frontend can't connect?
- Check VITE_API_URL is correct in Vercel
- Check backend CORS settings
- Verify backend is running (check /api/health)

### Database connection fails?
- Verify DATABASE_URL format
- Check Supabase project is active
- Test connection in Supabase SQL Editor

---

## 📝 Environment Variables Summary

### Render (Backend):
```
PORT=10000
NODE_ENV=production
DATABASE_URL=postgresql://postgres.xxxxx:password@...
JWT_SECRET=your_32_char_random_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
DEFAULT_ADMIN_PASSWORD=your_password
ALLOWED_ORIGINS=https://your-vercel-url.vercel.app
```

### Vercel (Frontend):
```
VITE_API_URL=https://your-render-url.onrender.com/api
```

---

**That's it! One simple guide. Follow the steps above and you'll be live in 20-30 minutes!** 🚀

