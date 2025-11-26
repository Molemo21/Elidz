-- Create a database function to safely insert user records during registration
-- This function runs with SECURITY DEFINER to bypass RLS, but validates that
-- the user_id matches the authenticated user

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
  -- This ensures users can only create their own record
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_user_record(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_record(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon;

-- Add a comment
COMMENT ON FUNCTION public.create_user_record IS 'Safely creates a user record during registration. Can only create record for the authenticated user.';


