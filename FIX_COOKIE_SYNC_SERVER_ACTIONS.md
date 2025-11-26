# Fix: Cookie Sync Issue in Server Actions

## 🔍 Problem

Server actions were unable to read the authentication session even though the user was logged in client-side. The error was:
```
Unauthorized: Please log in. If you just logged in, try refreshing the page.
```

**Root Cause:** Cookies weren't being synced from client-side (localStorage) to server-side before the server action was called.

---

## ✅ Solutions Applied

### 1. Added Explicit Cookie Sync (`app/admin/users/page.tsx`)

**Before:** Server action was called immediately, cookies might not be synced.

**After:** 
- Cookie sync happens explicitly in `fetchUsers()` before calling the server action
- Syncs session from localStorage to cookies via `/api/auth/sync-cookies`
- Waits 200ms for cookies to be properly set
- Then calls the server action

**Code Flow:**
```typescript
fetchUsers() {
  1. Sync cookies from localStorage
  2. Wait for cookies to be set
  3. Call getAllUsers() server action
}
```

### 2. Improved Server Action Session Detection (`app/actions/users.ts`)

**Before:** Only tried `getUser()` which might fail if cookies aren't available.

**After:**
- Tries `getSession()` first (reads from cookies)
- Falls back to `getUser()` if session not found
- Better error logging to diagnose issues
- Verifies admin status after authentication

### 3. Enhanced getServerSession Helper (`lib/supabase/auth-helpers.ts`)

**Improvements:**
- Tries `getSession()` first (better for cookie-based auth)
- Falls back to `getUser()` if needed
- Better logging for debugging

---

## 🔧 Technical Details

### Cookie Sync Flow:

1. **Client-side login:**
   - Session stored in `localStorage` (key: `sb-{projectRef}-auth-token`)
   - Contains `access_token` and `refresh_token`

2. **Cookie sync (before server action):**
   - Reads session from `localStorage`
   - POSTs to `/api/auth/sync-cookies`
   - API route sets cookies via `setSession()`
   - Cookies are now available server-side

3. **Server action execution:**
   - Reads cookies via `cookies()` from Next.js
   - Supabase client reads session from cookies
   - Session is now available!

### Why This Was Needed:

- Server actions run on the server
- Server needs cookies to read the session
- Cookies aren't automatically synced from localStorage
- Explicit sync ensures cookies are available

---

## 📋 Testing

After these fixes:

1. **Log in as admin:**
   - Session stored in localStorage ✓

2. **Navigate to `/admin/users`:**
   - Page loads
   - Cookie sync happens automatically
   - Server action can read session
   - Users load successfully ✓

3. **Check console logs:**
   - `[AdminUsersPage] Syncing cookies before server action...`
   - `[AdminUsersPage] ✓ Cookies synced successfully`
   - `[getAllUsers] User authenticated: admin@elidz.com`
   - `[getAllUsers] Admin verified, fetching all users...`
   - Users list displays ✓

---

## 🐛 If Issues Persist

### Check 1: Browser Console
Look for:
- Cookie sync success/failure messages
- Authentication errors
- Server action response

### Check 2: Network Tab
Verify:
- `/api/auth/sync-cookies` returns 200 OK
- Cookies are being set (check Application → Cookies)

### Check 3: Server Logs
Check terminal for:
- `[getAllUsers]` logs
- Session detection logs
- Error messages

### Quick Fixes:

1. **Refresh the page** - Ensures fresh cookie sync
2. **Log out and back in** - Creates fresh session
3. **Clear browser cookies** - Removes stale cookies
4. **Check localStorage** - Verify session exists:
   ```javascript
   // In browser console
   const key = `sb-${projectRef}-auth-token`
   localStorage.getItem(key)
   ```

---

## 📝 Files Modified

1. ✅ `app/admin/users/page.tsx` - Added cookie sync before server action
2. ✅ `app/actions/users.ts` - Improved session detection (getSession + getUser)
3. ✅ `lib/supabase/auth-helpers.ts` - Enhanced getServerSession helper

---

## 🎯 Expected Result

After these fixes:
- ✅ Cookies are explicitly synced before server actions
- ✅ Server actions can reliably detect sessions
- ✅ Admin users page loads users successfully
- ✅ Better error messages and logging for debugging

The cookie sync now happens automatically when `fetchUsers()` is called, ensuring the server action has access to the authentication session.


