-- ============================================
-- VERIFY MIGRATION 007: User Record Creation Fix
-- ============================================
-- Run this after running migration 007 to verify everything works

-- ============================================
-- 1. CHECK FUNCTIONS EXIST
-- ============================================
SELECT 
  '1. Function Check' as test_name,
  proname as function_name,
  prosecdef as is_security_definer,
  CASE 
    WHEN prosecdef THEN '✅ Security Definer (correct)'
    ELSE '❌ NOT Security Definer'
  END as security_check
FROM pg_proc 
WHERE proname IN ('create_user_record_system', 'handle_new_user')
ORDER BY proname;

-- ============================================
-- 2. CHECK TRIGGER EXISTS
-- ============================================
SELECT 
  '2. Trigger Check' as test_name,
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation,
  CASE 
    WHEN trigger_name = 'on_auth_user_created' THEN '✅ Trigger exists'
    ELSE '❌ Trigger missing'
  END as status
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- ============================================
-- 3. CHECK USER RECORD SYNC
-- ============================================
SELECT 
  '3. User Record Sync' as test_name,
  (SELECT COUNT(*) FROM auth.users) as auth_users_count,
  (SELECT COUNT(*) FROM public.users) as public_users_count,
  (SELECT COUNT(*) FROM auth.users) - (SELECT COUNT(*) FROM public.users) as missing_count,
  CASE 
    WHEN (SELECT COUNT(*) FROM auth.users) = (SELECT COUNT(*) FROM public.users)
    THEN '✅ All users have records'
    WHEN (SELECT COUNT(*) FROM auth.users) > (SELECT COUNT(*) FROM public.users)
    THEN '⚠️ ' || ((SELECT COUNT(*) FROM auth.users) - (SELECT COUNT(*) FROM public.users))::TEXT || ' users missing records'
    ELSE '✅ All records synced'
  END as status;

-- ============================================
-- 4. LIST MISSING USER RECORDS (if any)
-- ============================================
SELECT 
  '4. Missing Records Detail' as test_name,
  au.id,
  au.email,
  au.raw_user_meta_data->>'first_name' as first_name,
  au.raw_user_meta_data->>'last_name' as last_name,
  au.created_at,
  CASE 
    WHEN pu.id IS NULL THEN '❌ Missing in public.users'
    ELSE '✅ Exists'
  END as status
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
WHERE pu.id IS NULL
ORDER BY au.created_at DESC;

-- ============================================
-- 5. CHECK FUNCTION PERMISSIONS
-- ============================================
SELECT 
  '5. Function Permissions' as test_name,
  p.proname as function_name,
  r.rolname as role,
  CASE 
    WHEN has_function_privilege(r.rolname, p.oid, 'EXECUTE') THEN '✅ Can execute'
    ELSE '❌ Cannot execute'
  END as permission
FROM pg_proc p
CROSS JOIN pg_roles r
WHERE p.proname = 'create_user_record_system'
AND r.rolname IN ('postgres', 'service_role', 'authenticated', 'anon')
ORDER BY r.rolname;

-- ============================================
-- 6. FINAL VERIFICATION
-- ============================================
SELECT 
  '=== FINAL VERIFICATION ===' as test_name,
  (SELECT CASE WHEN EXISTS (SELECT FROM pg_proc WHERE proname = 'create_user_record_system') THEN 1 ELSE 0 END) as system_function_exists,
  (SELECT CASE WHEN EXISTS (SELECT FROM pg_proc WHERE proname = 'handle_new_user') THEN 1 ELSE 0 END) as trigger_function_exists,
  (SELECT CASE WHEN EXISTS (SELECT FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') THEN 1 ELSE 0 END) as trigger_exists,
  (SELECT CASE WHEN (SELECT COUNT(*) FROM auth.users) = (SELECT COUNT(*) FROM public.users) THEN 1 ELSE 0 END) as all_users_synced,
  CASE 
    WHEN 
      (SELECT CASE WHEN EXISTS (SELECT FROM pg_proc WHERE proname = 'create_user_record_system') THEN 1 ELSE 0 END) = 1
      AND (SELECT CASE WHEN EXISTS (SELECT FROM pg_proc WHERE proname = 'handle_new_user') THEN 1 ELSE 0 END) = 1
      AND (SELECT CASE WHEN EXISTS (SELECT FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') THEN 1 ELSE 0 END) = 1
      AND (SELECT CASE WHEN (SELECT COUNT(*) FROM auth.users) = (SELECT COUNT(*) FROM public.users) THEN 1 ELSE 0 END) = 1
    THEN '✅✅✅ MIGRATION 007 SUCCESSFUL - All checks passed!'
    ELSE '⚠️⚠️⚠️ SOME CHECKS FAILED - Review results above'
  END as final_status;


