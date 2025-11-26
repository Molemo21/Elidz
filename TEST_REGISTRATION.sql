-- ============================================
-- COMPREHENSIVE REGISTRATION FLOW TEST SUITE
-- ============================================
-- Run this in Supabase SQL Editor to verify registration functionality
-- This tests database schema, functions, and RLS policies

-- ============================================
-- 1. VERIFY DATABASE FUNCTION EXISTS
-- ============================================
SELECT 
  '1. Database Function Check' as test_name,
  CASE 
    WHEN EXISTS (
      SELECT FROM pg_proc 
      WHERE proname = 'create_user_record' 
      AND pronamespace = 'public'::regnamespace
    )
    THEN '✅ PASS - create_user_record function exists'
    ELSE '❌ FAIL - Function missing. Run migration 005.'
  END as result;

-- Check function details
SELECT 
  '1b. Function Details' as test_name,
  proname as function_name,
  prosecdef as is_security_definer,
  pg_get_function_arguments(oid) as arguments,
  CASE 
    WHEN prosecdef THEN '✅ Security Definer (correct)'
    ELSE '❌ NOT Security Definer'
  END as security_check
FROM pg_proc 
WHERE proname = 'create_user_record'
AND pronamespace = 'public'::regnamespace;

-- ============================================
-- 2. VERIFY INSERT POLICY EXISTS
-- ============================================
SELECT 
  '2. INSERT Policy Check' as test_name,
  CASE 
    WHEN EXISTS (
      SELECT FROM pg_policy pol
      JOIN pg_class c ON c.oid = pol.polrelid
      WHERE c.relname = 'users'
      AND pol.polname = 'Users can insert own record'
      AND pol.polcmd = 'INSERT'
    )
    THEN '✅ PASS - INSERT policy exists'
    ELSE '❌ FAIL - INSERT policy missing'
  END as result;

-- ============================================
-- 3. CHECK RECENT REGISTRATIONS
-- ============================================
SELECT 
  '3. Recent Registrations' as test_name,
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE approved = false) as pending_users,
  COUNT(*) FILTER (WHERE approved = true) as approved_users,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Users found'
    ELSE '⚠️ No users yet (test registration)'
  END as status
FROM public.users;

-- Show recent users
SELECT 
  '3b. Recent Users List' as test_name,
  id,
  email,
  role,
  first_name,
  last_name,
  approved,
  created_at::date as registration_date
FROM public.users
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- 4. VERIFY USER-RELATED AUTH USERS
-- ============================================
-- Check if users in auth.users match public.users
SELECT 
  '4. Auth Users Sync Check' as test_name,
  (SELECT COUNT(*) FROM auth.users) as auth_users_count,
  (SELECT COUNT(*) FROM public.users) as public_users_count,
  CASE 
    WHEN (SELECT COUNT(*) FROM auth.users) >= (SELECT COUNT(*) FROM public.users)
    THEN '✅ Auth users count is valid'
    ELSE '⚠️ Mismatch - some public.users may not have auth.users'
  END as status;

-- ============================================
-- 5. TEST FUNCTION PERMISSIONS
-- ============================================
SELECT 
  '5. Function Permissions' as test_name,
  CASE 
    WHEN has_function_privilege('authenticated', 'public.create_user_record(uuid, text, text, text, text, text)', 'EXECUTE')
    THEN '✅ authenticated role can execute'
    ELSE '❌ authenticated role CANNOT execute'
  END as authenticated_permission,
  CASE 
    WHEN has_function_privilege('anon', 'public.create_user_record(uuid, text, text, text, text, text)', 'EXECUTE')
    THEN '✅ anon role can execute'
    ELSE '❌ anon role CANNOT execute'
  END as anon_permission;

-- ============================================
-- 6. VERIFY RLS POLICIES SUMMARY
-- ============================================
SELECT 
  '6. RLS Policies Summary' as test_name,
  cmd as operation,
  COUNT(*) as policy_count,
  string_agg(policyname, ', ') as policy_names
FROM pg_policies 
WHERE tablename = 'users' 
AND schemaname = 'public'
GROUP BY cmd
ORDER BY 
  CASE cmd
    WHEN 'INSERT' THEN 1
    WHEN 'SELECT' THEN 2
    WHEN 'UPDATE' THEN 3
    ELSE 4
  END;

-- ============================================
-- 7. CHECK FOR ORPHANED AUTH USERS
-- ============================================
-- Users in auth.users but not in public.users
SELECT 
  '7. Orphaned Auth Users Check' as test_name,
  COUNT(*) as orphaned_count,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ No orphaned users'
    WHEN COUNT(*) > 0 THEN '⚠️ Found ' || COUNT(*) || ' orphaned auth users (not in public.users)'
    ELSE '✅ Check passed'
  END as status
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = au.id
);

-- ============================================
-- 8. CHECK FOR MISSING AUTH USERS
-- ============================================
-- Users in public.users but not in auth.users
SELECT 
  '8. Missing Auth Users Check' as test_name,
  COUNT(*) as missing_count,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ All users have auth records'
    WHEN COUNT(*) > 0 THEN '❌ Found ' || COUNT(*) || ' users without auth records'
    ELSE '✅ Check passed'
  END as status
FROM public.users pu
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users au WHERE au.id = pu.id
);

-- ============================================
-- 9. VERIFY TABLE STRUCTURE
-- ============================================
SELECT 
  '9. Table Structure Check' as test_name,
  column_name,
  data_type,
  is_nullable,
  column_default,
  CASE 
    WHEN column_name IN ('id', 'email', 'role', 'first_name', 'last_name', 'phone', 'approved', 'created_at', 'last_login')
    THEN '✅ Required column'
    ELSE '⚠️ Optional column'
  END as required
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- ============================================
-- 10. FINAL COMPREHENSIVE CHECK
-- ============================================
SELECT 
  '=== FINAL VERIFICATION ===' as test_name,
  (SELECT CASE WHEN EXISTS (SELECT FROM pg_proc WHERE proname = 'create_user_record') THEN 1 ELSE 0 END) as function_exists,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users' AND cmd = 'INSERT') as insert_policy_exists,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users' AND cmd = 'SELECT') as select_policies_exist,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users' AND cmd = 'UPDATE') as update_policies_exist,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users') as column_count,
  CASE 
    WHEN 
      (SELECT CASE WHEN EXISTS (SELECT FROM pg_proc WHERE proname = 'create_user_record') THEN 1 ELSE 0 END) = 1
      AND (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users' AND cmd = 'INSERT') > 0
      AND (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users' AND cmd = 'SELECT') >= 2
      AND (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users' AND cmd = 'UPDATE') >= 2
      AND (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users') = 9
    THEN '✅✅✅ ALL CHECKS PASSED - Registration system is ready!'
    ELSE '⚠️⚠️⚠️ SOME CHECKS FAILED - Review results above'
  END as final_status;


