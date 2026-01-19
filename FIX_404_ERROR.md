# 🔍 Fix 404 Error - Debugging Guide

## 🎯 Quick Steps to Identify the Issue

### Step 1: Check Browser Console

Open your browser's Developer Tools (F12) and check:

1. **Console Tab** - Look for the exact URL that's failing
2. **Network Tab** - See which request returns 404
3. **Check the failed request:**
   - What's the URL?
   - What's the method (GET, POST, etc.)?
   - What's the status code?

---

## 🔍 Common 404 Causes

### 1. **Static Assets (Images, Icons, Fonts)**

**Symptom:** 404 for files like `/vite.svg`, `/favicon.ico`, etc.

**Fix:** These are usually harmless. You can:
- Ignore them (they don't affect functionality)
- Add the missing files to `client/public/` folder

---

### 2. **API Endpoint Not Found**

**Symptom:** 404 for `/api/...` endpoints

**Check:**
- Is backend server running? (`cd server && npm run dev`)
- Is the API URL correct in frontend?
- Check `client/.env` has: `VITE_API_URL=http://localhost:5000/api`

**Common Issues:**
- Backend not running
- Wrong API URL
- Route path mismatch

---

### 3. **Frontend Route Not Found**

**Symptom:** 404 for page routes like `/admin/...` or `/celebration/...`

**Check:**
- Are you accessing the correct URL?
- Is React Router configured correctly?

---

## 🛠️ How to Debug

### Method 1: Check Browser Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Refresh the page
4. Look for requests with **Status: 404**
5. Click on the failed request
6. Check:
   - **Request URL** - What's the full URL?
   - **Request Method** - GET, POST, etc.?
   - **Response** - What error message?

### Method 2: Check Backend Logs

If it's an API endpoint:

1. Check your backend terminal
2. Look for the request in server logs
3. See if the route exists in `server/src/routes/`

### Method 3: Check Frontend Console

1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for error messages
4. Check the API error interceptor logs

---

## 📋 Available API Endpoints

### Admin Routes (`/api/admin`)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Get current admin (requires auth)

### Celebration Routes (`/api/celebrations`)
- `GET /api/celebrations/slug/:slug` - Get celebration by slug (public)
- `GET /api/celebrations` - Get all celebrations (admin)
- `GET /api/celebrations/:id` - Get celebration by ID (admin)
- `POST /api/celebrations` - Create celebration (admin)
- `PUT /api/celebrations/:id` - Update celebration (admin)
- `DELETE /api/celebrations/:id` - Delete celebration (admin)

### Wish Routes (`/api/wishes`)
- `GET /api/wishes/celebration/:celebrationId` - Get wishes for celebration (public)
- `POST /api/wishes` - Create wish (public)
- `GET /api/wishes` - Get all wishes (admin)
- `PATCH /api/wishes/:id/approve` - Approve wish (admin)
- `DELETE /api/wishes/:id` - Delete wish (admin)

### Upload Routes (`/api/upload`)
- `POST /api/upload/image` - Upload image (admin)

### Health Check
- `GET /api/health` - Health check

---

## 🔧 Quick Fixes

### Fix 1: Backend Not Running

```bash
cd server
npm run dev
```

Should see:
```
🚀 Server running on http://localhost:5000
📡 API Health: http://localhost:5000/api/health
```

### Fix 2: Wrong API URL

Check `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Or in production, set it to your Render URL:
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

### Fix 3: Missing Favicon (Harmless)

Create `client/public/vite.svg` or ignore the error.

---

## 🧪 Test Your Backend

Run this to test if backend is working:

```bash
cd server
npm run test:api
```

This will test:
- Health check endpoint
- Admin login
- Get admin info

---

## 📝 Still Having Issues?

1. **Copy the exact error message** from browser console
2. **Check the Network tab** - which URL is failing?
3. **Check backend logs** - is the request reaching the server?
4. **Share the details** so we can fix it!

---

## ✅ Expected Behavior

### When Everything Works:

**Backend:**
```
🚀 Server running on http://localhost:5000
✅ Database connection successful
📊 Connected to Supabase PostgreSQL
```

**Frontend:**
- No 404 errors in console
- API calls succeed
- Pages load correctly

---

## 🎯 Most Likely Issue

Based on common problems:

1. **Backend not running** → Start it: `cd server && npm run dev`
2. **Wrong API URL** → Check `client/.env` file
3. **Static asset 404** → Usually harmless, can ignore
4. **Route doesn't exist** → Check the route is defined in `server/src/routes/`

