-- ============================================
-- Auto-Confirm Existing Users
-- ============================================
-- This script confirms all existing users' email addresses
-- Run this in Supabase SQL Editor to allow existing users to log in
-- without needing to confirm their email

-- Confirm all users' email addresses
UPDATE auth.users
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  confirmed_at = COALESCE(confirmed_at, NOW()),
  updated_at = NOW()
WHERE 
  email_confirmed_at IS NULL 
  OR confirmed_at IS NULL;

-- Verify the changes
SELECT 
  id,
  email,
  email_confirmed_at,
  confirmed_at,
  created_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Confirmed'
    ELSE '❌ Not Confirmed'
  END as status
FROM auth.users
ORDER BY created_at DESC;

-- Show summary
SELECT 
  COUNT(*) FILTER (WHERE email_confirmed_at IS NOT NULL) as confirmed_count,
  COUNT(*) FILTER (WHERE email_confirmed_at IS NULL) as unconfirmed_count,
  COUNT(*) as total_users
FROM auth.users;


