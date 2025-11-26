-- Test Script: Verify User Profiles Implementation
-- Run this in Supabase SQL Editor to verify the implementation

-- ============================================
-- 1. Verify Table Structure Exists
-- ============================================
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- Expected: Should show all columns including:
-- - id (uuid)
-- - user_id (uuid)
-- - company_name (text)
-- - registration_number (text)
-- - industry (text)
-- - business_description (text)
-- - annual_revenue (numeric)
-- - employees_count (integer)
-- - years_in_business (integer)
-- - location (text)
-- - funding_requirements (jsonb)
-- - updated_at (timestamp)

-- ============================================
-- 2. Check RLS Policies Are Enabled
-- ============================================
SELECT 
  schemaname,
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename = 'user_profiles';

-- Expected: rowsecurity should be 't' (true)

-- ============================================
-- 3. Verify RLS Policies Exist
-- ============================================
SELECT 
  policyname as "Policy Name",
  permissive,
  roles,
  cmd as "Command",
  CASE 
    WHEN qual IS NOT NULL THEN 'Yes'
    ELSE 'No'
  END as "Has SELECT Condition",
  CASE 
    WHEN with_check IS NOT NULL THEN 'Yes'
    ELSE 'No'
  END as "Has INSERT/UPDATE Check"
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'user_profiles'
ORDER BY policyname;

-- Expected: Should show policies like:
-- - Users can view own profile
-- - Users can insert own profile
-- - Users can update own profile
-- - Admins can view all profiles

-- ============================================
-- 4. Check for Existing Profiles
-- ============================================
SELECT 
  id,
  user_id,
  company_name,
  registration_number,
  industry,
  annual_revenue,
  employees_count,
  years_in_business,
  location,
  updated_at
FROM public.user_profiles
ORDER BY updated_at DESC
LIMIT 10;

-- Expected: Should show your test profiles if any exist

-- ============================================
-- 5. Verify Indexes Exist
-- ============================================
SELECT 
  indexname as "Index Name",
  indexdef as "Index Definition"
FROM pg_indexes
WHERE schemaname = 'public' 
  AND tablename = 'user_profiles'
ORDER BY indexname;

-- Expected: Should show index on user_id

-- ============================================
-- 6. Test JSONB Structure (if you have data)
-- ============================================
SELECT 
  user_id,
  company_name,
  funding_requirements->>'amount_needed' as amount_needed,
  funding_requirements->>'funding_purpose' as funding_purpose,
  funding_requirements->>'business_stage' as business_stage,
  funding_requirements->'industry_sector' as industry_sector,
  funding_requirements->'preferred_funding_type' as preferred_funding_type
FROM public.user_profiles
WHERE funding_requirements IS NOT NULL
LIMIT 5;

-- Expected: Should show properly structured JSONB data

-- ============================================
-- 7. Check Trigger Exists for updated_at
-- ============================================
SELECT 
  trigger_name as "Trigger Name",
  event_manipulation as "Event",
  event_object_table as "Table",
  action_statement as "Action"
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table = 'user_profiles'
ORDER BY trigger_name;

-- Expected: Should show trigger for updating updated_at timestamp

-- ============================================
-- 8. Verify Unique Constraint on user_id
-- ============================================
SELECT
  conname as "Constraint Name",
  contype as "Type",
  pg_get_constraintdef(oid) as "Definition"
FROM pg_constraint
WHERE conrelid = 'public.user_profiles'::regclass
  AND contype = 'u';

-- Expected: Should show unique constraint on user_id

-- ============================================
-- 9. Check Foreign Key to users table
-- ============================================
SELECT
  conname as "Constraint Name",
  conrelid::regclass as "Table",
  confrelid::regclass as "References Table",
  pg_get_constraintdef(oid) as "Definition"
FROM pg_constraint
WHERE conrelid = 'public.user_profiles'::regclass
  AND contype = 'f';

-- Expected: Should show foreign key constraint to users table

-- ============================================
-- 10. Test Query: Count Profiles by Industry
-- ============================================
SELECT 
  industry,
  COUNT(*) as profile_count
FROM public.user_profiles
WHERE industry IS NOT NULL
GROUP BY industry
ORDER BY profile_count DESC;

-- Expected: Should show distribution of profiles by industry

-- ============================================
-- 11. Test Query: Profiles with Funding Requirements
-- ============================================
SELECT 
  COUNT(*) as total_profiles,
  COUNT(funding_requirements) as profiles_with_funding,
  COUNT(*) - COUNT(funding_requirements) as profiles_without_funding
FROM public.user_profiles;

-- Expected: Should show count of profiles with and without funding requirements

-- ============================================
-- Summary Check
-- ============================================
SELECT 
  'Table exists' as check_item,
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'user_profiles'
  ) THEN '✓' ELSE '✗' END as status
UNION ALL
SELECT 
  'RLS enabled',
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
      AND tablename = 'user_profiles' 
      AND rowsecurity = true
  ) THEN '✓' ELSE '✗' END
UNION ALL
SELECT 
  'Policies exist',
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'user_profiles'
  ) THEN '✓' ELSE '✗' END
UNION ALL
SELECT 
  'Index exists',
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND tablename = 'user_profiles'
  ) THEN '✓' ELSE '✗' END
UNION ALL
SELECT 
  'Trigger exists',
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE event_object_schema = 'public'
      AND event_object_table = 'user_profiles'
  ) THEN '✓' ELSE '✗' END
UNION ALL
SELECT 
  'Unique constraint',
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.user_profiles'::regclass
      AND contype = 'u'
  ) THEN '✓' ELSE '✗' END
UNION ALL
SELECT 
  'Foreign key',
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.user_profiles'::regclass
      AND contype = 'f'
  ) THEN '✓' ELSE '✗' END;

-- Expected: All should show ✓


