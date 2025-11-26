-- ============================================
-- ADMIN WORKFLOW TEST SUITE
-- ============================================
-- Run this in Supabase SQL Editor to verify admin functionality
-- Tests admin policies, user management, and approval workflow

-- ============================================
-- 1. VERIFY ADMIN USER EXISTS
-- ============================================
SELECT 
  '1. Admin User Check' as test_name,
  id,
  email,
  role,
  approved,
  CASE 
    WHEN role = 'admin' AND approved = true THEN '✅ Valid admin user'
    WHEN role = 'admin' AND approved = false THEN '⚠️ Admin user not approved'
    ELSE '❌ Not an admin user'
  END as status
FROM public.users
WHERE role = 'admin'
ORDER BY created_at ASC
LIMIT 5;

-- ============================================
-- 2. VERIFY ADMIN RLS POLICIES
-- ============================================
SELECT 
  '2. Admin RLS Policies' as test_name,
  policyname,
  cmd as operation,
  CASE 
    WHEN policyname LIKE '%admin%' THEN '✅ Admin policy'
    ELSE '⚠️ Regular policy'
  END as policy_type
FROM pg_policies 
WHERE tablename = 'users' 
AND schemaname = 'public'
AND policyname LIKE '%admin%'
ORDER BY cmd, policyname;

-- Count admin policies
SELECT 
  '2b. Admin Policy Count' as test_name,
  COUNT(*) as admin_policy_count,
  CASE 
    WHEN COUNT(*) >= 2 THEN '✅ Sufficient admin policies'
    ELSE '❌ Missing admin policies'
  END as status
FROM pg_policies 
WHERE tablename = 'users' 
AND schemaname = 'public'
AND policyname LIKE '%admin%';

-- ============================================
-- 3. VERIFY IS_ADMIN FUNCTION
-- ============================================
SELECT 
  '3. is_admin Function Check' as test_name,
  proname as function_name,
  prosecdef as is_security_definer,
  pg_get_function_arguments(oid) as arguments,
  CASE 
    WHEN prosecdef THEN '✅ Security Definer (correct)'
    ELSE '❌ NOT Security Definer'
  END as security_check
FROM pg_proc 
WHERE proname = 'is_admin'
AND pronamespace = 'public'::regnamespace;

-- Test function with admin user (replace UUID with your admin user ID)
-- SELECT 
--   '3b. Function Test' as test_name,
--   public.is_admin('YOUR-ADMIN-UUID-HERE'::uuid) as is_admin_result,
--   CASE 
--     WHEN public.is_admin('YOUR-ADMIN-UUID-HERE'::uuid) = true THEN '✅ Function works'
--     ELSE '❌ Function failed'
--   END as status;

-- ============================================
-- 4. CHECK USER APPROVAL STATUSES
-- ============================================
SELECT 
  '4. User Approval Statuses' as test_name,
  approved,
  COUNT(*) as user_count,
  CASE 
    WHEN approved = true THEN '✅ Approved users'
    WHEN approved = false THEN '⏳ Pending approval'
  END as status
FROM public.users
GROUP BY approved
ORDER BY approved DESC;

-- ============================================
-- 5. VERIFY ADMIN CAN VIEW ALL USERS
-- ============================================
-- This tests the policy logic (run as admin user in Supabase)
SELECT 
  '5. Users Visible to Admin' as test_name,
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE approved = true) as approved_count,
  COUNT(*) FILTER (WHERE approved = false) as pending_count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Users found (if you see this as admin, policy works)'
    ELSE '⚠️ No users or policy issue'
  END as status
FROM public.users;

