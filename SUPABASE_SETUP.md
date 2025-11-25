# Supabase Setup Guide

This guide will help you set up Supabase authentication and database for the ELIDZ-STP Funding Platform.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A new Supabase project created

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in your project details:
   - Name: `elidz-stp-funding-platform` (or your preferred name)
   - Database Password: (save this securely)
   - Region: Choose closest to your users
4. Wait for the project to be created (takes ~2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role key** (this is your `SUPABASE_SERVICE_ROLE_KEY`) - Keep this secret!

## Step 3: Set Up Environment Variables

1. Create a `.env.local` file in the project root (copy from `.env.local.example` if it exists)
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:** Never commit `.env.local` to version control!

## Step 4: Run Database Migrations

1. In your Supabase project dashboard, go to **SQL Editor**
2. Open the file `supabase/migrations/001_initial_schema.sql`
3. Copy the entire SQL content
4. Paste it into the SQL Editor and click **Run**
5. Wait for the migration to complete
6. Repeat for `supabase/migrations/002_rls_policies.sql`

Alternatively, if you have the Supabase CLI installed:

```bash
supabase db push
```

## Step 5: Create Your First Admin User

After running the migrations, you need to create an admin user:

1. Go to **Authentication** → **Users** in your Supabase dashboard
2. Click **Add User** → **Create New User**
3. Enter:
   - Email: `admin@elidz.com` (or your preferred admin email)
   - Password: (choose a strong password)
   - Auto Confirm User: ✅ (check this)
4. Click **Create User**
5. Copy the User ID (UUID) that was created
6. Go to **Table Editor** → **users**
7. Click **Insert** → **Insert Row**
8. Fill in:
   - `id`: Paste the User ID from step 5
   - `email`: `admin@elidz.com`
   - `role`: `admin`
   - `first_name`: `Admin`
   - `last_name`: `User`
   - `phone`: `+27123456789` (or any valid phone)
   - `approved`: ✅ (check this)
9. Click **Save**

## Step 6: Configure Email Authentication (Optional)

For production, configure email authentication:

1. Go to **Authentication** → **Settings** → **Email Auth**
2. Configure your email settings:
   - Enable email confirmations (recommended for production)
   - Set up email templates
   - Configure redirect URLs

For development, you can disable email confirmations temporarily.

## Step 7: Test the Setup

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Navigate to `http://localhost:3000/register`
3. Create a test SMME user account
4. Log in with your admin account at `http://localhost:3000/login`
5. Go to `/admin/users` to approve the test user

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env.local` file has the correct keys
- Make sure there are no extra spaces or quotes
- Restart your dev server after changing `.env.local`

### "Row Level Security policy violation"
- Make sure you ran the RLS policies migration (`002_rls_policies.sql`)
- Check that your user has the correct role in the `users` table

### "User not found" after login
- Ensure the user exists in both `auth.users` (Supabase Auth) and `public.users` (your custom table)
- Check that the user ID matches between both tables

### Session not persisting
- Check that middleware is working (should be in `middleware.ts`)
- Verify cookies are being set in browser dev tools

## Next Steps

After completing this setup:

1. ✅ Authentication is working with Supabase
2. ✅ Database schema is created
3. ✅ RLS policies are in place
4. ⏭️ Next: Replace mock data with real Supabase queries
5. ⏭️ Next: Integrate OpenAI for AI matching
6. ⏭️ Next: Set up Resend for email notifications

## Security Notes

- **Never commit** `.env.local` or service role keys
- Use environment variables for all sensitive data
- RLS policies ensure users can only access their own data
- Service role key should only be used server-side, never in client code
- Regularly rotate your API keys in production

## Support

If you encounter issues:
1. Check the Supabase logs in your dashboard
2. Review the browser console for client-side errors
3. Check the Next.js terminal output for server-side errors
4. Verify all migrations ran successfully

