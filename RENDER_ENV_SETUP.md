# Render Environment Variables Setup - Your Values

## ⚠️ Important: Get Supabase Database Connection String First

You provided the Supabase project URL, but we need the **database connection string** for `DATABASE_URL`.

### How to Get It:

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Click on your project: `xojqojqeavgkabepehai`

2. **Get Connection String:**
   - Click **Settings** (gear icon) → **Database**
   - Scroll to **Connection string** section
   - Click on **"URI"** tab
   - You'll see something like:
     ```
     postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
     ```
   - **Replace `[YOUR-PASSWORD]`** with the database password you created when setting up the project
   - **Copy the full connection string**

3. **If you forgot your password:**
   - Go to Settings → Database → Reset database password
   - Create a new password (save it!)
   - Use the new connection string

---

## 📝 Environment Variables for Render

Once you have the Supabase connection string, use these values in Render:

### Variable 1: PORT
- **Key**: `PORT`
- **Value**: `10000`
- (Render uses port 10000, not 5000)

### Variable 2: NODE_ENV
- **Key**: `NODE_ENV`
- **Value**: `production`

### Variable 3: DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
- ⚠️ **Replace with your actual Supabase connection string from above!**

### Variable 4: JWT_SECRET
- **Key**: `JWT_SECRET`
- **Value**: Generate a new random 32+ character string
  - Go to: https://randomkeygen.com/
  - Copy a "CodeIgniter Encryption Keys" (any one)
  - Example: `aB3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW3xY5zA7bC9dE1fG3hI5jK7lM9nO1p`
- ⚠️ **Don't use the one from your local .env!** Generate a new one for production.

### Variable 5: CLOUDINARY_CLOUD_NAME
- **Key**: `CLOUDINARY_CLOUD_NAME`
- **Value**: `dlkkhayzn`

### Variable 6: CLOUDINARY_API_KEY
- **Key**: `CLOUDINARY_API_KEY`
- **Value**: `128736178937494`

### Variable 7: CLOUDINARY_API_SECRET
- **Key**: `CLOUDINARY_API_SECRET`
- **Value**: `YJHrfIhCYwhKmk7cI4B0Pj7zi9Q`

### Variable 8: DEFAULT_ADMIN_PASSWORD
- **Key**: `DEFAULT_ADMIN_PASSWORD`
- **Value**: `admin123`
- ⚠️ **Change this after first login for security!**

---

## 🎯 Quick Copy-Paste for Render

Once you have your Supabase DATABASE_URL, here's what to add in Render:

```
PORT=10000
NODE_ENV=production
DATABASE_URL=your_supabase_connection_string_here
JWT_SECRET=generate_new_random_32_char_string
CLOUDINARY_CLOUD_NAME=dlkkhayzn
CLOUDINARY_API_KEY=128736178937494
CLOUDINARY_API_SECRET=YJHrfIhCYwhKmk7cI4B0Pj7zi9Q
DEFAULT_ADMIN_PASSWORD=admin123
```

---

## 📸 Step-by-Step in Render UI

1. **In Render, scroll down** to "Environment Variables" section

2. **Click "Add Environment Variable"** button

3. **For each variable:**
   - Type the **Key** in the first field
   - Type the **Value** in the second field
   - Click "Add" or "Save"
   - Repeat for next variable

4. **Add all 8 variables** one by one

5. **Double-check:**
   - All 8 variables are listed
   - Values are correct (especially DATABASE_URL)
   - No typos

6. **Then click "Create Web Service"**

---

## 🔍 Finding Supabase Connection String (Visual Guide)

1. **Supabase Dashboard** → Your Project
2. **Left Sidebar** → Click **Settings** (⚙️ icon)
3. **Settings Menu** → Click **Database**
4. **Scroll down** to **"Connection string"** section
5. **Click "URI" tab** (not "Session mode" or "Transaction")
6. **You'll see:**
   ```
   postgresql://postgres.xojqojqeavgkabepehai:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
7. **Replace `[YOUR-PASSWORD]`** with your actual database password
8. **Copy the entire string** (this is your DATABASE_URL)

---

## ✅ Checklist Before Deploying

- [ ] Got Supabase DATABASE_URL (with password replaced)
- [ ] Generated new JWT_SECRET (from randomkeygen.com)
- [ ] Have all Cloudinary credentials ready
- [ ] Ready to add all 8 variables in Render

---

## 🚀 Next Steps

1. **Get Supabase DATABASE_URL** (follow steps above)
2. **Generate JWT_SECRET** (from randomkeygen.com)
3. **Go to Render** and add all 8 environment variables
4. **Click "Create Web Service"**
5. **Wait for deployment**

---

**Once you have the Supabase DATABASE_URL, you're ready to deploy!**









