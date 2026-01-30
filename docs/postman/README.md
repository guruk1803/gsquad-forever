# Postman Collection

## API Testing

Use Postman to test all API endpoints.

## Collection Setup

1. Import the collection (see below)
2. Set environment variables:
   - `base_url`: `http://localhost:5000/api` (development)
   - `token`: JWT token from login (set after login)

## Endpoints Included

### Authentication
- Admin Login

### Celebrations
- Get by Slug (Public)
- Get All (Admin)
- Get by ID (Admin)
- Create (Admin)
- Update (Admin)
- Delete (Admin)

### Wishes
- Get by Celebration (Public)
- Create Wish (Public)
- Get All (Admin)
- Approve Wish (Admin)
- Delete Wish (Admin)

### Upload
- Upload Image (Admin)

## Postman Collection JSON

Create a new collection in Postman and import this structure, or use the API documentation to manually create requests.

## Environment Variables

Create a Postman environment with:
- `base_url`: Your API base URL
- `token`: JWT token (auto-set after login)

