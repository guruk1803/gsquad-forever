# Quick Start - Database Setup

## The Error You're Seeing

```
Error: SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string
```

This means your `DATABASE_URL` is either:
1. Not set in the `.env` file
2. Has an incorrect format
3. Has special characters in the password that need URL encoding

## Solution

### Step 1: Edit the `.env` file

Open `server/.env` and update the `DATABASE_URL` with your actual database connection string.

### Step 2: Choose Your Database Option

#### Option A: Local PostgreSQL

If you have PostgreSQL installed locally:

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/gsquad_forever
```

**To create the database:**
```sql
CREATE DATABASE gsquad_forever;
```

#### Option B: Supabase (Free Cloud Database)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the **Connection string** (URI format)
5. It will look like:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
6. Paste it into your `.env` file

#### Option C: Neon (Free Cloud Database)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string from the dashboard
4. It will look like:
   ```
   postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb
   ```
5. Paste it into your `.env` file

### Step 3: Handle Special Characters in Password

If your password contains special characters, you need to URL-encode them:

- `@` becomes `%40`
- `#` becomes `%23`
- `/` becomes `%2F`
- `:` becomes `%3A`
- `?` becomes `%3F`
- `&` becomes `%26`
- `=` becomes `%3D`

**Example:**
- Password: `my@pass#123`
- Encoded: `my%40pass%23123`
- Full URL: `postgresql://user:my%40pass%23123@host:5432/db`

### Step 4: Run Migration

Once your `.env` file has the correct `DATABASE_URL`:

```bash
cd server
npm run migrate
```

You should see:
```
✅ Database connection successful
✅ Database tables created successfully
✅ Default admin created: admin@gsquadforever.com / admin123
```

## Example .env File

```env
# Database - Replace with your actual connection string
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/gsquad_forever

# Server
PORT=5000
NODE_ENV=development

# JWT Secret - Change this to a random 32+ character string
JWT_SECRET=my_super_secret_jwt_key_min_32_characters_long

# Cloudinary (optional for now, but required for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Default Admin Password
DEFAULT_ADMIN_PASSWORD=admin123
```

## Still Having Issues?

1. **Verify PostgreSQL is running** (if using local):
   ```bash
   # Windows
   Get-Service postgresql*
   
   # Or check if port 5432 is listening
   netstat -an | findstr 5432
   ```

2. **Test your connection string**:
   ```bash
   # Using psql (if installed)
   psql "your_connection_string_here"
   ```

3. **Check the error message** - The improved error handler will now show more specific information about what's wrong.

4. **Common mistakes**:
   - Missing `postgresql://` prefix
   - Wrong port number (default is 5432)
   - Database doesn't exist
   - Wrong username/password
   - Special characters not URL-encoded

## Need Help?

- Check `SETUP.md` for detailed setup instructions
- Verify your database credentials are correct
- Make sure the database exists (create it if using local PostgreSQL)



