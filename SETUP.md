# Gsquad Forever - Setup Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud like Supabase/Neon)
- Cloudinary account (for image storage)
- Git (optional)

## Quick Start

### 1. Install Dependencies

From the root directory:
```bash
npm run install:all
```

Or manually:
```bash
npm install
cd client && npm install
cd ../server && npm install
```

### 2. Database Setup

#### Option A: Local PostgreSQL
1. Create a database:
```sql
CREATE DATABASE gsquad_forever;
```

2. Update `server/.env` with your connection string:
```
DATABASE_URL=postgresql://username:password@localhost:5432/gsquad_forever
```

#### Option B: Supabase/Neon (Recommended)
1. Create a project on [Supabase](https://supabase.com) or [Neon](https://neon.tech)
2. Copy the connection string to `server/.env`

### 3. Environment Variables

#### Server (`server/.env`)
```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
DEFAULT_ADMIN_PASSWORD=admin123
NODE_ENV=development
```

#### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run Database Migrations

```bash
cd server
npm run migrate
```

This will:
- Create all database tables
- Create a default admin user:
  - Email: `admin@gsquadforever.com`
  - Password: `admin123` (or your `DEFAULT_ADMIN_PASSWORD`)

**⚠️ Change the default admin password after first login!**

### 5. Start Development Servers

From the root directory:
```bash
npm run dev
```

This starts both:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

Or start them separately:
```bash
# Terminal 1 - Frontend
cd client && npm run dev

# Terminal 2 - Backend
cd server && npm run dev
```

## First Steps

1. **Access Admin Panel**: http://localhost:3000/admin/login
   - Email: `admin@gsquadforever.com`
   - Password: `admin123` (or your default)

2. **Create Your First Celebration**:
   - Go to "Celebrations" → "New Celebration"
   - Fill in the details
   - Upload images
   - Customize theme colors
   - Save

3. **View Your Celebration**:
   - Click "View" on your celebration card
   - Or visit: http://localhost:3000/your-slug

## Project Structure

```
gsquad-forever/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts (Auth, Theme)
│   │   ├── routes/         # Route definitions
│   │   └── services/       # API services
│   └── package.json
│
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Auth, validation
│   │   ├── db/             # Database connection & migrations
│   │   └── server.js       # Entry point
│   └── package.json
│
└── README.md
```

## Features

✅ **Admin Panel**
- Create and manage unlimited celebrations
- Customize themes, colors, and sections
- Approve/manage wishes
- Upload images via Cloudinary

✅ **Public Celebration Pages**
- Beautiful, customizable pages
- Image galleries
- Wishes and contributions
- QR code for UPI payments
- Responsive design

✅ **Fully Configurable**
- No hardcoded values
- Admin controls everything
- Dynamic themes
- Section enable/disable

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Check if PostgreSQL is running
- For cloud databases, ensure IP whitelisting is configured

### Image Upload Issues
- Verify Cloudinary credentials in `server/.env`
- Check file size limits (max 10MB)
- Ensure images are in allowed formats (jpg, png, gif, webp)

### Port Already in Use
- Change `PORT` in `server/.env`
- Change Vite port in `client/vite.config.js`

### CORS Errors
- Ensure backend is running on the correct port
- Check `VITE_API_URL` in `client/.env`

## Production Deployment

### Frontend (Vercel/Netlify)
1. Build: `cd client && npm run build`
2. Deploy `client/dist` folder
3. Set environment variable: `VITE_API_URL=https://your-api-url.com/api`

### Backend (Railway/Render)
1. Set all environment variables
2. Run migrations: `npm run migrate`
3. Start: `npm start`

### Database
- Use managed PostgreSQL (Supabase/Neon recommended)
- Ensure connection pooling is enabled

## Support

For issues or questions, check the documentation or create an issue in the repository.


