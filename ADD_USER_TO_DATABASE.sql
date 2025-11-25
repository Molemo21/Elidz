-- Add your admin user to the users table
-- Replace the UUID below with your actual user ID: 3d0e58f8-8901-4326-b5df-527b661abc36

INSERT INTO public.users (
  id,
  email,
  role,
  first_name,
  last_name,
  phone,
  approved
) VALUES (
  '3d0e58f8-8901-4326-b5df-527b661abc36',  -- Your user ID from Authentication
  'admin@elidz.com',
  'admin',
  'Admin',
  'User',
  '+27123456789',
  true  -- approved = true
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  approved = EXCLUDED.approved;

