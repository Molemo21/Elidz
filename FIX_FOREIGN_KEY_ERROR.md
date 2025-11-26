# Fix Foreign Key Constraint Error

## The Error

```
Foreign key constraint violated: `users_id_fkey (index)`
```

## Problem

The `users` table has a foreign key constraint that references Supabase's `auth.users` table:

```sql
id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
```

This prevents creating users directly in the `users` table without first creating them in Supabase Auth. Since we're using JWT authentication now, we need to remove this constraint.

## The Fix

I've created a migration file: `supabase/migrations/009_remove_auth_users_fk.sql`

This migration removes the foreign key constraint, allowing users to be created independently.

## How to Apply the Fix

### Step 1: Run the Migration

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Go to SQL Editor** (left sidebar)
4. **Click "New Query"**
5. **Copy and paste this SQL**:

```sql
-- Remove foreign key constraint from users table
ALTER TABLE public.users
DROP CONSTRAINT IF EXISTS users_id_fkey;
```

6. **Click "Run"** (or press Ctrl+Enter)
7. **Verify success** - You should see "Success. No rows returned"

### Step 2: Verify

After running the migration:

1. **Try registering again**: Go to `/register` and create an account
2. **Should work now!** ✅

## What This Does

- Removes the foreign key constraint linking `users.id` to `auth.users.id`
- Allows Prisma to create users with auto-generated UUIDs
- Makes the `users` table independent (as needed for JWT auth)

## After Fixing

- ✅ Users can be created via registration API
- ✅ No more foreign key constraint errors
- ✅ Registration should work smoothly

---

**Run the migration SQL above to fix the registration error!**

