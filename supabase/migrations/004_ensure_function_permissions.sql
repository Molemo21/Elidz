-- Ensure is_admin function has correct permissions and configuration
-- This fixes potential issues with function execution in RLS policies

-- Recreate the function with explicit permissions
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- Grant execute permissions to all roles that need it
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO service_role;

-- Verify the function is security definer
-- Run this to check: SELECT prosecdef FROM pg_proc WHERE proname = 'is_admin';
-- Should return true

