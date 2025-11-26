-- Migration: Help existing Supabase Auth users migrate to JWT
-- This identifies users without password_hash and provides a way to set passwords
-- 
-- IMPORTANT: This does NOT migrate passwords (they're in Supabase Auth and can't be retrieved)
-- Users will need to use "Forgot Password" to set a new password

-- ============================================
-- STEP 1: Identify users without password_hash
-- ============================================
-- This query shows all users that need to set a password

-- View to identify users needing password migration
CREATE OR REPLACE VIEW public.users_needing_password_migration AS
SELECT 
  id,
  email,
  role,
  first_name,
  last_name,
  approved,
  created_at,
  CASE 
    WHEN password_hash IS NULL THEN true
    ELSE false
  END as needs_password_set
FROM public.users
WHERE password_hash IS NULL;

COMMENT ON VIEW public.users_needing_password_migration IS 'Users created with Supabase Auth that need to set a password for JWT authentication';

-- ============================================
-- STEP 2: Function to check if user needs password
-- ============================================
CREATE OR REPLACE FUNCTION public.user_needs_password_set(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  has_password BOOLEAN;
BEGIN
  SELECT password_hash IS NOT NULL INTO has_password
  FROM public.users
  WHERE email = user_email;
  
  RETURN NOT has_password;
END;
$$;

COMMENT ON FUNCTION public.user_needs_password_set IS 'Checks if a user needs to set a password. Returns true if password_hash is NULL.';

-- ============================================
-- STEP 3: Grant permissions
-- ============================================
GRANT SELECT ON public.users_needing_password_migration TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.user_needs_password_set(TEXT) TO authenticated, anon, service_role;

-- ============================================
-- STEP 4: Query to see migration status
-- ============================================
-- Run this to see how many users need passwords:
-- SELECT COUNT(*) FROM public.users_needing_password_migration;

-- Run this to see all users needing passwords:
-- SELECT * FROM public.users_needing_password_migration ORDER BY created_at DESC;

