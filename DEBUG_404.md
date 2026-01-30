# 🔍 Debug 404 Error - Step by Step

## 🎯 Quick Identification

The 404 error could be from:
1. **Static file** (favicon, images) - Usually harmless
2. **API endpoint** - Needs fixing
3. **Frontend route** - Check React Router

---

## 📋 Step 1: Identify What's Failing

### Open Browser DevTools (F12)

1. **Go to Network Tab**
2. **Refresh the page** (F5)
3. **Look for red entries** (404 status)
4. **Click on the failed request**
5. **Check:**
   - **Request URL** - What's the full URL?
   - **Status Code** - Should be 404
   - **Type** - Is it `xhr`, `fetch`, `document`, `image`, etc.?

### Common 404 URLs:

#### ✅ Harmless (Can Ignore):
- `/vite.svg` - Favicon (now fixed)
- `/favicon.ico` - Browser favicon
- `/robots.txt` - Search engine file

#### ❌ Needs Fixing:
- `/api/...` - API endpoint not found
- `/admin/...` - Frontend route issue
- `/celebration/...` - Frontend route issue

---

## 🔧 Step 2: Fix Based on Type

### If it's `/vite.svg` or `/favicon.ico`:
✅ **FIXED** - I've created the file. Refresh the page.

### If it's an API endpoint (starts with `/api/`):

**Check 1: Is backend running?**
```bash
cd server
npm run dev
```

Should see:
```
🚀 Server running on http://localhost:5000
✅ Database connection successful
```

**Check 2: Test the endpoint directly:**
```bash
# Health check
curl http://localhost:5000/api/health

# Should return: {"status":"ok","message":"Gsquad Forever API is running"}
```

**Check 3: Check the exact endpoint in code:**
- Look at the Network tab - what's the exact URL?
- Check if it exists in `server/src/routes/`
- Compare with the list below

---

## 📝 Available API Endpoints

### ✅ Working Endpoints:

**Admin:**
- `POST /api/admin/login`
- `GET /api/admin/me` (requires auth token)

**Celebrations:**
- `GET /api/celebrations/slug/:slug` (public)
- `GET /api/celebrations` (admin)
- `GET /api/celebrations/:id` (admin)
- `POST /api/celebrations` (admin)
- `PUT /api/celebrations/:id` (admin)
- `DELETE /api/celebrations/:id` (admin)

**Wishes:**
- `GET /api/wishes/celebration/:celebrationId` (public)
- `POST /api/wishes` (public)
- `GET /api/wishes` (admin)
- `PATCH /api/wishes/:id/approve` (admin)
- `DELETE /api/wishes/:id` (admin)

**Upload:**
- `POST /api/upload/image` (admin)

**Health:**
- `GET /api/health`

---

## 🧪 Step 3: Test Your Setup

### Test Backend:
```bash
cd server
npm run test:api
```

### Test Frontend API Connection:
1. Open browser console (F12)
2. Go to Network tab
3. Try logging in or loading a page
4. Check which requests fail

---

## 🐛 Common Issues & Fixes

### Issue 1: "Failed to load resource: 404" for `/api/...`

**Cause:** Backend not running or wrong API URL

**Fix:**
1. Start backend: `cd server && npm run dev`
2. Check `client/.env` has: `VITE_API_URL=http://localhost:5000/api`
3. Restart frontend: `cd client && npm run dev`

---

### Issue 2: 404 for `/vite.svg`

**Cause:** Missing favicon file

**Fix:** ✅ **Already fixed** - Created `client/public/vite.svg`

---

### Issue 3: 404 for frontend routes

**Cause:** React Router route not defined

**Fix:** Check `client/src/App.jsx` and routes configuration

---

## 📸 How to Share Error Details

If you need help, share:

1. **Browser Console Screenshot** (F12 → Console tab)
2. **Network Tab Screenshot** (F12 → Network tab → Click failed request)
3. **Backend Logs** (from terminal running `npm run dev`)
4. **The exact URL** that's failing

---

## ✅ Quick Checklist

- [ ] Backend server is running (`cd server && npm run dev`)
- [ ] Frontend server is running (`cd client && npm run dev`)
- [ ] `client/.env` has correct `VITE_API_URL`
- [ ] Database connection is working (check backend logs)
- [ ] Checked Network tab for exact failing URL
- [ ] Favicon file exists (now fixed)

---

## 🎯 Most Likely Solution

**If you see 404 for `/api/...`:**

1. **Check backend is running:**
   ```bash
   cd server
   npm run dev
   ```

2. **Test health endpoint:**
   ```bash
   curl http://localhost:5000/api/health
   ```

3. **Check API URL in frontend:**
   - File: `client/.env`
   - Should have: `VITE_API_URL=http://localhost:5000/api`

4. **Restart frontend:**
   ```bash
   cd client
   npm run dev
   ```

---

## 💡 Need More Help?

Share:
- The **exact URL** that's failing (from Network tab)
- **Backend logs** (from terminal)
- **Browser console errors** (screenshot or copy text)

Then I can provide a specific fix! 🚀









