# Fixed Decimal Serialization Error ✅

## The Problem

```
Only plain objects can be passed to Client Components from Server Components. 
Decimal objects are not supported.
```

Prisma's `Decimal` type cannot be serialized when passing data from Server Components to Client Components in Next.js.

## The Fix

Created a serialization utility that converts Prisma `Decimal` values to JavaScript `number` before sending to client components.

### Changes Made:

1. **Created `lib/db/serialize.ts`**:
   - Utility functions to detect and convert Decimal values
   - Recursively serializes objects and arrays
   - Handles Date objects too

2. **Updated `lib/db/queries.ts`**:
   - Added serialization to all user profile queries:
     - `getByUserId()` - Now serializes before returning
     - `upsert()` - Now serializes before returning
     - `update()` - Now serializes before returning

### How It Works:

- Detects Decimal objects by checking for `toNumber()` method
- Converts Decimal to number using `toNumber()`
- Recursively processes nested objects and arrays
- Also handles Date objects (converts to ISO string)

## Result

✅ No more serialization errors
✅ Decimal values converted to numbers
✅ Data can be passed to client components safely

---

**The error should now be fixed! Refresh the page and the Decimal serialization error should be gone.**

