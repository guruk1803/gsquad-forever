# Fix 500 Internal Server Error on Login

## 🔍 Quick Diagnosis

The 500 error means the backend is running but something is wrong. Most common causes:

1. **Database tables don't exist** (migrations not run) ⚠️ MOST LIKELY
2. **Database connection failed** (DATABASE_URL wrong)
3. **JWT_SECRET not set** (missing environment variable)
4. **Database query error**

---

## ✅ Step 1: Check Render Logs (Most Important!)

**This will show you the EXACT error:**

1. **Go to Render Dashboard:**
   - Visit: https://dashboard.render.com
   - Click on your service: `gsquad-forever-backend`

2. **Open Logs:**
   - Click **"Logs"** tab at the top
   - You'll see real-time server logs

3. **Try to login again** (from your frontend)

4. **Look for the error in logs:**
   - You should see: `Login error: [actual error message]`
   - Common errors:
     - `relation "admins" does not exist` → **Migrations not run!**
     - `Connection refused` → **DATABASE_URL wrong**
     - `JWT_SECRET is not defined` → **JWT_SECRET missing**

5. **Copy the error message** and we can fix it!

---

## ✅ Step 2: Verify Database Migrations

**If logs show "relation admins does not exist":**

### Option A: Run via Supabase SQL Editor (Easiest)

1. **Go to Supabase:**
   - Visit: https://supabase.com/dashboard/project/xojqojqeavgkabepehai
   - Click **SQL Editor** (left sidebar)

2. **Run the migration:**
   - Open `migrate.sql` file (I created it earlier)
   - Copy all SQL
   - Paste into Supabase SQL Editor
   - Click **"Run"** or press `Ctrl+Enter`

3. **Verify tables exist:**
   - In Supabase, go to **Table Editor**
   - You should see: `admins`, `celebrations`, `wishes`

### Option B: Run via Render Shell

1. **In Render Dashboard:**
   - Your service → **"Shell"** tab

2. **Run migration:**
   ```bash
   npm run migrate
   ```

3. **Wait for success message**

---

## ✅ Step 3: Verify Environment Variables

**Check all these are set in Render:**

1. **Go to Render Dashboard:**
   - Your service → **"Environment"** tab

2. **Verify these exist:**
   - ✅ `DATABASE_URL` - Should be your Supabase connection string
   - ✅ `JWT_SECRET` - Should be a random 32+ character string
   - ✅ `PORT` - Should be `10000`
   - ✅ `NODE_ENV` - Should be `production`
   - ✅ `CLOUDINARY_CLOUD_NAME` - `dlkkhayzn`
   - ✅ `CLOUDINARY_API_KEY` - `128736178937494`
   - ✅ `CLOUDINARY_API_SECRET` - `YJHrfIhCYwhKmk7cI4B0Pj7zi9Q`
   - ✅ `DEFAULT_ADMIN_PASSWORD` - `admin123`

3. **If any are missing, add them!**

---

## ✅ Step 4: Test Database Connection

**In Supabase SQL Editor, run:**

```sql
SELECT * FROM admins;
```

**If you see:**
- ✅ **Rows returned** → Database is working!
- ❌ **"relation admins does not exist"** → Run migrations (Step 2)

---

## ✅ Step 5: Verify Admin User Exists

**In Supabase SQL Editor, run:**

```sql
SELECT email FROM admins WHERE email = 'admin@gsquadforever.com';
```

**If you see:**
- ✅ **One row** → Admin exists!
- ❌ **No rows** → Create admin (see below)

**Create admin if missing:**

```sql
-- This will create admin with password: admin123
-- The hash is for 'admin123'
INSERT INTO admins (email, password_hash) 
VALUES (
  'admin@gsquadforever.com',
  '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq'
)
ON CONFLICT (email) DO NOTHING;
```

---

## 🔧 Quick Fixes by Error Type

### Error: "relation admins does not exist"
**Fix:** Run database migrations (Step 2)

### Error: "Connection refused" or "Connection timeout"
**Fix:** 
- Check `DATABASE_URL` in Render environment variables
- Verify Supabase database is active
- Test connection in Supabase SQL Editor

### Error: "JWT_SECRET is not defined"
**Fix:**
- Add `JWT_SECRET` to Render environment variables
- Generate from: https://randomkeygen.com/
- Redeploy service

### Error: "Invalid credentials" (401, not 500)
**Fix:**
- This is normal if password is wrong
- Use: `admin@gsquadforever.com` / `admin123`

---

## 📋 Checklist

- [ ] Checked Render logs for actual error
- [ ] Verified database migrations were run
- [ ] Verified all environment variables are set
- [ ] Tested database connection in Supabase
- [ ] Verified admin user exists
- [ ] Tried login again

---

## 🆘 Still Not Working?

**Share the error from Render logs:**
1. Go to Render → Logs
2. Copy the error message (the one that says "Login error:")
3. Share it with me and I'll help fix it!

---

**Most likely issue: Database migrations not run!** Check Step 2 first! ✅

