# API Flow Documentation

## Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-backend-url.com/api`

## Authentication

Most admin endpoints require JWT authentication. Include token in header:

```
Authorization: Bearer <token>
```

## API Endpoints

### Admin Endpoints

#### Login
```
POST /api/admin/login
Body: { email, password }
Response: { token, admin: { id, email } }
```

#### Get Current Admin
```
GET /api/admin/me
Headers: Authorization: Bearer <token>
Response: { id, email, created_at }
```

### Celebration Endpoints

#### Get Celebration by Slug (Public)
```
GET /api/celebrations/slug/:slug
Response: { id, title, subtitle, slug, ... }
```

#### Get All Celebrations (Admin)
```
GET /api/celebrations
Headers: Authorization: Bearer <token>
Response: [{ id, title, slug, ... }, ...]
```

#### Get Celebration by ID (Admin)
```
GET /api/celebrations/:id
Headers: Authorization: Bearer <token>
Response: { id, title, subtitle, ... }
```

#### Create Celebration (Admin)
```
POST /api/celebrations
Headers: Authorization: Bearer <token>
Body: {
  title, subtitle, slug, eventType, eventDate,
  story, coverImage, images[], videos[],
  qrImage, spotifyCode, moneyCollectionEnabled,
  theme, sections, quotes[]
}
Response: { id, title, ... }
```

#### Update Celebration (Admin)
```
PUT /api/celebrations/:id
Headers: Authorization: Bearer <token>
Body: { ... (same as create) }
Response: { id, title, ... }
```

#### Delete Celebration (Admin)
```
DELETE /api/celebrations/:id
Headers: Authorization: Bearer <token>
Response: { message: "Celebration deleted" }
```

### Wish Endpoints

#### Get Wishes by Celebration (Public)
```
GET /api/wishes/celebration/:celebrationId
Response: [{ id, name, message, amount, approved, ... }, ...]
```

#### Create Wish (Public)
```
POST /api/wishes
Body: {
  celebrationId, name, message, amount?
}
Response: { id, name, message, approved: false, ... }
```

#### Get All Wishes (Admin)
```
GET /api/wishes
Headers: Authorization: Bearer <token>
Response: [{ id, name, message, celebration, ... }, ...]
```

#### Approve Wish (Admin)
```
PATCH /api/wishes/:id/approve
Headers: Authorization: Bearer <token>
Response: { id, name, message, approved: true, ... }
```

#### Delete Wish (Admin)
```
DELETE /api/wishes/:id
Headers: Authorization: Bearer <token>
Response: { message: "Wish deleted" }
```

### Upload Endpoints

#### Upload Image (Admin)
```
POST /api/upload/image
Headers: 
  Authorization: Bearer <token>
  Content-Type: multipart/form-data
Body: FormData with 'image' field
Response: { url, publicId }
```

## Error Responses

All errors follow this format:

```json
{
  "message": "Error description",
  "error": "Error code (development only)"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

