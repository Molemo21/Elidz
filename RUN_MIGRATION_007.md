# Migration 007: Fix User Record Creation

## Problem Solved
- ✅ Auth users exist in `auth.users` but not in `public.users`
- ✅ Trigger wasn't working or failing silently
- ✅ Registration succeeds but user records not created

## Solution
This migration creates:
1. **System function** (`create_user_record_system`) - Bypasses RLS, works without auth check
2. **Fixed trigger** - Uses system function to auto-create records
3. **Missing records** - Creates user records for existing auth users

---

## How to Run

### Step 1: Run Migration

1. **Go to Supabase Dashboard → SQL Editor**

2. **Open the migration file:**
   ```
   supabase/migrations/007_fix_user_record_creation.sql
   ```

3. **Copy entire contents and paste into SQL Editor**

4. **Click "Run"**

5. **Wait for success message**

### Step 2: Verify Migration

Run this verification query:

```sql
-- Check functions exist
SELECT 
  proname as function_name,
  prosecdef as is_security_definer
FROM pg_proc 
WHERE proname IN ('create_user_record_system', 'handle_new_user')
ORDER BY proname;

-- Check trigger exists
SELECT 
  trigger_name,
  event_object_table,
  action_timing
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Check if all auth users have records
SELECT 
  (SELECT COUNT(*) FROM auth.users) as auth_users_count,
  (SELECT COUNT(*) FROM public.users) as public_users_count,
  CASE 
    WHEN (SELECT COUNT(*) FROM auth.users) = (SELECT COUNT(*) FROM public.users)
    THEN '✅ All users have records'
    ELSE '⚠️ ' || ((SELECT COUNT(*) FROM auth.users) - (SELECT COUNT(*) FROM public.users))::TEXT || ' missing'
  END as status;
```

**Expected:**
- 2 functions exist (both with `is_security_definer = true`)
- Trigger exists on `auth.users`
- All users have records

---

## What This Fixes

### Before Migration
- ❌ Registration creates auth user but not public.users record
- ❌ Trigger fails or doesn't fire
- ❌ Users can't log in because record doesn't exist

### After Migration
- ✅ Trigger automatically creates user records
- ✅ System function bypasses RLS reliably
- ✅ Missing records are created for existing users
- ✅ Future registrations work automatically

---

## Testing

### Test 1: Verify Existing Users Fixed

```sql
-- Check if all auth users now have records
SELECT 
  au.id,
  au.email,
  pu.id as public_id,
  CASE 
    WHEN pu.id IS NOT NULL THEN '✅ Fixed'
    ELSE '❌ Still missing'
  END as status
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
ORDER BY au.created_at DESC;
```

All should show "✅ Fixed"

### Test 2: Test New Registration

1. Go to: `http://localhost:3000/register`
2. Register a new user
3. Check console logs - should see "✅ User record ensured"
4. Verify in database - user should exist immediately

---

## Troubleshooting

### Error: Function already exists
**Status:** ✅ This is OK - the function is being recreated/updated
**Action:** Migration uses `CREATE OR REPLACE` - safe to run

### Error: Permission denied
**Check:** Are you running as database owner/admin?
**Fix:** Run in Supabase SQL Editor (has proper permissions)

### Users still missing after migration
**Check:** Run the verification query above
**Fix:** Migration Step 4 should create them - if not, check for errors in migration output

---

## Success Indicators

✅ **Migration successful when:**
- No errors in SQL Editor
- Verification queries show all functions/trigger exist
- All auth users have corresponding public.users records
- New registrations work immediately

---

**Migration Status:** Ready to run
**Expected Time:** ~10 seconds
**Risk Level:** Low (uses CREATE OR REPLACE, safe to rerun)