-- ============================================
-- 6. TEST APPROVAL WORKFLOW DATA
-- ============================================
-- Check recent user activity
SELECT 
  '6. Recent User Activity' as test_name,
  id,
  email,
  role,
  approved,
  created_at,
  last_login,
  CASE 
    WHEN approved = false AND last_login IS NULL THEN '⏳ Pending - Never logged in'
    WHEN approved = false AND last_login IS NOT NULL THEN '⏳ Pending - Has logged in'
    WHEN approved = true AND last_login IS NULL THEN '✅ Approved - Never logged in'
    WHEN approved = true AND last_login IS NOT NULL THEN '✅ Approved - Active user'
  END as status
FROM public.users
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- 7. VERIFY ADMIN UPDATE POLICY
-- ============================================
-- Check if policy allows updating approval status
SELECT 
  '7. Admin Update Policy' as test_name,
  policyname,
  cmd as operation,
  CASE 
    WHEN policyname LIKE '%admin%' AND cmd = 'UPDATE' THEN '✅ Admin can update users'
    ELSE '⚠️ Check policy'
  END as status
FROM pg_policies 
WHERE tablename = 'users' 
AND schemaname = 'public'
AND policyname LIKE '%admin%'
AND cmd = 'UPDATE';

-- ============================================
-- 8. TEST DATA FOR APPROVAL SIMULATION
-- ============================================
-- Create test scenarios summary
SELECT 
  '8. Test Scenarios Summary' as test_name,
  'Pending Users for Approval Test' as scenario,
  COUNT(*) as count,
  'Use these users to test admin approval' as instruction
FROM public.users
WHERE approved = false
UNION ALL
SELECT 
  '8. Test Scenarios Summary' as test_name,
  'Approved Users for Verification' as scenario,
  COUNT(*) as count,
  'These users should have dashboard access' as instruction
FROM public.users
WHERE approved = true;

-- ============================================
-- 9. CHECK FOR USERS READY FOR APPROVAL
-- ============================================
SELECT 
  '9. Users Ready for Approval' as test_name,
  id,
  email,
  first_name || ' ' || last_name as full_name,
  role,
  created_at::date as registered_date,
  CASE 
    WHEN last_login IS NULL THEN 'Never logged in'
    ELSE 'Has logged in (pending approval)'
  END as login_status
FROM public.users
WHERE approved = false
ORDER BY created_at DESC;

-- ============================================
-- 10. VERIFY ADMIN ACCESS PATTERNS
-- ============================================
SELECT 
  '10. Admin Access Verification' as test_name,
  'Admin users count' as check_type,
  COUNT(*) as admin_count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Admin users exist'
    ELSE '❌ No admin users found'
  END as status
FROM public.users
WHERE role = 'admin'
UNION ALL
SELECT 
  '10. Admin Access Verification' as test_name,
  'Approved admin users' as check_type,
  COUNT(*) as approved_admin_count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Approved admins exist'
    ELSE '❌ No approved admins'
  END as status
FROM public.users
WHERE role = 'admin' AND approved = true;

-- ============================================
-- 11. FINAL ADMIN WORKFLOW CHECK
-- ============================================
SELECT 
  '=== FINAL ADMIN WORKFLOW VERIFICATION ===' as test_name,
  (SELECT COUNT(*) FROM public.users WHERE role = 'admin' AND approved = true) as approved_admins,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users' AND policyname LIKE '%admin%') as admin_policies,
  (SELECT CASE WHEN EXISTS (SELECT FROM pg_proc WHERE proname = 'is_admin') THEN 1 ELSE 0 END) as function_exists,
  (SELECT COUNT(*) FROM public.users WHERE approved = false) as pending_users,
  CASE 
    WHEN 
      (SELECT COUNT(*) FROM public.users WHERE role = 'admin' AND approved = true) > 0
      AND (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users' AND policyname LIKE '%admin%') >= 2
      AND (SELECT CASE WHEN EXISTS (SELECT FROM pg_proc WHERE proname = 'is_admin') THEN 1 ELSE 0 END) = 1
    THEN '✅✅✅ ADMIN WORKFLOW READY - All checks passed!'
    ELSE '⚠️⚠️⚠️ SOME CHECKS FAILED - Review results above'
  END as final_status;


