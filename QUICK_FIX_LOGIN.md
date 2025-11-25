# Quick Fix: Login Timeout Issue

## The Problem
Login is timing out even though Supabase connection test passes. This usually means **the user doesn't exist in Supabase Authentication**.

## Solution: Create Admin User in Supabase

### Step 1: Create User in Supabase Auth

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **Users** (left sidebar)
4. Click **"Add User"** → **"Create New User"**
5. Fill in:
   - **Email**: `admin@elidz.com` (or your preferred email)
   - **Password**: Choose a strong password (remember this!)
   - **Auto Confirm User**: ✅ **CHECK THIS BOX** (important!)
6. Click **"Create User"**
7. **Copy the User ID (UUID)** that appears - you'll need this!

### Step 2: Add User to Database

1. In Supabase Dashboard, go to **Table Editor** → **users**
2. Click **"Insert"** → **"Insert Row"**
3. Fill in:
   - **id**: Paste the UUID from Step 1
   - **email**: `admin@elidz.com` (same as above)
   - **role**: Type `admin` (must be exactly "admin")
   - **first_name**: `Admin`
   - **last_name**: `User`
   - **phone**: `+27123456789` (or any phone number)
   - **approved**: ✅ **CHECK THIS BOX** (important!)
4. Click **"Save"**

### Step 3: Verify Database Tables Exist

If the `users` table doesn't exist, you need to run migrations:

1. Go to **SQL Editor** in Supabase
2. Copy all content from `supabase/migrations/001_initial_schema.sql`
3. Paste and click **"Run"**
4. Wait for success message
5. Copy all content from `supabase/migrations/002_rls_policies.sql`
6. Paste and click **"Run"**
7. Wait for success message

### Step 4: Test Login

1. Go to `http://localhost:3000/login`
2. Enter:
   - Email: `admin@elidz.com`
   - Password: (the password you set in Step 1)
3. Click **Sign In**

## Why This Happens

The login times out because:
- Supabase Auth tries to authenticate the user
- But the user doesn't exist in the `auth.users` table
- The request hangs waiting for a response that never comes

## Checklist

- [ ] User created in Authentication → Users
- [ ] User ID copied
- [ ] User record added to Table Editor → users
- [ ] `role` set to `admin`
- [ ] `approved` checkbox checked
- [ ] Database migrations run (if tables don't exist)
- [ ] Tried logging in with correct credentials

## Still Not Working?

1. **Check browser console** (F12) for specific errors
2. **Check Network tab** - look for failed requests to Supabase
3. **Verify Supabase project is active** - not paused
4. **Check .env file** - make sure anon key is on one line

