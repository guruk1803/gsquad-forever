# Debugging Guide - How to See API Errors in Browser Console

## 🔍 Viewing API Errors in Browser Console

### Step 1: Open Browser Developer Tools

**Chrome/Edge:**
- Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- Or right-click → "Inspect"

**Firefox:**
- Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)

### Step 2: Go to Console Tab

1. Click on the **"Console"** tab in Developer Tools
2. You'll see all JavaScript errors and API logs here

### Step 3: Understanding the Logs

After the fixes, you'll see:

#### ✅ Successful API Calls (Green/Info)
```
✅ API GET /api/celebrations/1
✅ Celebration data received: {...}
```

#### ❌ API Errors (Red/Error)
```
❌ API Error: {
  url: "/api/celebrations/1",
  method: "GET",
  status: 404,
  statusText: "Not Found",
  data: { message: "Celebration not found" }
}
```

#### 🔍 Detailed Error Groups
Click the arrow to expand error details:
- URL: The API endpoint called
- Method: GET, POST, PUT, DELETE
- Status: HTTP status code (404, 500, etc.)
- Response Data: Error message from server
- Request Data: What was sent to server

## 🐛 Common Error Patterns

### 1. Network Errors
```
❌ API Error: Network Error
```
**Meaning**: Backend server is not running or unreachable
**Fix**: Start backend server (`cd server && npm run dev`)

### 2. 401 Unauthorized
```
❌ API Error: Status 401
⚠️ Unauthorized - redirecting to login
```
**Meaning**: Not logged in or token expired
**Fix**: Login again at `/admin/login`

### 3. 400 Bad Request
```
❌ API Error: Status 400
Response Data: { message: "Title and slug are required" }
```
**Meaning**: Invalid data sent to server
**Fix**: Check the error message and fix the form data

### 4. 404 Not Found
```
❌ API Error: Status 404
Response Data: { message: "Celebration not found" }
```
**Meaning**: Resource doesn't exist
**Fix**: Check if the ID is correct

### 5. 500 Internal Server Error
```
❌ API Error: Status 500
Response Data: { message: "Internal server error" }
```
**Meaning**: Server-side error
**Fix**: Check backend terminal for detailed error

## 📊 What You'll See Now

### Before API Call
```
🔍 Fetching celebration with ID: 1
```

### After Successful Call
```
✅ API GET /api/celebrations/1
✅ Celebration data received: { id: 1, title: "...", ... }
```

### On Error
```
❌ API Error: {
  url: "/api/celebrations/1",
  method: "GET",
  status: 404,
  data: { message: "Celebration not found" }
}

🔍 API Error Details
  URL: /api/celebrations/1
  Method: GET
  Status: 404 Not Found
  Response Data: { message: "Celebration not found" }
  Request Data: undefined
  Full Error: [Error object]
```

## 🛠️ Debugging Steps

### Step 1: Check Console for Errors
1. Open browser console (F12)
2. Look for red error messages
3. Expand error details by clicking the arrow

### Step 2: Check Network Tab
1. Go to **Network** tab in Developer Tools
2. Refresh the page or trigger the action
3. Look for failed requests (red)
4. Click on failed request to see:
   - Request URL
   - Request Headers
   - Request Payload
   - Response (error message)

### Step 3: Check Backend Terminal
1. Look at Terminal 1 (backend server)
2. Check for error messages
3. Look for stack traces

### Step 4: Check Request/Response
In Network tab, click on a request to see:
- **Headers**: Authentication, content-type
- **Payload**: Data sent to server
- **Response**: Data received from server
- **Preview**: Formatted response

## 🎯 Common Issues Fixed

### Issue: "Cannot read properties of undefined (reading 'map')"

**Fixed**: Added safety checks for arrays:
- `formData.images` → `(formData.images || [])`
- `formData.sections` → `(formData.sections || {})`

**Why it happened**: Database returned `null` or `undefined` for arrays, but code expected arrays.

### Issue: No API errors visible in console

**Fixed**: Added comprehensive logging:
- ✅ Success logs (green)
- ❌ Error logs (red)
- 🔍 Detailed error groups

**How to see**: Open browser console (F12) → Console tab

## 📝 Example Debugging Session

### Scenario: Can't create celebration

1. **Open Console** (F12)
2. **Try to create celebration**
3. **Look for errors**:
   ```
   ❌ API Error: Status 400
   Response Data: { message: "Slug already exists" }
   ```
4. **Fix**: Choose a different slug

### Scenario: Can't load celebration

1. **Open Console** (F12)
2. **Check for fetch logs**:
   ```
   🔍 Fetching celebration with ID: 1
   ❌ API Error: Status 404
   Response Data: { message: "Celebration not found" }
   ```
3. **Fix**: Check if celebration exists or ID is correct

## 🔧 Tips for Better Debugging

1. **Keep Console Open**: Always have F12 open while developing
2. **Filter Logs**: Use console filter to show only errors
3. **Clear Console**: Click 🚫 icon to clear old logs
4. **Check Both Tabs**: 
   - Console tab: JavaScript errors
   - Network tab: HTTP requests/responses
5. **Use Breakpoints**: Set breakpoints in code to pause execution

## 🚨 Error Messages Explained

| Error | Meaning | Fix |
|-------|---------|-----|
| `Cannot read properties of undefined` | Trying to access property on undefined object | Add safety checks (`|| []` or `|| {}`) |
| `Network Error` | Can't reach backend | Start backend server |
| `401 Unauthorized` | Not logged in | Login again |
| `404 Not Found` | Resource doesn't exist | Check ID/slug |
| `500 Internal Server Error` | Server crashed | Check backend terminal |

## ✅ Verification

After these fixes, you should see:

1. ✅ **Detailed API logs** in console
2. ✅ **No more "map" errors** on undefined
3. ✅ **Clear error messages** from API
4. ✅ **Request/response data** visible
5. ✅ **Better error handling** throughout

## 🎓 Next Steps

1. **Always check console first** when something doesn't work
2. **Look for red error messages**
3. **Expand error details** to see full information
4. **Check Network tab** for HTTP status codes
5. **Share error logs** when asking for help

---

**Remember**: The browser console is your best friend for debugging! 🐛


