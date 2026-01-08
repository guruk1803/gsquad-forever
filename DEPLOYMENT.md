# Gsquad Forever - Deployment Guide

## Overview

This guide covers deploying Gsquad Forever to production using cloud services.

## Architecture

- **Frontend**: Vercel / Netlify
- **Backend**: Railway / Render
- **Database**: Supabase / Neon (PostgreSQL)
- **Storage**: Cloudinary
- **Domain**: gsquadforever.com

## Step-by-Step Deployment

### 1. Database Setup (Supabase/Neon)

#### Supabase
1. Go to [supabase.com](https://supabase.com) and create a project
2. Go to Settings → Database
3. Copy the connection string (use the "URI" format)
4. Save it for backend configuration

#### Neon
1. Go to [neon.tech](https://neon.tech) and create a project
2. Copy the connection string from the dashboard
3. Save it for backend configuration

### 2. Cloudinary Setup

1. Go to [cloudinary.com](https://cloudinary.com) and create an account
2. Go to Dashboard
3. Copy:
   - Cloud Name
   - API Key
   - API Secret
4. Save these for backend configuration

### 3. Backend Deployment (Railway)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `server` folder

3. **Configure Environment Variables**
   ```
   PORT=5000
   DATABASE_URL=your_supabase_or_neon_connection_string
   JWT_SECRET=generate_a_strong_random_secret_min_32_chars
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=production
   ```

4. **Run Migrations**
   - In Railway, go to your service
   - Open the terminal/console
   - Run: `npm run migrate`

5. **Get Backend URL**
   - Railway will provide a URL like: `https://your-app.railway.app`
   - Save this for frontend configuration

### 4. Backend Deployment (Render - Alternative)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - New → Web Service
   - Connect your repository
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Configure Environment Variables** (same as Railway)

4. **Run Migrations**
   - Use Render Shell or add a one-time script

### 5. Frontend Deployment (Vercel)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your repository
   - Root Directory: `client`
   - Framework Preset: Vite

3. **Configure Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically

5. **Get Frontend URL**
   - Vercel provides: `https://your-app.vercel.app`
   - Or configure custom domain: `gsquadforever.com`

### 6. Frontend Deployment (Netlify - Alternative)

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Import Project**
   - New site from Git
   - Connect repository
   - Build settings:
     - Base directory: `client`
     - Build command: `npm run build`
     - Publish directory: `client/dist`

3. **Configure Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

### 7. Domain Configuration

#### For Vercel
1. Go to Project Settings → Domains
2. Add `gsquadforever.com`
3. Follow DNS configuration instructions
4. Update DNS records at your domain registrar

#### For Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Follow DNS setup instructions

### 8. SSL Certificates

Both Vercel and Netlify provide automatic SSL certificates via Let's Encrypt. No additional configuration needed.

## Post-Deployment Checklist

- [ ] Database migrations completed
- [ ] Environment variables set correctly
- [ ] Backend API is accessible
- [ ] Frontend can connect to backend
- [ ] Admin login works
- [ ] Image uploads work (Cloudinary)
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Default admin password changed

## Security Recommendations

1. **Change Default Admin Password**
   - Log in to admin panel
   - Create a new admin account
   - Delete or change default admin

2. **Strong JWT Secret**
   - Use a random 32+ character string
   - Never commit to repository

3. **Database Security**
   - Use connection pooling
   - Enable SSL for database connections
   - Restrict database access by IP if possible

4. **Rate Limiting**
   - Already configured in backend
   - Adjust limits in `server/src/server.js` if needed

5. **CORS Configuration**
   - Update CORS settings in production
   - Only allow your frontend domain

## Monitoring & Maintenance

### Railway
- View logs in Railway dashboard
- Set up alerts for errors
- Monitor resource usage

### Vercel/Netlify
- View analytics and logs
- Set up error tracking
- Monitor build times

### Database
- Monitor connection pool usage
- Set up database backups
- Review slow queries

## Troubleshooting

### Backend Not Starting
- Check environment variables
- Verify database connection
- Check logs for errors

### Frontend Build Fails
- Verify `VITE_API_URL` is set
- Check for TypeScript/ESLint errors
- Review build logs

### Database Connection Issues
- Verify connection string format
- Check database is accessible
- Ensure SSL is configured if required

### Image Upload Fails
- Verify Cloudinary credentials
- Check file size limits
- Review Cloudinary dashboard

## Scaling Considerations

1. **Database**
   - Upgrade to higher tier if needed
   - Enable connection pooling
   - Consider read replicas for high traffic

2. **Backend**
   - Railway/Render auto-scales
   - Monitor resource usage
   - Upgrade plan if needed

3. **Frontend**
   - Vercel/Netlify handle scaling automatically
   - CDN is built-in

4. **Storage**
   - Cloudinary handles scaling
   - Monitor storage usage
   - Set up automatic image optimization

## Backup Strategy

1. **Database Backups**
   - Supabase: Automatic daily backups
   - Neon: Automatic backups (check plan)
   - Manual: Export SQL dumps regularly

2. **Code Backups**
   - Git repository is the source of truth
   - Tag releases for easy rollback

3. **Media Backups**
   - Cloudinary provides redundancy
   - Export media URLs if needed

## Support

For deployment issues:
1. Check service status pages
2. Review logs in respective dashboards
3. Consult service documentation
4. Contact support if needed


