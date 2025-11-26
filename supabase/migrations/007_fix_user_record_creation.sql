-- ============================================
-- MIGRATION 007: Fix User Record Creation
-- ============================================
-- This migration fixes user record creation by:
-- 1. Creating a system function that doesn't require auth check
-- 2. Fixing the trigger to use the system function
-- 3. Creating missing user records for existing auth users
-- ============================================

-- ============================================
-- STEP 1: Create System Function (No Auth Check Required)
-- ============================================
-- This function can be called by triggers or RPC without requiring auth.uid()
-- It uses SECURITY DEFINER to bypass RLS

CREATE OR REPLACE FUNCTION public.create_user_record_system(
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
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Validate required fields
  IF user_id IS NULL OR user_email IS NULL OR user_email = '' THEN
    RAISE EXCEPTION 'Invalid user_id or email provided';
  END IF;

  -- Set safe defaults for NOT NULL fields
  IF user_first_name IS NULL OR user_first_name = '' THEN
    user_first_name := 'User';
  END IF;
  
  IF user_last_name IS NULL THEN
    user_last_name := '';
  END IF;
  
  IF user_phone IS NULL OR user_phone = '' THEN
    user_phone := '+27123456789';
  END IF;
  
  -- Validate and default role
  IF user_role IS NULL OR user_role NOT IN ('smme', 'admin') THEN
    user_role := 'smme';
  END IF;

  -- Insert user record (SECURITY DEFINER bypasses RLS)
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
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'create_user_record_system failed for user %: %', user_id, SQLERRM;
    RAISE;
END;
$$;

-- Grant execute permissions to service_role and postgres
GRANT EXECUTE ON FUNCTION public.create_user_record_system(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.create_user_record_system(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) TO postgres;
GRANT EXECUTE ON FUNCTION public.create_user_record_system(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_record_system(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon;

-- Add comment
COMMENT ON FUNCTION public.create_user_record_system IS 'System function to create user records. Bypasses RLS using SECURITY DEFINER. Can be called by triggers or RPC.';

-- ============================================
-- STEP 2: Update Trigger Function to Use System Function
-- ============================================
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
  -- Extract metadata from auth.users.raw_user_meta_data
  user_email := COALESCE(NEW.email, '');
  user_first_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'first_name', ''), 'User');
  user_last_name := COALESCE(NULLIF(NEW.raw_user_meta_data->>'last_name', ''), '');
  user_phone := COALESCE(NULLIF(NEW.raw_user_meta_data->>'phone', ''), '+27123456789');
  user_role := COALESCE(NULLIF(NEW.raw_user_meta_data->>'role', ''), 'smme');

  -- Validate role
  IF user_role NOT IN ('smme', 'admin') THEN
    user_role := 'smme';
  END IF;

  -- Call system function to create user record
  -- This bypasses RLS and works reliably
  PERFORM public.create_user_record_system(
    NEW.id,
    user_email,
    user_role,
    user_first_name,
    user_last_name,
    user_phone
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the trigger (allows auth user creation to succeed)
    RAISE WARNING 'handle_new_user trigger failed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- ============================================
-- STEP 3: Ensure Trigger Exists and is Enabled
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STEP 4: Create Missing User Records for Existing Auth Users
-- ============================================
-- This creates user records for any auth.users that don't have public.users records
-- Useful for fixing existing accounts

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
    CASE 
      WHEN au.raw_user_meta_data->>'role' IN ('smme', 'admin') 
      THEN au.raw_user_meta_data->>'role' 
      ELSE 'smme' 
    END,
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

-- ============================================
-- STEP 5: Verification Query (run separately to check)
-- ============================================
-- Uncomment to verify after migration:
-- SELECT 
--   'Verification' as check_type,
--   (SELECT COUNT(*) FROM auth.users) as auth_users_count,
--   (SELECT COUNT(*) FROM public.users) as public_users_count,
--   CASE 
--     WHEN (SELECT COUNT(*) FROM auth.users) = (SELECT COUNT(*) FROM public.users)
--     THEN '✅ All users have records'
--     ELSE '⚠️ ' || ((SELECT COUNT(*) FROM auth.users) - (SELECT COUNT(*) FROM public.users))::TEXT || ' users missing'
--   END as status;


