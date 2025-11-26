-- ============================================
-- FIX TRIGGER ISSUE - Run This First
-- ============================================
-- This fixes the trigger to properly handle RLS and errors

-- Step 1: Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Recreate function with better error handling
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
  -- Extract user metadata
  user_email := COALESCE(NEW.email, '');
  user_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', 'User');
  user_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '+27123456789');
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'smme');

  -- Validate and set defaults for NOT NULL fields
  IF user_role NOT IN ('smme', 'admin') THEN
    user_role := 'smme';
  END IF;
  
  IF user_first_name IS NULL OR user_first_name = '' THEN
    user_first_name := 'User';
  END IF;
  
  IF user_last_name IS NULL OR user_last_name = '' THEN
    user_last_name := '';
  END IF;
  
  IF user_phone IS NULL OR user_phone = '' THEN
    user_phone := '+27123456789';
  END IF;

  -- Insert with SECURITY DEFINER (bypasses RLS)
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
EXCEPTION
  WHEN OTHERS THEN
    -- Log error for debugging but don't fail the trigger
    RAISE WARNING 'handle_new_user error for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Step 3: Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 4: Grant permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Step 5: Verify
SELECT 
  'Trigger Status' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.triggers 
      WHERE trigger_name = 'on_auth_user_created'
    )
    THEN '✅ Trigger created'
    ELSE '❌ Trigger missing'
  END as trigger_status,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc 
      WHERE proname = 'handle_new_user'
    )
    THEN '✅ Function created'
    ELSE '❌ Function missing'
  END as function_status;


