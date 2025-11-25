-- Test and verify RLS fix is working correctly
-- Run this in Supabase SQL Editor

-- 1. Verify function exists and has correct permissions
SELECT 
  proname,
  prosecdef as is_security_definer,
  proowner::regrole as owner
FROM pg_proc 
WHERE proname = 'is_admin';

-- 2. Check function permissions
SELECT 
  p.proname,
  pg_get_function_identity_arguments(p.oid) as args,
  r.rolname as granted_to
FROM pg_proc p
JOIN pg_proc_acl pa ON p.oid = pa.oid
JOIN pg_roles r ON pa.grantee = r.oid
WHERE p.proname = 'is_admin';

-- 3. Verify policies are using the function (not recursive queries)
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as operation,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'users' 
AND policyname LIKE '%admin%'
ORDER BY policyname;

-- 4. Test the function directly (replace with your user ID)
-- SELECT public.is_admin('3d0e58f8-8901-4326-b5df-527b661abc36'::uuid);

-- 5. Check if there are any other policies that might cause recursion
SELECT 
  tablename,
  policyname,
  qual
FROM pg_policies 
WHERE qual LIKE '%EXISTS%users%' 
AND tablename = 'users';

