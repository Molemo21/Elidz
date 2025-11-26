-- ============================================
-- Test Admin User Access and RLS Policies
-- ============================================
-- Run this in Supabase SQL Editor to diagnose admin access issues
-- Replace YOUR_ADMIN_USER_ID_HERE with your actual admin user ID

-- ============================================
-- STEP 1: Check Admin User Exists
-- ============================================
-- Verify your admin user exists and has correct role
SELECT 
  id,
  email,
  role,
  approved,
  created_at,
  CASE 
    WHEN role = 'admin' THEN '✅ Is Admin'
    ELSE '❌ Not Admin'
  END as admin_status
FROM public.users
WHERE role = 'admin'
ORDER BY created_at DESC;

-- ============================================
-- STEP 2: Check is_admin() Function
-- ============================================
-- Verify the function exists and works
SELECT 
  proname as function_name,
  prosecdef as is_security_definer,
  proowner::regrole as owner
FROM pg_proc 
WHERE proname = 'is_admin';

-- Test the function with your admin user ID (replace UUID)
-- SELECT public.is_admin('3d0e58f8-8901-4326-b5df-527b661abc36'::uuid) as is_admin_result;

-- ============================================
-- STEP 3: Check RLS Policies on Users Table
-- ============================================
-- Verify all policies exist and use the is_admin() function
SELECT 
  policyname,
  cmd as operation,
  CASE 
    WHEN qual LIKE '%is_admin%' THEN '✅ Uses is_admin() function'
    WHEN qual LIKE '%EXISTS%users%' THEN '❌ RECURSIVE (problematic!)'
    ELSE '⚠️ Other'
  END as policy_type,
  qual as using_clause
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;

-- ============================================
-- STEP 4: Check for Recursive Policies (Bad!)
-- ============================================
-- If this returns any rows, those policies are recursive and will cause issues
SELECT 
  tablename,
  policyname,
  qual,
  '❌ RECURSIVE POLICY - NEEDS FIX' as status
FROM pg_policies
WHERE tablename = 'users'
AND qual LIKE '%EXISTS%users%'
AND qual NOT LIKE '%is_admin%';

-- ============================================
-- STEP 5: Verify RLS is Enabled
-- ============================================
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity THEN '✅ RLS Enabled'
    ELSE '❌ RLS Disabled'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'users';

-- ============================================
-- STEP 6: Count Users in Table
-- ============================================
-- This should work if RLS policies are correct
-- Run this as your admin user (via your application, not SQL Editor)
SELECT 
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE role = 'admin') as admin_users,
  COUNT(*) FILTER (WHERE approved = true) as approved_users,
  COUNT(*) FILTER (WHERE approved = false) as pending_users
FROM public.users;

-- ============================================
-- STEP 7: Test Function Permissions
-- ============================================
-- Check if the is_admin function has proper permissions
SELECT 
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments,
  CASE 
    WHEN p.prosecdef THEN '✅ SECURITY DEFINER'
    ELSE '❌ Not SECURITY DEFINER'
  END as security_definer_status
FROM pg_proc p
WHERE p.proname = 'is_admin';

-- ============================================
-- STEP 8: Diagnostic Summary
-- ============================================
-- Run this to get a quick overview
SELECT 
  'Admin Users' as check_type,
  COUNT(*)::text as result,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Found'
    ELSE '❌ No Admin Users'
  END as status
FROM public.users
WHERE role = 'admin'
UNION ALL
SELECT 
  'is_admin() Function' as check_type,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Exists'
    ELSE '❌ Missing'
  END as result,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Found'
    ELSE '❌ Missing'
  END as status
FROM pg_proc
WHERE proname = 'is_admin'
UNION ALL
SELECT 
  'Admin RLS Policies' as check_type,
  COUNT(*)::text as result,
  CASE 
    WHEN COUNT(*) >= 2 THEN '✅ Found'
    ELSE '❌ Missing Policies'
  END as status
FROM pg_policies
WHERE tablename = 'users'
AND policyname LIKE '%admin%'
UNION ALL
SELECT 
  'Recursive Policies' as check_type,
  COUNT(*)::text as result,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ None Found'
    ELSE '❌ Found Recursive Policies'
  END as status
FROM pg_policies
WHERE tablename = 'users'
AND qual LIKE '%EXISTS%users%'
AND qual NOT LIKE '%is_admin%';


