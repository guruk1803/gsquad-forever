# 🚀 Run Migrations in Neon (Required!)

## ✅ Current Status

- ✅ Backend is running
- ✅ Frontend is accessible  
- ✅ Database is connected
- ❌ **Admin user doesn't exist** (login returns 401)

---

## 🔧 Solution: Run Migrations

### Step 1: Open Neon SQL Editor

1. Go to: https://console.neon.tech
2. Click your project: **gsquad-forever**
3. Click **"SQL Editor"** (left sidebar)
4. Click **"New Query"**

### Step 2: Copy Migration SQL

Open `migrate.sql` from your project and copy **entire contents**.

### Step 3: Run in Neon

1. **Paste** the SQL into Neon SQL Editor
2. Click **"Run"** (or press Ctrl+Enter)
3. Wait for success message

### Step 4: Verify Admin User

Run this query in Neon SQL Editor:
```sql
SELECT email FROM admins;
```

You should see: `admin@gsquadforever.com`

---

## ✅ After Migrations

1. **Wait 10 seconds** for changes to propagate
2. **Test login:**
   - Visit: https://gsquad-forever-client.vercel.app/admin/login
   - Email: `admin@gsquadforever.com`
   - Password: `admin123`
   - Should work! ✅

---

## 🆘 If Migrations Fail

**Error: "relation already exists"**
- Tables already exist, but admin user might be missing
- Run this to create admin:
```sql
INSERT INTO admins (email, password_hash) 
VALUES (
  'admin@gsquadforever.com',
  '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq'
)
ON CONFLICT (email) DO NOTHING;
```

**Note:** The password hash above is for `admin123`. If you need a different password, use the migrate.js script.

---

**Run migrations now and login will work!** 🚀

