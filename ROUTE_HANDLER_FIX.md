# NextAuth Route Handler Fix ✅

## Problem
```
TypeError: Function.prototype.apply was called on #<Object>, which is an object and not a function
GET /api/auth/session 500
```

## Root Cause
NextAuth v5 beta returns an object with a `handlers` property, not a function directly. We were trying to export the entire object as GET/POST handlers.

## The Fix
Updated `app/api/auth/[...nextauth]/route.ts` to properly destructure the `handlers`:

```typescript
// ❌ WRONG (what we had):
const handler = NextAuth(authConfig)
export const GET = handler  // handler is an object, not a function!

// ✅ CORRECT (fixed):
const { handlers } = NextAuth(authConfig)
export const { GET, POST } = handlers  // handlers contains GET and POST functions
```

## Next Steps

1. **Restart your dev server** (if not already):
   ```bash
   # Stop server (Ctrl+C)
   pnpm dev
   ```

2. **Check terminal** - error should be gone ✅

3. **Test the endpoint**:
   - The `/api/auth/session` endpoint should now work
   - No more 500 errors

4. **Try logging in**:
   - Go to `/login`
   - Should work without errors

## Status
- ✅ Route handler fixed
- ⏳ Still need: Database migration (add password_hash column)
- ⏳ Still need: Create test user

---

**The route handler error is now fixed! Restart your server and the error should disappear.**

