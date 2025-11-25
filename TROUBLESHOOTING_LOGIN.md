# Troubleshooting Login Issues

If you're experiencing a loading state that never completes when trying to log in, follow these steps:

## Step 1: Verify Environment Variables

1. Check your `.env` file exists and has correct values:
   ```bash
   cat .env
   ```

2. Make sure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is on a **single line** (no line breaks)

3. Restart your dev server after changing `.env`:
   ```bash
   # Stop server (Ctrl+C)
   pnpm dev
   ```

## Step 2: Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try logging in again
4. Look for any error messages - they will tell you exactly what's wrong

## Step 3: Verify Database Setup

### Check if migrations were run:

1. Go to your Supabase dashboard
2. Click **Table Editor** in the left sidebar
3. You should see these tables:
   - ✅ `users`
   - ✅ `user_profiles`
   - ✅ `funding_opportunities`
   - ✅ `matches`
   - ✅ `applications`
   - ✅ `documents`
   - ✅ `notifications`

If you don't see these tables, you need to run the migrations:
1. Go to **SQL Editor**
2. Run `supabase/migrations/001_initial_schema.sql`
3. Run `supabase/migrations/002_rls_policies.sql`

## Step 4: Verify Admin User Exists

### Check Authentication User:

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Find your admin user (e.g., `admin@elidz.com`)
3. **Copy the User ID (UUID)** - it looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

### Check Users Table:

1. Go to **Table Editor** → **users**
2. Check if a row exists with:
   - `id` = The UUID from step above
   - `email` = `admin@elidz.com`
   - `role` = `admin`
   - `approved` = `true` (checked)

### If user doesn't exist in users table:

1. Click **Insert** → **Insert Row**
2. Fill in:
   - `id`: Paste the UUID from Authentication
   - `email`: `admin@elidz.com`
   - `role`: `admin`
   - `first_name`: `Admin`
   - `last_name`: `User`
   - `phone`: `+27123456789`
   - `approved`: ✅ (check this)
3. Click **Save**

## Step 5: Common Error Messages

### "User profile not found"
- **Cause**: User exists in Auth but not in `users` table
- **Fix**: Follow Step 4 above to create the user record

### "Account pending approval"
- **Cause**: User exists but `approved` is `false`
- **Fix**: Go to Table Editor → users, find your user, check the `approved` checkbox

### "Invalid email or password"
- **Cause**: Wrong credentials or user doesn't exist in Auth
- **Fix**: 
  1. Verify email/password in Authentication → Users
  2. Or create a new user in Authentication

### "Failed to load user profile"
- **Cause**: Database connection issue or RLS policy blocking
- **Fix**: 
  1. Check if migrations were run (Step 3)
  2. Check browser console for detailed error
  3. Verify RLS policies were applied

## Step 6: Test Connection

Open browser console and run:
```javascript
// This will test if Supabase is configured
fetch('/api/test-supabase').catch(e => console.log('Supabase not configured:', e))
```

Or check Network tab in DevTools:
- Look for requests to `nxdjdkoamvertmzgslyq.supabase.co`
- Check if they return 200 (success) or errors

## Still Having Issues?

1. **Check the browser console** - errors will be logged there
2. **Check Network tab** - see what API calls are being made
3. **Verify .env file** - make sure no line breaks in the anon key
4. **Restart dev server** - after any .env changes

## Quick Fix Checklist

- [ ] `.env` file exists and has correct values
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is on one line
- [ ] Dev server restarted after .env changes
- [ ] Database migrations have been run
- [ ] Admin user exists in Authentication → Users
- [ ] Admin user exists in Table Editor → users
- [ ] `approved` is checked in users table
- [ ] Browser console checked for errors

