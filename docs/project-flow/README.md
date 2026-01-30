# Project Flow Documentation

## Project Overview

**GsquaD Forever** - A universal celebration platform for creating beautiful, customizable celebration pages.

## Technology Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Neon/Supabase)
- **Storage**: Cloudinary
- **Deployment**: Vercel (Frontend) + Render (Backend)

## Project Structure

```
gsquad-forever/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── routes/      # Route configs
│   │   └── services/    # API services
│   └── package.json
├── server/              # Node.js backend
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── routes/      # API routes
│   │   ├── middlewares/ # Custom middlewares
│   │   └── db/          # Database
│   └── package.json
├── docs/                # Documentation
├── migrate.sql          # Database schema
└── README.md            # Main README
```

## Setup Flow

1. **Install Dependencies**
   ```bash
   npm run install:all
   ```

2. **Database Setup**
   - Create Neon/Supabase account
   - Get connection string
   - Run migrations

3. **Environment Variables**
   - Set up `client/.env`
   - Set up `server/.env`

4. **Run Development**
   ```bash
   npm run dev
   ```

## User Flow

1. **Admin Login** → Create/Manage Celebrations
2. **Public Access** → View Celebration Pages
3. **User Interaction** → Submit Wishes
4. **Admin Approval** → Approve Wishes
5. **Public Display** → Approved Wishes Show

## Key Features

- ✅ Customizable celebration pages
- ✅ Image galleries with carousel
- ✅ Wish submission system
- ✅ Admin approval workflow
- ✅ Money collection via QR
- ✅ Spotify code integration
- ✅ Theme customization

