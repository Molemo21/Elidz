-- Verify function permissions are granted correctly
-- Run this in Supabase SQL Editor

-- 1. Check if execute permissions are granted
SELECT 
  p.proname as function_name,
  r.rolname as granted_to_role,
  CASE 
    WHEN has_function_privilege(r.oid, p.oid, 'EXECUTE') THEN 'YES'
    ELSE 'NO'
  END as can_execute
FROM pg_proc p
CROSS JOIN pg_roles r
WHERE p.proname = 'is_admin'
AND r.rolname IN ('authenticated', 'anon', 'service_role', 'postgres')
ORDER BY r.rolname;

-- 2. Test the function directly with your user ID
-- Replace with your actual user ID from auth.users
SELECT 
  '3d0e58f8-8901-4326-b5df-527b661abc36'::uuid as user_id,
  public.is_admin('3d0e58f8-8901-4326-b5df-527b661abc36'::uuid) as is_admin_result;

-- 3. Check current authenticated user context
SELECT 
  auth.uid() as current_user_id,
  auth.role() as current_role;

-- 4. Verify policies are correct
SELECT 
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;

