# 🔧 Fix "Tenant or user not found" Error (Neon)

## ❌ Error Message

```
error: Tenant or user not found
code: XX000
```

---

## ✅ What This Means

This error means:
1. **Migrations haven't been run** in Neon
2. **Database doesn't exist** or connection string is wrong
3. **Tables are missing** (admins, celebrations, wishes)

---

## 🔧 Solution: Run Migrations in Neon

### Step 1: Go to Neon SQL Editor
1. Visit: https://console.neon.tech
2. Click your project: **gsquad-forever**
3. Click **"SQL Editor"** (left sidebar)
4. Click **"New Query"**

### Step 2: Run Migration
1. Open `migrate.sql` from your project
2. **Copy entire contents**
3. **Paste** into Neon SQL Editor
4. Click **"Run"** (or press Ctrl+Enter)
5. Wait for success message: `✅ Database migration completed successfully!`

### Step 3: Verify Tables Created
Run this query in Neon SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see:
- `admins`
- `celebrations`
- `wishes`

---

## ✅ After Running Migrations

1. **Wait 10 seconds** for changes to propagate
2. **Try login again:**
   - Visit: https://gsquad-forever-client.vercel.app/admin/login
   - Email: `admin@gsquadforever.com`
   - Password: `admin123`
   - Should work! ✅

---

## 🆘 Still Not Working?

### Check Connection String
Make sure `DATABASE_URL` in Render matches your Neon connection string:
```
postgresql://neondb_owner:npg_Yc6FTR9GohbK@ep-still-moon-ah9r5hiz-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### Check Database Name
- Connection string should end with `/neondb` (or your database name)
- Make sure it matches the database in Neon dashboard

### Check Project Status
- Go to Neon Dashboard
- Make sure project is **Active** (not paused)

---

## 📋 Quick Checklist

- [ ] Opened Neon SQL Editor
- [ ] Copied `migrate.sql` contents
- [ ] Pasted and ran in Neon SQL Editor
- [ ] Saw success message
- [ ] Verified tables exist
- [ ] Tried login again

---

**This error will be fixed once migrations are run!** 🚀

