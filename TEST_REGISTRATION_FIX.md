# Registration Fix - Testing Guide

## What Was Fixed

### Changes Made:
1. **Better error handling** - More detailed error messages
2. **Improved session management** - Waits longer and verifies session
3. **Dual approach** - Tries direct insert first, then function fallback
4. **Better logging** - Detailed console logs for debugging
5. **Cleaner error messages** - User-friendly error messages

### Flow Now:
1. User signs up → Auth user created
2. Wait 500ms for session
3. **Try direct INSERT** (uses INSERT policy)
4. **If fails → Try database function** (bypasses RLS)
5. **If both fail → Clean up and show error**

---

## Testing Steps

### Test 1: Registration with Direct Insert

1. Open browser console (F12)
2. Navigate to: `http://localhost:3000/register`
3. Fill out form and submit
4. **Watch console logs:**
   - Should see: "Session available: [user-id]"
   - Should see: "✅ User record created successfully via direct insert"
5. **Expected:** Registration succeeds

### Test 2: Check User in Database

After successful registration, run in SQL:

```sql
-- Check if user was created
SELECT 
  id,
  email,
  role,
  approved,
  first_name,
  last_name,
  created_at
FROM public.users
ORDER BY created_at DESC
LIMIT 1;
```

**Expected:**
- User exists
- All fields populated
- `approved = false`

### Test 3: Check Console Logs

If registration fails, check console for:
- Error codes
- Error messages  
- Which method failed (insert vs function)

---

## Troubleshooting

### Error: "Session not immediately available"
**Status:** ⚠️ Warning (not fatal)
**Action:** Registration should still work via direct insert

### Error: "Direct insert failed"
**Check:**
1. INSERT policy exists: `SELECT * FROM pg_policies WHERE tablename = 'users' AND cmd = 'INSERT';`
2. User is authenticated: Check session in console

### Error: "Function call failed"
**Check:**
1. Function exists: `SELECT proname FROM pg_proc WHERE proname = 'create_user_record';`
2. Function permissions: Check if authenticated role can execute

### Both Methods Fail
**Possible causes:**
1. RLS policies blocking
2. Session not established
3. Network issues
4. Database connection problems

**Solution:**
- Check browser console for detailed errors
- Verify all policies exist
- Check Supabase dashboard for errors

---

## Success Indicators

✅ **Registration succeeds when:**
- No console errors
- Success message appears
- User can log in
- User exists in database
- Redirect to login page works

---

## Next Steps After Registration Works

1. Test login (should redirect to pending-approval)
2. Test admin approval
3. Test approved user login
4. Test business profile creation


