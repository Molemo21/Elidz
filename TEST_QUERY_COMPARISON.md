# Test Query Comparison Guide

This guide shows you how to test Supabase queries vs Prisma queries side-by-side.

## 🎯 Purpose

Compare the results from both query implementations to ensure:
- ✅ Both return the same data
- ✅ Both handle errors the same way
- ✅ Migration is successful before switching

## 🚀 How to Run Tests

### Option 1: Web UI (Recommended)

1. **Start your dev server** (if not already running):
   ```bash
   pnpm dev
   ```

2. **Visit the test page**:
   ```
   http://localhost:3000/test-query-comparison
   ```

3. **Click "Run Comparison Tests"** button

4. **Review the results**:
   - ✅ Green = Tests passed (results match)
   - ❌ Red = Tests failed (results differ)

### Option 2: API Endpoint

Visit directly in browser or use curl:
```bash
curl http://localhost:3000/api/test/query-comparison
```

## 📊 What Gets Tested

The comparison tests cover:

1. **Get All Users** - Fetches all users from database
2. **Get User by ID** - Fetches a specific user
3. **Get User by Email** - Fetches user by email address
4. **Get All Opportunities** - Fetches all funding opportunities
5. **Get Active Opportunities** - Fetches opportunities with future deadlines
6. **Get User Profile** - Fetches user profile data

## ✅ Expected Results

### All Tests Pass ✅
If all tests pass:
- ✅ Prisma queries work correctly
- ✅ Results match Supabase queries
- ✅ Safe to switch to Prisma queries

### Some Tests Fail ❌
If some tests fail:
- Check the differences shown
- Common causes:
  - Field name mismatches (camelCase vs snake_case)
  - Date format differences
  - Null handling differences

## 🔍 Understanding Results

### Success Indicators
- ✅ `match: true` - Results are identical
- ✅ Both `supabaseSuccess` and `prismaSuccess` are `true`
- ✅ No differences listed

### Failure Indicators
- ❌ `match: false` - Results differ
- ❌ Differences array shows what's different
- ❌ One query succeeded, the other failed

## 🐛 Troubleshooting

### Test fails with "Can't reach database"
- Check your `DATABASE_URL` in `.env.local`
- Ensure you're using the connection pooler URL
- Verify Supabase project is active

### Tests return different results
- Check field name mappings (Prisma uses camelCase)
- Verify date formats match
- Check for null/undefined differences

### Some tests skipped
- Tests are skipped if there's no data (e.g., no users to test)
- This is normal - add test data if needed

## 📝 Next Steps

### If All Tests Pass ✅

1. **Update imports gradually**:
   ```typescript
   // Change from:
   import { userQueries } from '@/lib/db/queries'
   // To:
   import { userQueries } from '@/lib/db/queries-prisma'
   ```

2. **Test in your app** - Use the new queries in real scenarios

3. **Remove old file** - Once confident, delete `lib/db/queries.ts`

### If Some Tests Fail ❌

1. **Review differences** - Check what's different
2. **Fix Prisma queries** - Update to match expected behavior
3. **Re-run tests** - Verify fixes work
4. **Repeat until all pass**

## 📚 Files Involved

- `lib/db/test-queries-comparison.ts` - Test logic
- `app/api/test/query-comparison/route.ts` - API endpoint
- `app/test-query-comparison/page.tsx` - Web UI
- `lib/db/queries.ts` - Supabase queries (old)
- `lib/db/queries-prisma.ts` - Prisma queries (new)

## 🎓 Tips

- **Run tests multiple times** - Ensure consistency
- **Test with real data** - More accurate results
- **Check console logs** - Detailed error messages
- **Compare side-by-side** - See actual data differences

