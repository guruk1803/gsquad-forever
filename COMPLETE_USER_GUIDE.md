# Gsquad Forever - Complete Step-by-Step User Guide

## 📖 What is a Slug URL?

A **slug** is a URL-friendly version of your celebration name. It's what appears in the web address.

### Examples:
- **Celebration Name**: "John & Jane's Wedding"
- **Slug**: `john-jane-wedding`
- **Full URL**: `http://localhost:3001/john-jane-wedding`

### Slug Rules:
- ✅ Use lowercase letters
- ✅ Use hyphens (-) instead of spaces
- ✅ No special characters (except hyphens)
- ✅ Must be unique (can't use the same slug twice)
- ✅ Keep it short and memorable

**Why use slugs?** They make URLs readable and shareable. Instead of `localhost:3001/celebration?id=123`, you get `localhost:3001/john-jane-wedding`.

---

## 🚀 Complete Setup Guide

### Step 1: Start Both Servers

You need **TWO terminal windows**:

#### Terminal 1 - Backend Server
```bash
cd server
npm run dev
```

**Wait for this message:**
```
🚀 Server running on http://localhost:5000
```

#### Terminal 2 - Frontend Server
```bash
cd client
npm run dev
```

**Wait for this message:**
```
Local:   http://localhost:3001/
```

✅ **Both servers must be running!** If you see errors, check the troubleshooting section below.

---

## 📝 Step-by-Step: Creating Your First Celebration

### Step 1: Access Admin Panel

1. Open your browser
2. Go to: `http://localhost:3001/admin/login`
3. Login with:
   - **Email**: `admin@gsquadforever.com`
   - **Password**: `admin123`

### Step 2: Navigate to Celebrations

1. After logging in, you'll see the Dashboard
2. Click **"Celebrations"** in the top navigation
3. You'll see "No celebrations yet" with a button

### Step 3: Create New Celebration

1. Click **"Create Your First Celebration"** (or "New Celebration" button)
2. You'll see a form with multiple sections

### Step 4: Fill in Basic Information

**Required Fields:**
- **Title**: e.g., "John & Jane's Wedding"
- **Slug**: e.g., `john-jane-wedding` (auto-converts to lowercase with hyphens)

**Optional Fields:**
- **Subtitle**: e.g., "Join us in celebrating our special day"
- **Event Type**: Select from dropdown (Wedding, Birthday, etc.)
- **Event Date**: Pick a date

### Step 5: Add Your Story

1. Scroll to **"Content"** section
2. Use the rich text editor to write your love story or event description
3. You can format text (bold, italic, lists, etc.)

### Step 6: Upload Images

**Cover Image:**
1. Scroll to **"Media"** section
2. Click **"Choose File"** under "Cover Image"
3. Select an image (JPG, PNG, GIF, WebP - max 10MB)
4. Wait for upload to complete

**Gallery Images:**
1. Under "Gallery Images", click **"Choose File"**
2. Upload multiple images
3. They'll appear in a grid
4. Click the × to remove any image

### Step 7: Customize Theme

1. Scroll to **"Theme & Colors"** section
2. **Primary Color**: Click the color box or enter hex code (e.g., `#9B7EDE`)
3. **Secondary Color**: Choose a complementary color
4. **Enable Animations**: Check/uncheck the box

### Step 8: Configure Sections

1. Scroll to **"Sections"** section
2. Check/uncheck which sections to show:
   - ✅ Header (title, subtitle, cover image)
   - ✅ Story (your love story)
   - ✅ Gallery (image gallery)
   - ✅ Wishes (guest wishes)
   - ✅ Contribution (money collection)

### Step 9: Set Up Money Collection (Optional)

1. Scroll to **"Money Collection"** section
2. Check **"Enable Money Collection"**
3. Upload your UPI QR code image
4. This allows guests to contribute money

### Step 10: Save Your Celebration

1. Scroll to the bottom
2. Click **"Create Celebration"** button
3. Wait for success message: "Celebration created!"
4. You'll be redirected to the celebrations list

---

## 👀 Viewing Your Celebration

### Method 1: From Admin Panel

1. Go to **Celebrations** page
2. Find your celebration card
3. Click **"View"** button (eye icon)
4. Opens in a new tab

### Method 2: Direct URL

1. Note your celebration's **slug** (e.g., `john-jane-wedding`)
2. Open: `http://localhost:3001/john-jane-wedding`
3. Share this URL with anyone!

---

## ✏️ Editing a Celebration

1. Go to **Celebrations** page
2. Find your celebration
3. Click **"Edit"** button (pencil icon)
4. Make your changes
5. Click **"Save Changes"**

---

## 💬 Managing Wishes

### Viewing Wishes

1. Click **"Wishes"** in the top navigation
2. You'll see all wishes from all celebrations
3. Filter by:
   - **All**: All wishes
   - **Approved**: Only approved wishes
   - **Pending**: Wishes waiting for approval

### Approving Wishes

1. Find a wish with "Pending" badge
2. Click the **green checkmark** (✓) to approve
3. Approved wishes appear on the celebration page

### Deleting Wishes

1. Click the **red X** (✗) to delete
2. Confirm deletion

---

## 🎨 Public Celebration Page Features

When someone visits your celebration URL, they can:

### 1. View Celebration Details
- See title, subtitle, and cover image
- Read your love story
- Browse image gallery (click to view full size)

### 2. Send Wishes
- Enter their name
- Write a message
- Optionally add contribution amount
- Click "Send Wish"
- Wishes appear after admin approval

### 3. Contribute Money (if enabled)
- See QR code for UPI payment
- Scan with phone to send money
- Amount is tracked with their wish

---

## 🔧 Troubleshooting Common Issues

### Issue 1: "Cannot connect to server" or Proxy Errors

**Problem**: Backend server is not running

**Solution**:
1. Check Terminal 1 - should show: `🚀 Server running on http://localhost:5000`
2. If not, run: `cd server && npm run dev`
3. Wait for server to start
4. Refresh your browser

### Issue 2: "Invalid celebration ID" Error

**Problem**: Trying to edit with invalid ID

**Solution**:
1. Make sure you're clicking "Edit" on an existing celebration
2. Don't manually type IDs in the URL
3. Use the "Edit" button from the celebrations list

### Issue 3: Can't Create Celebration

**Checklist**:
- ✅ Title is filled in
- ✅ Slug is filled in (no spaces, lowercase)
- ✅ Slug is unique (not already used)
- ✅ Backend server is running
- ✅ You're logged in as admin

**Common Errors**:
- "Slug already exists" → Choose a different slug
- "Title and slug are required" → Fill in both fields
- "Failed to save" → Check browser console for details

### Issue 4: Images Not Uploading

**Checklist**:
- ✅ Image file size is under 10MB
- ✅ File format is JPG, PNG, GIF, or WebP
- ✅ Cloudinary credentials are set in `server/.env`
- ✅ Backend server is running

**If Cloudinary not configured**:
1. Go to [cloudinary.com](https://cloudinary.com) and create free account
2. Get your credentials from dashboard
3. Add to `server/.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Restart backend server

### Issue 5: Wishes Not Appearing

**Checklist**:
- ✅ Wish was submitted successfully
- ✅ Admin has approved the wish (check Wishes page)
- ✅ "Wishes" section is enabled in celebration settings

### Issue 6: Can't Login

**Default Credentials**:
- Email: `admin@gsquadforever.com`
- Password: `admin123`

**If login fails**:
1. Check backend server is running
2. Check database connection in `server/.env`
3. Verify admin exists: Run `cd server && npm run migrate` (creates default admin)

### Issue 7: Celebration Page Shows "Not Found"

**Checklist**:
- ✅ Slug is correct (check in admin panel)
- ✅ Celebration exists in database
- ✅ Backend server is running
- ✅ URL format: `http://localhost:3001/your-slug` (no `/api/` or `/admin/`)

### Issue 8: Theme Colors Not Applying

**Solution**:
1. Make sure you saved the celebration after changing colors
2. Refresh the celebration page
3. Check browser console for errors
4. Verify color format is hex (e.g., `#9B7EDE`)

---

## 📋 Quick Reference

### URLs

| Page | URL |
|------|-----|
| Home | `http://localhost:3001/` |
| Admin Login | `http://localhost:3001/admin/login` |
| Admin Dashboard | `http://localhost:3001/admin/dashboard` |
| Celebrations List | `http://localhost:3001/admin/celebrations` |
| Create Celebration | `http://localhost:3001/admin/celebrations/new` |
| Wishes | `http://localhost:3001/admin/wishes` |
| Your Celebration | `http://localhost:3001/your-slug` |

### Default Admin

- **Email**: `admin@gsquadforever.com`
- **Password**: `admin123`

⚠️ **Change this password after first login!**

### File Locations

- **Backend Config**: `server/.env`
- **Frontend Config**: `client/.env`
- **Database Migrations**: `server/src/db/migrate.js`

---

## 🎯 Complete Workflow Example

### Creating a Wedding Celebration

1. **Start Servers**
   ```bash
   # Terminal 1
   cd server && npm run dev
   
   # Terminal 2
   cd client && npm run dev
   ```

2. **Login**
   - Go to `http://localhost:3001/admin/login`
   - Login with default credentials

3. **Create Celebration**
   - Click "Celebrations" → "New Celebration"
   - Title: "Sarah & Mike's Wedding"
   - Slug: `sarah-mike-wedding`
   - Event Type: Wedding
   - Event Date: Select date
   - Add story in rich text editor
   - Upload cover image
   - Upload gallery images
   - Set primary color: `#E74C3C` (red)
   - Enable all sections
   - Enable money collection (optional)
   - Upload QR code (optional)
   - Click "Create Celebration"

4. **View Celebration**
   - Click "View" button
   - Or visit: `http://localhost:3001/sarah-mike-wedding`

5. **Share with Guests**
   - Send them the URL: `http://localhost:3001/sarah-mike-wedding`
   - They can view, send wishes, and contribute

6. **Manage Wishes**
   - Go to "Wishes" page
   - Approve pending wishes
   - They'll appear on the celebration page

---

## 🆘 Still Having Issues?

### Check These First:

1. **Both servers running?**
   - Backend: `http://localhost:5000/api/health` should work
   - Frontend: `http://localhost:3001` should load

2. **Database connected?**
   - Check `server/.env` has correct `DATABASE_URL`
   - Run `cd server && npm run migrate` to create tables

3. **Environment variables set?**
   - `server/.env` exists and has all required values
   - `client/.env` exists (optional, uses defaults)

4. **Browser console errors?**
   - Press F12 → Console tab
   - Look for red error messages
   - Share these for debugging

5. **Backend terminal errors?**
   - Check Terminal 1 (backend)
   - Look for error messages
   - Common: database connection, missing env vars

### Getting Help

1. Check error messages in:
   - Browser console (F12)
   - Backend terminal
   - Frontend terminal

2. Verify configuration:
   - Database connection string
   - Cloudinary credentials (for images)
   - JWT secret

3. Try restarting:
   - Stop both servers (Ctrl+C)
   - Start them again
   - Clear browser cache (Ctrl+Shift+Delete)

---

## ✅ Success Checklist

After setup, you should be able to:

- [ ] Login to admin panel
- [ ] Create a new celebration
- [ ] Upload images
- [ ] Customize theme colors
- [ ] View celebration at slug URL
- [ ] Submit a wish (as guest)
- [ ] Approve wishes (as admin)
- [ ] Edit existing celebration
- [ ] Delete celebration

If all these work, you're all set! 🎉

---

**Need more help?** Check the other documentation files:
- `SETUP.md` - Initial setup
- `DEPLOYMENT.md` - Production deployment
- `FIX_CONNECTION_ERROR.md` - Connection issues
- `QUICK_START.md` - Quick reference

