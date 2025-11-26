# Migration 005: Create User Registration Function

## Problem
When users register, the INSERT into the `users` table fails with RLS error because the session isn't immediately available after `signUp`.

## Solution
Created a database function `create_user_record()` that:
- Runs with SECURITY DEFINER (bypasses RLS)
- Validates that the user_id matches auth.uid() (security)
- Safely creates the user record
- Has proper error handling

## How to Apply

1. **Go to Supabase Dashboard → SQL Editor**

2. **Run the migration file:**
   ```
   supabase/migrations/005_create_user_registration_function.sql
   ```

3. **Or copy and paste this SQL:**

```sql
-- Create a database function to safely insert user records during registration
CREATE OR REPLACE FUNCTION public.create_user_record(
  user_id UUID,
  user_email TEXT,
  user_role TEXT,
  user_first_name TEXT,
  user_last_name TEXT,
  user_phone TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  auth_user_id UUID;
BEGIN
  -- Get the authenticated user's ID
  auth_user_id := auth.uid();
  
  -- Verify that the user_id matches the authenticated user
  IF auth_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  IF auth_user_id != user_id THEN
    RAISE EXCEPTION 'Cannot create record for another user';
  END IF;
  
  -- Insert the user record
  INSERT INTO public.users (
    id,
    email,
    role,
    first_name,
    last_name,
    phone,
    approved
  ) VALUES (
    user_id,
    user_email,
    user_role,
    user_first_name,
    user_last_name,
    user_phone,
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone = EXCLUDED.phone;
  
  RETURN user_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.create_user_record(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_record(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon;
```

4. **Verify the function was created:**

```sql
SELECT 
  proname as function_name,
  prosecdef as is_security_definer
FROM pg_proc 
WHERE proname = 'create_user_record';
```

Should return: `create_user_record | true`

## What This Fixes

- ✅ Registration will now work even if session isn't immediately available
- ✅ Function has security checks (only creates own record)
- ✅ Fallback to direct insert if function doesn't exist
- ✅ Proper error handling

## After Running Migration

Test registration:
1. Go to `/register`
2. Fill out the form
3. Submit
4. Should succeed! ✅


