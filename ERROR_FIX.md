# Fixing NextAuth Route Handler Error

## The Error

```
TypeError: Function.prototype.apply was called on #<Object>, which is an object and not a function
GET /api/auth/session 500
```

## What This Means

The NextAuth route handler is trying to use an object as a function. This happens when the handler export format is incorrect for NextAuth v5 beta.

## The Fix

I've updated the route handler to use the correct format. The handler should now work correctly.

## Testing

After this fix:

1. **Restart your dev server**:
   ```bash
   # Stop the server (Ctrl+C)
   pnpm dev
   ```

2. **Check the terminal** - the error should be gone

3. **Test the session endpoint**:
   - The error was on `/api/auth/session`
   - This endpoint should now work

4. **Try logging in**:
   - Go to `/login`
   - The session endpoint will be called automatically
   - Should no longer get 500 error

## If Error Persists

If you still see errors after restarting:

1. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   pnpm dev
   ```

2. **Check NEXTAUTH_SECRET** is set (you already have this ✅)

3. **Verify database migration** has been run (still needed ⚠️)

---

**The fix has been applied - restart your dev server to see the changes!**

