-- Verify your admin user exists and matches the auth user
-- Run this in Supabase SQL Editor to check

SELECT 
  id,
  email,
  role,
  first_name,
  last_name,
  approved,
  created_at
FROM public.users
WHERE email = 'admin@elidz.com';

-- Expected result should show:
-- id: 3d0e58f8-8901-4326-b5df-527b661abc36
-- email: admin@elidz.com
-- role: admin
-- approved: true

