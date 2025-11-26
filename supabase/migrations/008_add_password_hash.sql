-- Migration: Add password_hash column for JWT authentication
-- This allows users to authenticate with JWT instead of Supabase Auth

-- Add password_hash column (nullable to support existing users)
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Add comment
COMMENT ON COLUMN public.users.password_hash IS 'Bcrypt hashed password for JWT authentication. Null for users still using Supabase Auth.';

-- Create index for faster lookups (though email is already unique)
-- No index needed as we'll primarily query by email which is already indexed

