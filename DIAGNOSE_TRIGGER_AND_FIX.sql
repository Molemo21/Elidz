-- ============================================
-- DIAGNOSE TRIGGER ISSUE AND FIX
-- ============================================
-- Run this to check what's wrong and fix it

-- Step 1: Check if trigger exists
SELECT 
  '=== STEP 1: CHECK TRIGGER ===' as step,
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Step 2: Check if function exists
SELECT 
  '=== STEP 2: CHECK FUNCTION ===' as step,
  proname as function_name,
  prosecdef as is_security_definer,
  pg_get_functiondef(oid) as function_definition
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- Step 3: Check recent auth users vs public users
SELECT 
  '=== STEP 3: CHECK RECENT USERS ===' as step,
  au.id as auth_id,
  au.email as auth_email,
  au.raw_user_meta_data,
  pu.id as public_id,
  CASE 
    WHEN pu.id IS NULL THEN '❌ MISSING in public.users'
    ELSE '✅ EXISTS in public.users'
  END as status
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
ORDER BY au.created_at DESC
LIMIT 10;

-- Step 4: FIX - Recreate trigger and function properly
-- Drop existing
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  user_email TEXT;
  user_role TEXT := 'smme';
  user_first_name TEXT;
  user_last_name TEXT;
  user_phone TEXT;
BEGIN
  -- Extract metadata with safe defaults
  user_email := COALESCE(NEW.email, '');
  user_first_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'first_name', ''), 'User');
  user_last_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'last_name', ''), '');
  user_phone := COALESCE(NULLIF(NEW.raw_user_meta_data->>'phone', ''), '+27123456789');
  user_role := COALESCE(NULLIF(NEW.raw_user_meta_data->>'role', ''), 'smme');

  -- Validate role
  IF user_role NOT IN ('smme', 'admin') THEN
    user_role := 'smme';
  END IF;

  -- Insert user record (SECURITY DEFINER bypasses RLS)
  INSERT INTO public.users (
    id, email, role, first_name, last_name, phone, approved
  ) VALUES (
    NEW.id, user_email, user_role, user_first_name, user_last_name, user_phone, false
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error for debugging
    RAISE WARNING 'handle_new_user failed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Verify trigger was created
SELECT 
  '=== STEP 5: VERIFICATION ===' as step,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.triggers 
      WHERE trigger_name = 'on_auth_user_created'
    )
    THEN '✅ Trigger exists'
    ELSE '❌ Trigger missing'
  END as trigger_status,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc 
      WHERE proname = 'handle_new_user'
    )
    THEN '✅ Function exists'
    ELSE '❌ Function missing'
  END as function_status;

-- Step 6: For existing auth users without public.users records, create them manually
INSERT INTO public.users (
  id,
  email,
  role,
  first_name,
  last_name,
  phone,
  approved
)
SELECT 
  au.id,
  au.email,
  COALESCE(
    CASE WHEN au.raw_user_meta_data->>'role' IN ('smme', 'admin') 
    THEN au.raw_user_meta_data->>'role' 
    ELSE 'smme' END,
    'smme'
  )::TEXT,
  COALESCE(NULLIF(au.raw_user_meta_data->>'first_name', ''), 'User'),
  COALESCE(NULLIF(au.raw_user_meta_data->>'last_name', ''), ''),
  COALESCE(NULLIF(au.raw_user_meta_data->>'phone', ''), '+27123456789'),
  false
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- Step 7: Show how many users were created
SELECT 
  '=== STEP 7: SUMMARY ===' as step,
  (SELECT COUNT(*) FROM auth.users) as total_auth_users,
  (SELECT COUNT(*) FROM public.users) as total_public_users,
  (SELECT COUNT(*) FROM auth.users) - (SELECT COUNT(*) FROM public.users) as missing_users;


