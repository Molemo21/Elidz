-- ============================================
-- AUTO-CREATE USER RECORD TRIGGER
-- ============================================
-- This trigger automatically creates a user record in public.users
-- when a new user is created in auth.users
-- This solves the session timing issue during registration

-- Function to handle new user creation
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
  -- Extract user metadata from auth.users.raw_user_meta_data
  user_email := COALESCE(NEW.email, '');
  user_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', 'User');
  user_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '+27123456789');
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'smme');

  -- Validate role
  IF user_role NOT IN ('smme', 'admin') THEN
    user_role := 'smme';
  END IF;

  -- Ensure required fields have values (NOT NULL constraint)
  IF user_first_name IS NULL OR user_first_name = '' THEN
    user_first_name := 'User';
  END IF;
  
  IF user_last_name IS NULL OR user_last_name = '' THEN
    user_last_name := '';
  END IF;
  
  IF user_phone IS NULL OR user_phone = '' THEN
    user_phone := '+27123456789';
  END IF;

  -- Insert user record with RLS bypassed (SECURITY DEFINER)
  -- ON CONFLICT handles case where record already exists
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
    -- Log error but don't fail the trigger
    -- This prevents registration from failing if there's an issue
    RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger on auth.users
-- This fires AFTER a new user is inserted into auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add comment
COMMENT ON FUNCTION public.handle_new_user IS 'Automatically creates a user record in public.users when a new auth user is created. This ensures user records are created immediately upon registration.';

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

