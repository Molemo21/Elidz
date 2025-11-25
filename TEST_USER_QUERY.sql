-- Test querying the users table as the authenticated user
-- This simulates what the app does during login
-- Run this in Supabase SQL Editor

-- First, check if you can query your own user
-- Replace with your actual user ID: 3d0e58f8-8901-4326-b5df-527b661abc36
SELECT 
  id,
  email,
  role,
  first_name,
  last_name,
  approved
FROM public.users
WHERE id = '3d0e58f8-8901-4326-b5df-527b661abc36';

-- Test the is_admin function
SELECT 
  '3d0e58f8-8901-4326-b5df-527b661abc36'::uuid as user_id,
  public.is_admin('3d0e58f8-8901-4326-b5df-527b661abc36'::uuid) as is_admin_result;

-- Check what auth.uid() returns (should be null in SQL editor, but check anyway)
SELECT 
  auth.uid() as current_auth_uid,
  auth.role() as current_auth_role;

