# Gsquad Forever – Universal Celebration Platform

🌐 **Domain**: https://gsquadforever.com

A universal celebration web application that can be used by any individual, family, community, or organization to create love-centric celebration pages (weddings, engagements, birthdays, anniversaries, baby showers, festivals, etc.).

## Features

- 🎨 Fully customizable celebration pages
- 👑 Admin control panel for managing all aspects
- 💝 Public wishes and contributions system
- 🎨 Dynamic theme engine with customizable colors
- 📸 Image and video galleries
- 💰 Money collection via QR/UPI
- 📝 Rich text stories and content
- 🔐 Secure admin authentication

## Technology Stack

- **Frontend**: React.js (Vite), Tailwind CSS
- **Backend**: Node.js (Express), JWT authentication
- **Database**: PostgreSQL (Supabase/Neon)
- **Storage**: Cloudinary/Supabase Storage

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or Supabase/Neon account)
- Cloudinary account (for media storage)

### Installation

1. Install all dependencies:
```bash
npm run install:all
```
3
2. Set up environment variables:

**Client** (`client/.env`):
```
VITE_API_URL=http://localhost:5000
```

**Server** (`server/.env`):
```
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

3. Run database migrations:
```bash
cd server
npm run migrate
```

4. Start development servers:
```bash
npm run dev
```

### 📖 Documentation

All documentation is organized in the [`docs/`](./docs/) folder:

- **[📚 Documentation Index](./docs/README.md)** - Complete documentation overview
- **[🚀 Deployment Guide](./docs/deployment/DEPLOY.md)** - Production deployment
- **[⚙️ Setup Guide](./docs/project-flow/SETUP.md)** - Local development setup
- **[🔌 API Documentation](./docs/api-flow/README.md)** - API endpoints
- **[💾 Database Guide](./docs/database/README.md)** - Database setup

## Project Structure

```
gsquad-forever/
├── client/          # React frontend
├── server/           # Node.js backend
└── README.md
```

## License

Private - Gsquad Forever


