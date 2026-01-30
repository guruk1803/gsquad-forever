# 🚀 Deployment Guide

## ✅ 100% FREE - No Credit Card Required

All services are FREE:
- **Neon** - Database (FREE)
- **Cloudinary** - Images (FREE)
- **Render** - Backend (FREE)
- **Vercel** - Frontend (FREE)

**Total Cost: $0/month** 🎉

---

## 📋 Quick Steps

1. **Database** → Neon (5 min)
2. **Images** → Cloudinary (2 min)
3. **Backend** → Render (10 min)
4. **Frontend** → Vercel (5 min)

---

## Step 1: Database (Neon)

1. Go to: https://neon.tech → Sign up (FREE)
2. Create project: `gsquad-forever`
3. Copy connection string
4. Run migrations in Neon SQL Editor:
   - Open SQL Editor
   - Paste `migrate.sql` contents
   - Run

**Connection String Format:**
```
postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

---

## Step 2: Cloudinary (Image Storage)

1. Go to: https://cloudinary.com → Sign up (FREE)
2. Get credentials from Dashboard:
   - Cloud Name
   - API Key
   - API Secret

---

## Step 3: Backend (Render)

1. Go to: https://render.com → Sign up (FREE)
2. New → Web Service
3. Connect GitHub repository
4. Configure:
   - **Name**: `gsquad-forever-backend`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Environment Variables**:
   ```
   DATABASE_URL=<your-neon-connection-string>
   JWT_SECRET=<random-32-char-string>
   CLOUDINARY_CLOUD_NAME=<your-cloud-name>
   CLOUDINARY_API_KEY=<your-api-key>
   CLOUDINARY_API_SECRET=<your-api-secret>
   DEFAULT_ADMIN_PASSWORD=admin123
   NODE_ENV=production
   ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
   ```

6. Deploy

---

## Step 4: Frontend (Vercel)

1. Go to: https://vercel.com → Sign up (FREE)
2. New Project → Import GitHub repository
3. Configure:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

5. Deploy

---

## Post-Deployment

1. **Run Migrations** in Neon SQL Editor
2. **Test Login** at frontend URL
3. **Create First Celebration**
4. **Test Public Page**

---

## Troubleshooting

- **Database Connection**: Check connection string format
- **CORS Errors**: Verify `ALLOWED_ORIGINS` in Render
- **404 Errors**: Check `vercel.json` exists in `client/`
- **Build Errors**: Check environment variables

---

## URLs After Deployment

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.onrender.com`
- **API**: `https://your-app.onrender.com/api`

