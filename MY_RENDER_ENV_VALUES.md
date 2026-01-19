# Your Render Environment Variables - Ready to Copy

## ⚠️ First: Get Supabase DATABASE_URL

1. Go to: https://supabase.com/dashboard/project/xojqojqeavgkabepehai
2. Click **Settings** (⚙️) → **Database**
3. Scroll to **"Connection string"**
4. Click **"URI"** tab
5. Copy the connection string
6. **Replace `[YOUR-PASSWORD]`** with your Supabase database password
7. It should look like:
   ```
   postgresql://postgres.xojqojqeavgkabepehai:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

---

## 📋 Copy These Values to Render

In Render, click "Add Environment Variable" for each:

### 1. PORT
```
Key: PORT
Value: 10000
```

### 2. NODE_ENV
```
Key: NODE_ENV
Value: production
```

### 3. DATABASE_URL
```
Key: DATABASE_URL
Value: [PASTE YOUR SUPABASE CONNECTION STRING HERE]
```
⚠️ Get this from Supabase Settings → Database → Connection string → URI

### 4. JWT_SECRET
```
Key: JWT_SECRET
Value: [GENERATE FROM https://randomkeygen.com/]
```
⚠️ Go to https://randomkeygen.com/ → Copy a "CodeIgniter Encryption Keys" (any 32+ char one)

### 5. CLOUDINARY_CLOUD_NAME
```
Key: CLOUDINARY_CLOUD_NAME
Value: dlkkhayzn
```

### 6. CLOUDINARY_API_KEY
```
Key: CLOUDINARY_API_KEY
Value: 128736178937494
```

### 7. CLOUDINARY_API_SECRET
```
Key: CLOUDINARY_API_SECRET
Value: YJHrfIhCYwhKmk7cI4B0Pj7zi9Q
```

### 8. DEFAULT_ADMIN_PASSWORD
```
Key: DEFAULT_ADMIN_PASSWORD
Value: admin123
```

---

## 🎯 Quick Steps in Render

1. **Scroll down** to "Environment Variables" section
2. **Click "Add Environment Variable"**
3. **Type Key** (e.g., `PORT`)
4. **Type Value** (e.g., `10000`)
5. **Click "Add"** or press Enter
6. **Repeat** for all 8 variables
7. **Verify** all 8 are listed
8. **Click "Create Web Service"**

---

## ✅ Checklist

Before clicking "Create Web Service":

- [ ] Got Supabase DATABASE_URL (with password)
- [ ] Generated JWT_SECRET (from randomkeygen.com)
- [ ] Added all 8 environment variables
- [ ] Root Directory is `server`
- [ ] Plan is set to "Free"
- [ ] Start Command is `npm start`

---

**That's it! Once you add these 8 variables, you're ready to deploy!**


