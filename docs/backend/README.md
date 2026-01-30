# Backend Documentation

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL (via pg library)
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer + Cloudinary
- **Security**: bcryptjs, express-rate-limit, CORS

## Project Structure

```
server/
├── src/
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── middlewares/     # Custom middlewares
│   ├── db/              # Database connection & migrations
│   └── server.js        # Main server file
├── package.json
└── .env                 # Environment variables
```

## Environment Variables

Create `server/.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_characters

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Default Admin
DEFAULT_ADMIN_PASSWORD=admin123
```

## Development

```bash
cd server
npm install
npm run dev
```

## Database Migration

```bash
npm run migrate
```

This creates all tables and a default admin user.

## API Endpoints

See [API Flow Documentation](../api-flow/README.md) for complete API documentation.

