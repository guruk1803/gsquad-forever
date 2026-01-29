# 🚨 Fix Database Connection Error - URGENT

## ❌ The Error

From Render logs:
```
❌ Database connection test failed: getaddrinfo ENOTFOUND db.xojqojqeavgkabepehai.supabase.co
Login error: Error: getaddrinfo ENOTFOUND db.xojqojqeavgkabepehai.supabase.co
```

**What this means:** The `DATABASE_URL` in Render is pointing to a hostname that doesn't exist. The Supabase database hostname is incorrect or the project was deleted/paused.

---

## ✅ Fix Steps (Do This Now - 5 Minutes)

### Step 1: Get Correct DATABASE_URL from Supabase

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Select your project (or create a new one if needed)

2. **Get Connection String:**
   - Click **"Settings"** (gear icon) in left sidebar
   - Click **"Database"** in settings menu
   - Scroll down to **"Connection string"** section
   - Select **"URI"** tab
   - **Copy the connection string**
   - It should look like:
     ```
     postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
     ```
   - **OR** if using direct connection:
     ```
     postgresql://postgres.[PROJECT_REF]:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
     ```

3. **Important:** Make sure to:
   - Replace `[PASSWORD]` with your actual database password
   - If password has special characters, URL-encode them:
     - `@` becomes `%40`
     - `#` becomes `%23`
     - `%` becomes `%25`
     - etc.

### Step 2: Update DATABASE_URL in Render

1. **Go to Render Dashboard:**
   - https://dashboard.render.com
   - Click your service: `gsquad-forever`

2. **Update Environment Variable:**
   - Click **"Environment"** tab
   - Find `DATABASE_URL` in the list
   - Click **"Edit"** (or delete and add new)
   - **Paste the correct connection string** from Step 1
   - Click **"Save Changes"**
   - Render will auto-redeploy (wait 2-3 minutes)

### Step 3: Verify Database is Active

**If you see "project not found" or "paused" in Supabase:**

1. **Check Supabase Project Status:**
   - Go to Supabase Dashboard
   - Check if project shows as "Active" or "Paused"
   - If paused, you may need to:
     - Upgrade plan (if on free tier and paused)
     - Or create a new project

2. **If Creating New Project:**
   - Create new Supabase project
   - Get new connection string
   - Update `DATABASE_URL` in Render
   - **Run migrations** (see Step 4)

### Step 4: Run Database Migrations

**After fixing DATABASE_URL, you MUST run migrations:**

**Option A: Via Supabase SQL Editor (Easiest)**

1. Go to Supabase Dashboard → Your project
2. Click **"SQL Editor"** in left sidebar
3. Click **"New query"**
4. Open `migrate.sql` file from your project
5. **Copy entire contents**
6. **Paste into Supabase SQL Editor**
7. Click **"Run"** (or Ctrl+Enter)
8. Wait for success: `Success. No rows returned`

**Option B: Via Render Shell**

1. Render Dashboard → Your service → **Shell** tab
2. Run:
   ```bash
   cd server
   npm run migrate
   ```

---

## 🔍 Verify DATABASE_URL Format

**Correct format examples:**

✅ **Pooler connection (recommended):**
```
postgresql://postgres.xxxxx:password@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

✅ **Direct connection:**
```
postgresql://postgres.xxxxx:password@db.xxxxx.supabase.co:5432/postgres
```

❌ **Wrong format (what you have now):**
```
postgresql://postgres.xxxxx:password@db.xojqojqeavgkabepehai.supabase.co:5432/postgres
```
(This hostname doesn't exist)

---

## 🧪 Test After Fix

1. **Wait 2-3 minutes** for Render to redeploy
2. **Check Render Logs:**
   - Should see: `✅ Database connection successful`
   - Should NOT see: `ENOTFOUND` errors
3. **Test Login:**
   - Visit: https://gsquad-forever-client.vercel.app/admin/login
   - Try login: `admin@gsquadforever.com` / `admin123`
   - Should work now! ✅

---

## 🆘 Common Issues

### Issue: "Password contains special characters"

**Fix:** URL-encode special characters in password:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`

**Example:**
- Password: `my@pass#123`
- Encoded: `my%40pass%23123`
- Full URL: `postgresql://postgres.xxxxx:my%40pass%23123@...`

### Issue: "Project not found" or "Paused"

**Fix:**
1. Check Supabase project status
2. If paused, reactivate or create new project
3. Get new connection string
4. Update in Render

### Issue: "Connection timeout"

**Fix:**
1. Make sure you're using the **pooler connection** (port 6543)
2. Not the direct connection (port 5432)
3. Pooler is more reliable for serverless/hosting platforms

---

## 📋 Checklist

Before testing, verify:

- [ ] Got correct `DATABASE_URL` from Supabase Dashboard
- [ ] Updated `DATABASE_URL` in Render environment variables
- [ ] Password is URL-encoded if it has special characters
- [ ] Supabase project is active (not paused)
- [ ] Ran database migrations (created tables)
- [ ] Waited 2-3 minutes for Render to restart
- [ ] Checked Render logs - no more `ENOTFOUND` errors

---

## ✅ Expected Result

After fixes:
- ✅ Render logs show: `✅ Database connection successful`
- ✅ No more `ENOTFOUND` errors
- ✅ Login works
- ✅ All API endpoints work

**You're done!** 🎉

---

## 💡 Quick Reference

**Where to get DATABASE_URL:**
1. Supabase Dashboard → Settings → Database → Connection string → URI tab

**Where to update it:**
1. Render Dashboard → Your service → Environment → DATABASE_URL

**Format:**
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**After updating:**
1. Wait 2-3 minutes for auto-redeploy
2. Run migrations
3. Test login

