# Fix Foreign Key Constraint - Step by Step

## The Error You're Getting

The error suggests you might have copied the wrong SQL. Here's the **correct** SQL to run:

## ✅ Correct SQL to Run

**Copy ONLY this SQL** (not the CREATE TABLE statement):

```sql
-- Remove foreign key constraint from users table
ALTER TABLE public.users
DROP CONSTRAINT IF EXISTS users_id_fkey;
```

## Step-by-Step Instructions

### Step 1: Check Current Constraints

First, let's see what constraints exist on the users table:

```sql
SELECT 
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.users'::regclass
AND contype = 'f';  -- 'f' = foreign key
```

Run this first to see the actual constraint name.

### Step 2: Drop the Constraint

Based on what you see, run one of these:

**Option A: If constraint is named `users_id_fkey`:**
```sql
ALTER TABLE public.users
DROP CONSTRAINT IF EXISTS users_id_fkey;
```

**Option B: If constraint has a different name (you'll see it from Step 1):**
```sql
ALTER TABLE public.users
DROP CONSTRAINT IF EXISTS <constraint_name_from_step1>;
```

**Option C: Drop all foreign keys on users table (safest):**
```sql
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'public.users'::regclass
        AND contype = 'f'
    ) LOOP
        EXECUTE 'ALTER TABLE public.users DROP CONSTRAINT ' || quote_ident(r.conname);
    END LOOP;
END $$;
```

## What NOT to Run

❌ **DON'T run this** (this is the CREATE TABLE statement):
```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ...
```

✅ **DO run this** (ALTER TABLE to drop constraint):
```sql
ALTER TABLE public.users
DROP CONSTRAINT IF EXISTS users_id_fkey;
```

## After Dropping the Constraint

1. You should see: **"Success. No rows returned"**
2. Try registering again at `/register`
3. Should work! ✅

---

**Try Step 1 first to see the constraint name, then use Option C (safest) to drop it!**

