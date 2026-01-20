# 🚨 QUICK FIX - Do This Now (10 Minutes)

## The Problem
- Frontend can't connect to backend (missing `VITE_API_URL`)
- Login returns 500 error (likely missing `JWT_SECRET` or database issue)

## ✅ Fix 1: Set Vercel Environment Variable (3 minutes)

1. Go to: https://vercel.com/dashboard
2. Click: `gsquad-forever-client`
3. **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://gsquad-forever.onrender.com/api`
   - **Environments:** ✅ Production ✅ Preview ✅ Development
6. Click **Save**
7. Go to **Deployments** tab
8. Click **...** on latest deployment → **Redeploy**
9. Wait 2-3 minutes

## ✅ Fix 2: Verify Render Environment Variables (3 minutes)

1. Go to: https://dashboard.render.com
2. Click: `gsquad-forever` (your backend)
3. **Environment** tab
4. **Verify these exist:**
   - `JWT_SECRET` (must be 32+ characters)
   - `DATABASE_URL` (your Supabase connection string)
   - `ALLOWED_ORIGINS` = `https://gsquad-forever-client.vercel.app`
5. If any are missing, add them
6. **Logs** tab → Check for errors
7. If you see "Database tables not found", run migrations (see below)

## ✅ Fix 3: Run Database Migrations (If Needed) (4 minutes)

**If login returns 500 and logs say "Database tables not found":**

### Option A: Via Supabase SQL Editor (Easiest)
1. Go to: https://supabase.com/dashboard
2. Your project → **SQL Editor**
3. Copy contents of `migrate.sql` file
4. Paste and run
5. Wait for success message

### Option B: Via Render Shell
1. Go to Render Dashboard → Your service
2. Click **Shell** tab
3. Run:
   ```bash
   cd server
   npm run migrate
   ```

## 🧪 Test After Fixes

1. **Wait 2-3 minutes** for deployments
2. Visit: https://gsquad-forever-client.vercel.app/admin/login
3. Open Browser Console (F12)
4. Try login: `admin@gsquadforever.com` / `admin123`
5. Check console for errors

## ✅ Expected Result

- ✅ No "Failed to fetch" errors
- ✅ No CORS errors
- ✅ Login works
- ✅ Redirects to admin dashboard

## 🆘 Still Not Working?

**Check Render Logs:**
1. Render Dashboard → Your service → Logs
2. Look for red errors
3. Common errors:
   - "JWT_SECRET is not set" → Add it in Environment
   - "Database tables not found" → Run migrations
   - "Connection refused" → Check DATABASE_URL

**Share the error message and I'll help fix it!**

