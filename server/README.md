# Gsquad Forever - Backend Server

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `CLOUDINARY_*`: Cloudinary credentials for image uploads

3. Run database migrations:
```bash
npm run migrate
```

This will:
- Create all necessary tables
- Create a default admin user (admin@gsquadforever.com / admin123)

4. Start the server:
```bash
npm run dev
```

## API Endpoints

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Get current admin (requires auth)

### Celebrations
- `GET /api/celebrations/slug/:slug` - Get celebration by slug (public)
- `GET /api/celebrations` - Get all celebrations (admin)
- `GET /api/celebrations/:id` - Get celebration by ID (admin)
- `POST /api/celebrations` - Create celebration (admin)
- `PUT /api/celebrations/:id` - Update celebration (admin)
- `DELETE /api/celebrations/:id` - Delete celebration (admin)

### Wishes
- `GET /api/wishes/celebration/:celebrationId` - Get wishes for celebration (public)
- `POST /api/wishes` - Create wish (public)
- `GET /api/wishes` - Get all wishes (admin)
- `PATCH /api/wishes/:id/approve` - Approve wish (admin)
- `DELETE /api/wishes/:id` - Delete wish (admin)

### Upload
- `POST /api/upload/image` - Upload image (admin)

## Database Schema

### Admins
- id, email, password_hash, created_at, updated_at

### Celebrations
- id, title, subtitle, slug, event_type, event_date, story, cover_image, images[], videos[], qr_image, money_collection_enabled, theme (JSONB), sections (JSONB), quotes[], created_at, updated_at

### Wishes
- id, celebration_id, name, message, amount, approved, created_at, updated_at


