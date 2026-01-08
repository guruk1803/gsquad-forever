# Fix: ECONNREFUSED Error

## The Problem

You're seeing this error:
```
AggregateError [ECONNREFUSED]
http proxy error: /api/admin/login
```

**This means: The backend server is NOT running!**

## The Solution

### Step 1: Start the Backend Server

Open a **new terminal window** and run:

```bash
cd server
npm run dev
```

**Wait until you see:**
```
🚀 Server running on http://localhost:5000
```

### Step 2: Keep Both Terminals Open

You need **TWO terminal windows** running:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
✅ Should show: `🚀 Server running on http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
✅ Should show: `Local: http://localhost:3001/`

### Step 3: Verify Backend is Running

Open your browser and visit:
```
http://localhost:5000/api/health
```

You should see:
```json
{"status":"ok","message":"Gsquad Forever API is running"}
```

If you see an error, the backend is not running correctly.

## Quick Check Commands

### Check if port 5000 is in use:
```powershell
netstat -ano | findstr :5000
```

If nothing shows up, the server is NOT running.

### Check if backend process is running:
```powershell
Get-Process | Where-Object {$_.ProcessName -like "*node*"}
```

## Common Issues

### Issue 1: "Cannot find module"
**Fix:**
```bash
cd server
npm install
```

### Issue 2: "Database connection error"
**Fix:**
1. Check `server/.env` has correct `DATABASE_URL`
2. Make sure PostgreSQL is running
3. Test connection: `psql "your_connection_string"`

### Issue 3: "Port 5000 already in use"
**Fix:**
1. Find what's using the port:
   ```powershell
   netstat -ano | findstr :5000
   ```
2. Kill the process or change port in `server/.env`:
   ```
   PORT=5001
   ```
3. Update `client/vite.config.js` proxy target to match

### Issue 4: Server starts but crashes immediately
**Check:**
- Database connection in `.env`
- All dependencies installed: `npm install`
- Node.js version (needs 18+)

## Using the Root Script (Alternative)

From the **root directory**, you can start both at once:

```bash
npm run dev
```

This uses `concurrently` to run both servers. You'll see output from both.

## Still Not Working?

1. **Check backend logs** - Look at Terminal 1 for error messages
2. **Check frontend logs** - Look at browser console (F12)
3. **Verify .env file** - Make sure `server/.env` exists and has `DATABASE_URL`
4. **Test database** - Make sure your database is accessible
5. **Restart everything** - Close all terminals and start fresh

## Success Indicators

✅ Backend terminal shows: `🚀 Server running on http://localhost:5000`
✅ Frontend terminal shows: `Local: http://localhost:3001/`
✅ Browser can access: http://localhost:5000/api/health
✅ No proxy errors in frontend terminal
✅ Admin login page loads without errors

Once you see all these, you're good to go! 🎉


