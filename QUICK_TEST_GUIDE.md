# Quick Test Guide - 5 Minute Verification

## 🚀 Fastest Way to Verify Everything Works

### Step 1: SQL Verification (2 minutes)

**Open Supabase → SQL Editor, run this:**

```sql
-- Quick Check: Registration System
SELECT 
  CASE 
    WHEN EXISTS (SELECT FROM pg_proc WHERE proname = 'create_user_record') 
    THEN '✅ Function exists'
    ELSE '❌ Run migration 005'
  END as function_check,
  CASE 
    WHEN EXISTS (SELECT FROM pg_policies WHERE tablename = 'users' AND cmd = 'INSERT')
    THEN '✅ INSERT policy exists'
    ELSE '❌ Missing INSERT policy'
  END as policy_check,
  CASE 
    WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users' AND policyname LIKE '%admin%') >= 2
    THEN '✅ Admin policies exist'
    ELSE '❌ Missing admin policies'
  END as admin_check;
```

**Expected:** All ✅ checks

---

### Step 2: Browser Test (2 minutes)

1. Go to: `http://localhost:3000/test-registration-flow`
2. Click **"Run All Tests"**
3. Verify all tests show ✅ PASS

---

### Step 3: Quick Manual Test (1 minute)

1. **Register:** Go to `/register`, create account
2. **Login:** Log in → Should redirect to `/pending-approval`
3. **Admin:** Login as admin → Go to `/admin/users` → Should see users
4. **Approve:** Approve a user → Status should change

✅ **If all work → System is ready!**

---

## ❌ If Something Fails

### Registration fails?
→ Run migration 005: `RUN_MIGRATION_005.md`

### Admin can't see users?
→ Check policies: Run `TEST_ADMIN_WORKFLOW.sql`

### Login doesn't work?
→ Check user exists in both `auth.users` and `public.users`

---

**For detailed testing, see:** `TEST_COMPLETE_WORKFLOW.md`


