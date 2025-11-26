-- ============================================
-- CHECK TRIGGER STATUS
-- ============================================
-- Run this to diagnose why the trigger isn't creating user records

-- 1. Check if trigger exists
SELECT 
  '1. Trigger Check' as test,
  trigger_name,
  event_manipulation,
  event_object_table,
  action_timing,
  CASE 
    WHEN trigger_name = 'on_auth_user_created' THEN '✅ Trigger exists'
    ELSE '❌ Trigger not found'
  END as status
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created'
OR event_object_table = 'users';

-- 2. Check if function exists
SELECT 
  '2. Function Check' as test,
  proname as function_name,
  prosecdef as is_security_definer,
  proargtypes,
  CASE 
    WHEN proname = 'handle_new_user' THEN '✅ Function exists'
    ELSE '❌ Function not found'
  END as status
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- 3. Check recent auth.users
SELECT 
  '3. Recent Auth Users' as test,
  id,
  email,
  raw_user_meta_data->>'first_name' as first_name,
  raw_user_meta_data->>'last_name' as last_name,
  raw_user_meta_data->>'phone' as phone,
  raw_user_meta_data->>'role' as role,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- 4. Check if any of those users exist in public.users
SELECT 
  '4. Users in public.users' as test,
  au.id as auth_id,
  au.email as auth_email,
  pu.id as public_id,
  pu.email as public_email,
  CASE 
    WHEN pu.id IS NOT NULL THEN '✅ Exists in public.users'
    ELSE '❌ Missing from public.users'
  END as status
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
ORDER BY au.created_at DESC
LIMIT 5;

-- 5. Check trigger function permissions
SELECT 
  '5. Function Permissions' as test,
  p.proname as function_name,
  r.rolname as role,
  CASE 
    WHEN has_function_privilege(r.rolname, p.oid, 'EXECUTE') THEN '✅ Can execute'
    ELSE '❌ Cannot execute'
  END as permission
FROM pg_proc p
CROSS JOIN pg_roles r
WHERE p.proname = 'handle_new_user'
AND r.rolname IN ('postgres', 'service_role', 'authenticated', 'anon')
ORDER BY r.rolname;


