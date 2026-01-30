# Test Database Connection - Troubleshooting Guide

## 🔍 Quick Test

### Test 1: Check if Server Can Connect

1. **Check Render Logs:**
   - Go to Render Dashboard → Your Service → Logs
   - Look for: `✅ Database connection successful`
   - If you see errors, note them down

### Test 2: Test via API Health Endpoint

Visit: `https://your-render-url.onrender.com/api/health`

Should see: `{"status":"ok","message":"Gsquad Forever API is running"}`

### Test 3: Test Database Connection Directly

**In Supabase SQL Editor:**

```sql
-- Test 1: Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Should see: admins, celebrations, wishes
```

```sql
-- Test 2: Check if admin exists
SELECT email FROM admins WHERE email = 'admin@gsquadforever.com';

-- Should return 1 row
```

```sql
-- Test 3: Test connection
SELECT NOW(), version();
```

---

## 🐛 Common Issues & Fixes

### Issue 1: "relation admins does not exist"

**Fix:** Run database migrations

**Option A: Supabase SQL Editor (Easiest)**
1. Go to Supabase → SQL Editor
2. Copy SQL from `migrate.sql`
3. Run it

**Option B: Render Shell**
1. Render Dashboard → Your Service → Shell
2. Run: `npm run migrate`

---

### Issue 2: "Connection refused" or "Connection timeout"

**Possible Causes:**
1. **Wrong DATABASE_URL**
   - Check in Render → Environment Variables
   - Should be: `postgresql://postgres.xxxxx:password@aws-0-REGION.pooler.supabase.com:6543/postgres`
   - Make sure password is correct

2. **Password has special characters**
   - URL-encode special characters:
     - `@` → `%40`
     - `#` → `%23`
     - `/` → `%2F`
     - `:` → `%3A`

3. **Supabase project paused**
   - Check Supabase dashboard
   - Make sure project is active

**Fix:**
- Verify DATABASE_URL in Render
- Test connection in Supabase SQL Editor
- If password has special chars, URL-encode them

---

### Issue 3: "SSL connection required"

**Fix:** Already handled in code! SSL is automatically enabled for Supabase.

If you still see this:
- Check DATABASE_URL uses port `6543` (pooler) or `5432` (direct)
- Both should work with SSL enabled

---

### Issue 4: "JWT_SECRET is not defined"

**Fix:**
1. Go to Render → Environment Variables
2. Add: `JWT_SECRET` = (generate from https://randomkeygen.com/)
3. Redeploy service

---

### Issue 5: "Invalid credentials" (401, not 500)

**This is normal if:**
- Password is wrong
- Admin doesn't exist

**Fix:**
- Use: `admin@gsquadforever.com` / `admin123`
- Or create admin via migrations

---

## ✅ Verification Checklist

After fixing issues, verify:

- [ ] Render logs show: `✅ Database connection successful`
- [ ] `/api/health` endpoint works
- [ ] Tables exist in Supabase (admins, celebrations, wishes)
- [ ] Admin user exists: `SELECT * FROM admins;`
- [ ] Login works: `admin@gsquadforever.com` / `admin123`

---

## 🔧 Quick Fixes

### If tables don't exist:
```sql
-- Run in Supabase SQL Editor
-- (Copy from migrate.sql)
```

### If admin doesn't exist:
```sql
-- Run in Supabase SQL Editor
INSERT INTO admins (email, password_hash) 
VALUES (
  'admin@gsquadforever.com',
  '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq'
)
ON CONFLICT (email) DO NOTHING;
```

### If DATABASE_URL is wrong:
1. Go to Supabase → Settings → Database
2. Copy connection string (URI format)
3. Replace `[YOUR-PASSWORD]` with actual password
4. Update in Render → Environment Variables
5. Redeploy

---

**Most common issue: Migrations not run!** Check Step 1 first! ✅










