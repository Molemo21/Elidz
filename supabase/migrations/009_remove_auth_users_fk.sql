-- Migration: Remove foreign key constraint from users table
-- This allows users to be created independently without Supabase Auth
-- Required for JWT authentication migration

-- First, let's find the constraint name if it's different
-- The constraint might be named users_id_fkey or something else

-- Drop the foreign key constraint (tries common constraint names)
ALTER TABLE public.users
DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Alternative: If the above doesn't work, find and drop any FK constraint on id
-- Uncomment the block below if needed:
/*
DO $$ 
DECLARE
    constraint_name text;
BEGIN
    -- Find the foreign key constraint on the id column
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'public.users'::regclass
    AND contype = 'f'
    AND conkey::text LIKE '%1%';  -- column 1 is usually the id
    
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.users DROP CONSTRAINT ' || quote_ident(constraint_name);
    END IF;
END $$;
*/

-- The id column will now be independent
-- We'll generate UUIDs in the application code (Prisma handles this with @default(uuid()))
-- Existing users with foreign keys will continue to work

COMMENT ON TABLE public.users IS 'Users table - now independent of Supabase Auth. Uses JWT authentication.';
