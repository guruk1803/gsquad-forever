# Quick Start Guide

## Starting the Application

You need to run **both** the backend and frontend servers.

### Step 1: Start Backend Server

Open Terminal 1:
```bash
cd server
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
```

### Step 2: Start Frontend Server

Open Terminal 2:
```bash
cd client
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3001/
  ➜  Network: use --host to expose
```

### Step 3: Access the Application

- **Frontend**: http://localhost:3001
- **Admin Login**: http://localhost:3001/admin/login
- **Backend API**: http://localhost:5000/api

## Troubleshooting

### Error: "ECONNREFUSED" or "Proxy error"

**Problem**: Backend server is not running.

**Solution**: 
1. Make sure you started the backend server (Step 1)
2. Check that port 5000 is not being used by another application
3. Verify the backend is running by visiting: http://localhost:5000/api/health

### Error: "Port already in use"

**Problem**: Another application is using the port.

**Solution**:
- For backend: Change `PORT` in `server/.env`
- For frontend: Change `port` in `client/vite.config.js` or let Vite use the next available port

### Error: "Cannot find module"

**Problem**: Dependencies not installed.

**Solution**:
```bash
# Install all dependencies
npm run install:all

# Or install separately
cd server && npm install
cd ../client && npm install
```

### Backend won't start

**Common issues**:
1. **Database not connected**: Check `DATABASE_URL` in `server/.env`
2. **Port in use**: Change `PORT` in `server/.env`
3. **Missing .env file**: Run `cd server && npm run setup-env`

### Frontend shows "Network Error"

**Common issues**:
1. Backend server is not running
2. Backend is on a different port
3. CORS issues (should be fixed, but check backend logs)

## Using Both Servers Together

### Option 1: Two Terminal Windows
- Terminal 1: Backend (`cd server && npm run dev`)
- Terminal 2: Frontend (`cd client && npm run dev`)

### Option 2: Root Script (if configured)
```bash
# From root directory
npm run dev
```

This should start both servers, but you may need to configure it in `package.json`.

## Verifying Everything Works

1. **Backend Health Check**:
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return: `{"status":"ok","message":"Gsquad Forever API is running"}`

2. **Frontend Loads**: Visit http://localhost:3001

3. **Admin Login**: 
   - Go to http://localhost:3001/admin/login
   - Use: `admin@gsquadforever.com` / `admin123`

## Development Tips

- **Backend logs**: Check terminal running `server` for API requests
- **Frontend logs**: Check browser console (F12)
- **Proxy logs**: Vite will show proxy requests in terminal
- **Hot reload**: Both servers support hot reload - changes auto-refresh

## Next Steps

After both servers are running:
1. Log in to admin panel
2. Create your first celebration
3. View it at: http://localhost:3001/your-slug


