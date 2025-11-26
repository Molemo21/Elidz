# Prisma + JWT Auth Setup Guide

This guide will help you set up Prisma with your existing Supabase database and JWT authentication.

## Step 1: Get Your Database Connection String

Since you're using Supabase as your database host, you need to get the PostgreSQL connection string:

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Scroll to **Connection string** section
4. Select **URI** mode
5. Copy the connection string (it looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with your actual database password

## Step 2: Configure Environment Variables

Add this to your `.env.local` file (create it if it doesn't exist):

```env
# Database connection (use Supabase PostgreSQL connection string)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?schema=public"

# JWT Secret (generate a random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# NextAuth.js (for the JWT auth example)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-change-this-in-production"
```

**Important:** 
- Never commit `.env.local` to version control
- Use a strong random string for JWT_SECRET and NEXTAUTH_SECRET
- You can generate secrets with: `openssl rand -base64 32` (or any random string generator)

## Step 3: Pull Database Schema (Optional)

If you want Prisma to automatically detect your schema from the database:

```bash
npx prisma db pull
```

This will update `prisma/schema.prisma` to match your actual database structure.

**Note:** The current schema already matches your database structure, so this is optional.

## Step 4: Generate Prisma Client

After setting up the connection string, generate the Prisma client:

```bash
npx prisma generate
```

This creates the Prisma Client that you'll use in your application.

## Step 5: Test the Connection

Create a test script to verify Prisma can connect to your database:

```bash
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.user.findMany().then(users => console.log('Connected! Found', users.length, 'users')).catch(e => console.error('Error:', e.message)).finally(() => prisma.$disconnect())"
```

Or run the test file we'll create: `node prisma/test-connection.js`

## Step 6: Add Password Hash Column (For JWT Migration)

Your current database stores auth in Supabase's `auth.users` table. To migrate to JWT, you'll need to add a `password_hash` column to your `users` table.

Run this SQL in your Supabase SQL Editor:

```sql
-- Add password_hash column for JWT authentication
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Create index for faster lookups (optional)
CREATE INDEX IF NOT EXISTS idx_users_password_hash ON public.users(password_hash) WHERE password_hash IS NOT NULL;
```

## Step 7: Remove Foreign Key Constraint (Optional)

Your `users` table currently references `auth.users(id)`. For JWT auth, you don't need this constraint. However, **be careful** - only remove it if you're fully migrating away from Supabase Auth:

```sql
-- Only run this if you're fully migrating away from Supabase Auth
-- ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;
```

**Recommendation:** Keep the constraint for now until you've fully migrated users to JWT auth.

## Next Steps

1. ✅ Prisma is set up
2. ✅ Database connection configured
3. ⏭️ Generate Prisma Client: `npx prisma generate`
4. ⏭️ Test the connection
5. ⏭️ Create JWT authentication service
6. ⏭️ Replace Supabase Auth with JWT

## Troubleshooting

### "Can't reach database server"
- Check your DATABASE_URL is correct
- Verify your Supabase project is active
- Check if your IP needs to be whitelisted in Supabase (Settings → Database → Connection pooling)

### "Schema does not match"
- Run `npx prisma db pull` to sync schema with database
- Or manually update `prisma/schema.prisma` to match your database

### "Relation does not exist"
- Make sure you're using the correct schema (should be `public`)
- Check that all tables exist in your database

## Important Notes

- **RLS Policies:** Prisma queries bypass RLS when using the service role connection string. You may need to disable or modify RLS policies.
- **Migration Path:** Keep Supabase Auth working while you build JWT auth. Migrate users gradually.
- **Password Migration:** When a user logs in with Supabase Auth, you can generate a JWT and optionally migrate their password hash.

