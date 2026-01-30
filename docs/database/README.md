# Database Documentation

## Database Options

### Recommended: Neon (Free)
- **URL**: https://neon.tech
- **Free Tier**: 512 MB storage
- **Best for**: Production deployments
- **Connection**: Serverless PostgreSQL

### Alternative: Supabase (Free)
- **URL**: https://supabase.com
- **Free Tier**: 500 MB storage
- **Connection**: PostgreSQL with pooler

### Local: PostgreSQL
- Install PostgreSQL locally
- Create database manually
- Use for development only

## Database Schema

### Tables

1. **admins** - Admin users
2. **celebrations** - Celebration pages
3. **wishes** - User wishes/comments

See [Migration Guide](./MIGRATION.md) for schema details.

## Connection String Format

```
postgresql://username:password@host:port/database?sslmode=require
```

**Important**: URL-encode special characters in password:
- `@` → `%40`
- `#` → `%23`
- `/` → `%2F`

## Migration

Run migrations to create tables:

```bash
cd server
npm run migrate
```

Or manually run `migrate.sql` in your database SQL editor.

## Files

- `migrate.sql` - Complete database schema
- `ADD_SPOTIFY_CODE_MIGRATION.sql` - Add Spotify code column (if needed)

