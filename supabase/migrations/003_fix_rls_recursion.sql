-- Fix infinite recursion in RLS policies
-- The issue is that admin policies check the users table, which triggers the policy again
-- Solution: Create a security definer function that bypasses RLS

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update any user" ON public.users;

-- Create a security definer function to check if user is admin
-- This function bypasses RLS, preventing infinite recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- Recreate admin policies using the function
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update any user"
  ON public.users FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Also fix other policies that reference users table
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage opportunities" ON public.funding_opportunities;
DROP POLICY IF EXISTS "Admins can view all matches" ON public.matches;
DROP POLICY IF EXISTS "Admins can view all applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can update all applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can view all documents" ON public.documents;

-- Recreate all admin policies using the function
CREATE POLICY "Admins can view all profiles"
  ON public.user_profiles FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage opportunities"
  ON public.funding_opportunities FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all matches"
  ON public.matches FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all applications"
  ON public.applications FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all applications"
  ON public.applications FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all documents"
  ON public.documents FOR SELECT
  USING (public.is_admin(auth.uid()));

