# Fixed Infinite Loop in Business Profile Page ✅

## The Problem

The business profile page was stuck in an infinite loop, repeatedly querying `user_profiles`:

```
prisma:query SELECT ... FROM "public"."user_profiles" WHERE ...
```

## Root Cause

1. **Unstable dependency**: The `useEffect` depended on the entire `user` object, which gets a new reference on each render
2. **Unnecessary cookie sync**: `syncSessionToCookies()` was being called (not needed with NextAuth)
3. **No cleanup**: No way to prevent re-runs when component unmounts

## The Fix

### Changes Made:

1. **Removed Supabase cookie sync**:
   - Removed `import { syncSessionToCookies }`
   - Removed `await syncSessionToCookies()` call
   - NextAuth handles sessions automatically

2. **Fixed useEffect dependency**:
   - Changed from: `[user, authLoading]`
   - Changed to: `[user?.id, authLoading]`
   - Now only re-runs when user ID actually changes

3. **Added cleanup**:
   - Added `isMounted` flag to prevent state updates after unmount
   - Added cleanup function to set flag to false

## Result

- ✅ No more infinite loops
- ✅ Profile loads once when component mounts
- ✅ Only re-fetches if user ID changes
- ✅ Cleaner code (removed unnecessary Supabase sync)

---

**The loop should now be fixed! The page will only load the profile once when you navigate to it.**
