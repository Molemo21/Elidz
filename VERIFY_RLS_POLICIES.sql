-- Verify RLS policies are correct and not causing recursion
-- Run this in Supabase SQL Editor

-- 1. Check all policies on users table
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as operation,
  qual as using_expression,
  with_check
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;

-- 2. Verify the is_admin function is being used (not recursive queries)
-- The qual column should contain "is_admin" not "EXISTS (SELECT 1 FROM public.users"
SELECT 
  policyname,
  qual
FROM pg_policies 
WHERE tablename = 'users' 
AND policyname LIKE '%admin%'
AND qual LIKE '%EXISTS%users%';

-- If the above query returns any rows, those policies are still recursive!

-- 3. Check if there are any other problematic policies
SELECT 
  tablename,
  policyname,
  qual
FROM pg_policies 
WHERE tablename = 'users'
AND qual LIKE '%EXISTS%users%';

-- 4. Test the function directly (should work)
SELECT public.is_admin('3d0e58f8-8901-4326-b5df-527b661abc36'::uuid);

