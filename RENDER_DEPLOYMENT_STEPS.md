# Step 3: Deploy Backend to Render - Detailed Guide

## 🎯 What We're Doing
Deploying your Node.js backend to Render so it's accessible on the internet.

---

## Step 3.1: Sign Up for Render

1. **Go to Render:**
   - Open: https://render.com
   - Click "Get Started for Free" or "Sign Up"

2. **Sign Up Options:**
   - Click "Sign up with GitHub" (recommended - easiest!)
   - Authorize Render to access your GitHub account
   - Render will automatically see your repositories

3. **Complete Setup:**
   - Fill in any additional info if asked
   - You're now in the Render dashboard

---

## Step 3.2: Create Web Service

1. **In Render Dashboard:**
   - Look for a big button: **"New +"** (usually top right or center)
   - Click it
   - Select **"Web Service"** from the dropdown

2. **Connect Repository:**
   - You'll see "Connect a repository"
   - If you signed up with GitHub, you'll see your repos listed
   - Find and click: **`guruk1803/gsquad-forever`**
   - Click "Connect"

---

## Step 3.3: Configure the Service

After connecting, you'll see a form. Fill it like this:

### Basic Settings:

- **Name**: 
  ```
  gsquad-forever-backend
  ```
  (This is just a label for your service)

- **Region**: 
  - Choose the closest to you (e.g., "Singapore" if you're in Asia)
  - This affects speed slightly

- **Branch**: 
  ```
  main
  ```
  (Should auto-detect)

- **Root Directory**: 
  ```
  server
  ```
  ⚠️ **IMPORTANT!** This tells Render where your backend code is

- **Runtime**: 
  - Should auto-detect as "Node"
  - If not, select "Node"

- **Build Command**: 
  ```
  npm install
  ```
  (Installs dependencies)

- **Start Command**: 
  ```
  npm start
  ```
  (Starts your server)

- **Plan**: 
  - Select **"Free"** 
  - ⚠️ Make sure you select FREE, not Starter or Pro!

---

## Step 3.4: Set Environment Variables

**Before clicking "Create Web Service":**

1. **Scroll down** to find "Environment Variables" section
2. **Click "Add Environment Variable"** for each one below
3. Add these **one by one**:

### Variable 1: PORT
- **Key**: `PORT`
- **Value**: `10000`
- Click "Add"

### Variable 2: NODE_ENV
- **Key**: `NODE_ENV`
- **Value**: `production`
- Click "Add"

### Variable 3: DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: Your Supabase connection string
  - Go to: https://supabase.com/dashboard/project/xojqojqeavgkabepehai
  - Settings → Database → Connection string → URI tab
  - Copy the connection string
  - Replace `[YOUR-PASSWORD]` with your Supabase database password
  - Should look like: `postgresql://postgres.xojqojqeavgkabepehai:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres`
- Click "Add"

### Variable 4: JWT_SECRET
- **Key**: `JWT_SECRET`
- **Value**: Generate a random 32+ character string
  - Go to: https://randomkeygen.com/
  - Copy a "CodeIgniter Encryption Keys" (any one, 32+ chars)
  - Example: `aB3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW3xY5zA7bC9dE1fG3hI5jK7lM9nO1p`
- Click "Add"

### Variable 5: CLOUDINARY_CLOUD_NAME
- **Key**: `CLOUDINARY_CLOUD_NAME`
- **Value**: `dlkkhayzn`
- Click "Add"

### Variable 6: CLOUDINARY_API_KEY
- **Key**: `CLOUDINARY_API_KEY`
- **Value**: `128736178937494`
- Click "Add"

### Variable 7: CLOUDINARY_API_SECRET
- **Key**: `CLOUDINARY_API_SECRET`
- **Value**: `YJHrfIhCYwhKmk7cI4B0Pj7zi9Q`
- Click "Add"

### Variable 8: DEFAULT_ADMIN_PASSWORD
- **Key**: `DEFAULT_ADMIN_PASSWORD`
- **Value**: `admin123`
- Click "Add"

---

## Step 3.5: Create and Deploy

1. **Review everything:**
   - Make sure "Plan" is set to "Free"
   - Make sure "Root Directory" is `server`
   - Make sure all 8 environment variables are added

2. **Click "Create Web Service"**
   - Render will start building your app
   - You'll see a build log

3. **Wait for Deployment:**
   - First deployment takes 5-10 minutes
   - You'll see progress in the logs
   - Watch for "Build successful" or "Deployed"

---

## Step 3.6: Get Your Backend URL

1. **After deployment completes:**
   - Look at the top of the page
   - You'll see a URL like: `https://gsquad-forever-backend.onrender.com`
   - **Copy this URL!** You'll need it for Step 4

2. **Test Your Backend:**
   - Open the URL in a new tab
   - Add `/api/health` at the end:
     ```
     https://your-backend-url.onrender.com/api/health
     ```
   - Should see: `{"status":"ok","message":"Gsquad Forever API is running"}`

---

## Step 3.7: Run Database Migrations

You have two options:

### Option A: Via Supabase SQL Editor (Easier)
1. Go back to Supabase
2. SQL Editor → New Query
3. Paste the SQL from Step 1
4. Run it

### Option B: Via Render Shell
1. In Render dashboard → Your service
2. Click "Shell" tab
3. Run: `npm run migrate`
4. Wait for completion

---

## ✅ Step 3 Complete Checklist

- [ ] Render account created
- [ ] Web service created
- [ ] Root directory set to `server`
- [ ] Plan set to "Free"
- [ ] All 8 environment variables added
- [ ] Service deployed successfully
- [ ] Backend URL copied
- [ ] Health check works (`/api/health`)
- [ ] Database migrations run

---

## 🆘 Troubleshooting

### Build Fails
- Check logs in Render dashboard
- Verify Root Directory is `server` (not `client`)
- Check all environment variables are set

### Service Won't Start
- Check PORT is set to `10000`
- Verify DATABASE_URL is correct
- Check logs for specific errors

### Can't Access Backend
- Wait a few minutes (first deployment takes time)
- Check service status in Render dashboard
- Verify the URL is correct

### Database Connection Error
- Double-check DATABASE_URL format
- Make sure password in URL is correct
- Test connection in Supabase

---

## 📝 What You Should Have Now

After completing Step 3, you should have:

1. ✅ Backend URL: `https://your-backend.onrender.com`
2. ✅ Backend is running and accessible
3. ✅ Health check endpoint working
4. ✅ Database connected
5. ✅ All environment variables set

**Save your backend URL!** You'll need it for Step 4 (Frontend).

---

**Ready to continue?** Once Step 3 is complete, move to Step 4: Deploy Frontend to Vercel!

