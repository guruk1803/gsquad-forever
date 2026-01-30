# Frontend Documentation

## Technology Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Rich Text**: React Quill

## Project Structure

```
client/
├── src/
│   ├── components/        # Reusable components
│   │   ├── admin/       # Admin-specific components
│   │   ├── celebration/ # Celebration page components
│   │   └── common/      # Shared components
│   ├── contexts/        # React Context providers
│   ├── pages/           # Page components
│   ├── routes/          # Route configurations
│   ├── services/        # API service layer
│   └── App.jsx          # Main app component
├── public/              # Static assets
└── package.json
```

## Key Components

### Celebration Components
- `CelebrationHeader` - Hero section with cover image
- `CelebrationStory` - Rich text story section
- `CelebrationGallery` - Image carousel with thumbnails
- `CelebrationWishes` - Wish submission and display
- `CelebrationContribution` - Money collection QR code
- `CelebrationSpotify` - Spotify code display
- `CelebrationFooter` - Footer with branding

### Admin Components
- `AdminLayout` - Admin dashboard layout
- `AdminLogin` - Login page
- `AdminDashboard` - Main dashboard
- `AdminCelebrations` - Celebration list
- `AdminCelebrationEdit` - Create/edit celebrations
- `AdminWishes` - Wish management

## Environment Variables

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, set `VITE_API_URL` to your backend URL.

## Development

```bash
cd client
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output: `client/dist/`

