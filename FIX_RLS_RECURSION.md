# Fix RLS Infinite Recursion

## Problem
The RLS policies on the `users` table are causing infinite recursion because admin policies check the `users` table itself, creating a circular dependency.

## Solution
Run the migration `003_fix_rls_recursion.sql` in your Supabase SQL Editor.

## Steps

1. **Go to Supabase Dashboard**
   - Navigate to: SQL Editor

2. **Run the migration**
   - Copy the contents of `supabase/migrations/003_fix_rls_recursion.sql`
   - Paste into SQL Editor
   - Click "Run"

3. **Verify the fix**
   - The migration creates a `SECURITY DEFINER` function `is_admin()` that bypasses RLS
   - All admin policies now use this function instead of directly querying the `users` table

## What the fix does

- Creates `is_admin(user_id UUID)` function with `SECURITY DEFINER` (bypasses RLS)
- Drops and recreates all admin policies to use the function
- Prevents infinite recursion by avoiding direct queries to `users` table in policies

## After running the migration

Try logging in again. The RLS recursion error should be resolved.

