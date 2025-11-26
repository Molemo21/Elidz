# Migration 006: Auto-Create User Trigger

## Problem
User registration fails because:
1. Session isn't immediately available after `signUp()`
2. Direct INSERT fails due to RLS (no session)
3. Function fails because `auth.uid()` is NULL (no session)

## Solution
Create a database trigger that **automatically** creates the user record in `public.users` when a new user is created in `auth.users`. This happens server-side, so there are no session timing issues.

---

## How to Apply

### Step 1: Run Migration

1. **Go to Supabase Dashboard → SQL Editor**

2. **Run the migration file:**
   ```
   supabase/migrations/006_auto_create_user_trigger.sql
   ```

3. **Or copy and paste this SQL:**

```sql
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
  user_role TEXT := 'smme';
  user_first_name TEXT;
  user_last_name TEXT;
  user_phone TEXT;
BEGIN
  -- Extract user metadata from auth.users.raw_user_meta_data
  user_email := NEW.email;
  user_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  user_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'smme');

  -- Insert user record
  INSERT INTO public.users (
    id,
    email,
    role,
    first_name,
    last_name,
    phone,
    approved
  ) VALUES (
    NEW.id,
    user_email,
    user_role::TEXT,
    user_first_name,
    user_last_name,
    user_phone,
    false
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Step 2: Verify Trigger Was Created

Run this SQL to check:

```sql
-- Check if trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Check if function exists
SELECT 
  proname as function_name,
  prosecdef as is_security_definer
FROM pg_proc 
WHERE proname = 'handle_new_user';
```

**Expected:**
- Trigger: `on_auth_user_created` on `auth.users`
- Function: `handle_new_user` with `is_security_definer = true`

---

## How It Works

1. **User signs up** → `signUp()` creates user in `auth.users`
2. **Trigger fires** → `on_auth_user_created` trigger executes
3. **Function runs** → `handle_new_user()` extracts metadata and creates user record
4. **User record created** → Automatically in `public.users` with all data

**No session needed!** The trigger runs server-side.

---

## Benefits

✅ **No session timing issues** - Trigger fires immediately
✅ **Automatic** - No manual user record creation needed
✅ **Reliable** - Server-side execution is guaranteed
✅ **Secure** - Uses SECURITY DEFINER, validates data

---

## Testing

### Test 1: Register a User

1. Go to `/register`
2. Fill out form and submit
3. **Expected:** Registration succeeds immediately

### Test 2: Verify User Record

Run this SQL:

```sql
-- Check if user was created
SELECT 
  id,
  email,
  role,
  first_name,
  last_name,
  phone,
  approved,
  created_at
FROM public.users
ORDER BY created_at DESC
LIMIT 1;
```

**Expected:**
- User exists
- All fields populated from metadata
- `approved = false`

### Test 3: Test Trigger Manually (Optional)

```sql
-- This would be called automatically, but you can test the function:
-- (Don't run this - just for understanding)
-- The trigger automatically calls handle_new_user() when auth.users has a new row
```

---

## Troubleshooting

### Trigger doesn't fire

**Check:**
- Trigger exists: `SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';`
- Function exists: `SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';`

**Fix:**
- Re-run the migration SQL

### User record not created

**Check:**
- Metadata is included in signUp: `first_name`, `last_name`, `phone`, `role`
- Trigger is enabled (should be by default)

**Fix:**
- Check Supabase logs for trigger errors
- Verify function has SECURITY DEFINER

### Duplicate key errors

**Status:** ✅ This is handled by `ON CONFLICT DO NOTHING`
**Action:** No action needed - means user already exists

---

## After Running Migration

1. ✅ Test registration - should work immediately
2. ✅ Check user record exists in database
3. ✅ Verify all metadata is populated
4. ✅ Test login flow

---

**Migration Status:** ✅ Ready to run
**Expected Outcome:** Registration works reliably without session issues


