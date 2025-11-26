# User Profiles Test Suite

This test suite verifies that the user profiles database integration is working correctly.

## 📁 Files Created

### 1. Browser Test Page
**File:** `app/test-user-profiles/page.tsx`
**URL:** `/test-user-profiles`

A web-based test interface that allows you to test all user profile server actions directly in your browser.

### 2. SQL Verification Script
**File:** `TEST_USER_PROFILES.sql`

SQL queries to verify database structure, RLS policies, indexes, and constraints.

### 3. Manual Test Checklist
**File:** `TEST_USER_PROFILES_CHECKLIST.md`

A comprehensive checklist for manual testing of all features.

---

## 🚀 Quick Start

### Option 1: Browser Test (Recommended)

1. **Start your development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

2. **Navigate to the test page:**
   ```
   http://localhost:3000/test-user-profiles
   ```

3. **Make sure you're logged in:**
   - If not logged in, you'll see a prompt to log in
   - Log in with your test account

4. **Run tests:**
   - Click individual test buttons to test specific functions
   - Click "Run All Tests" to execute the complete test suite
   - Results will appear below with pass/fail indicators

### Option 2: SQL Verification

1. **Open Supabase Dashboard:**
   - Go to your Supabase project
   - Navigate to SQL Editor

2. **Run the verification script:**
   - Open `TEST_USER_PROFILES.sql`
   - Copy and paste into SQL Editor
   - Run all queries
   - Verify all checks show ✓

### Option 3: Manual Testing

1. **Follow the checklist:**
   - Open `TEST_USER_PROFILES_CHECKLIST.md`
   - Go through each test systematically
   - Check off items as you complete them
   - Document any issues found

---

## 🧪 Test Functions

The browser test page tests these server actions:

### 1. Get User Profile
- Tests: `getUserProfile()`
- Purpose: Fetch existing profile from database
- Expected: Returns profile data or null if none exists

### 2. Create User Profile
- Tests: `createUserProfile()`
- Purpose: Create a new profile
- Expected: Successfully creates profile with test data

### 3. Update User Profile
- Tests: `updateUserProfile()`
- Purpose: Update existing profile fields
- Expected: Updates profile and returns updated data

### 4. Upsert User Profile
- Tests: `upsertUserProfile()`
- Purpose: Create or update profile in one operation
- Expected: Handles both new and existing profiles

---

## ✅ What to Look For

### Successful Test Results
- ✅ Green status badges
- ✅ Success messages with checkmarks (✓)
- ✅ Profile data displayed correctly
- ✅ JSONB structure is valid
- ✅ Timestamps are recent

### Failed Test Results
- ❌ Red status badges
- ❌ Error messages with X marks (✗)
- ❌ Detailed error information
- ❌ Suggestions for fixes

---

## 🔍 Troubleshooting

### Test Page Won't Load
- **Issue:** Page shows "Please log in"
- **Fix:** Log in to your account first
- **Check:** Verify authentication is working at `/login`

### Tests Are Failing
- **Issue:** All tests return errors
- **Check:**
  1. Database migrations are run
  2. RLS policies are enabled
  3. User account is approved
  4. Supabase connection is configured

### Profile Not Saving
- **Issue:** Create/Update tests fail
- **Check:**
  1. User has permission (RLS policies)
  2. Database connection is working
  3. All required fields are provided
  4. Data types are correct

---

## 📊 Expected Test Results

### First Time Running Tests
- Get Profile: ✅ Pass (no profile yet)
- Create Profile: ✅ Pass (creates new profile)
- Get Profile: ✅ Pass (finds created profile)
- Update Profile: ✅ Pass (updates profile)
- Upsert Profile: ✅ Pass (upserts profile)

### After Profile Exists
- All tests should pass
- Profile data should persist
- Updates should work correctly

---

## 🎯 Integration Testing

### Test Business Profile Page

1. **Navigate to business profile:**
   ```
   /dashboard/business-profile
   ```

2. **Fill out and save:**
   - Fill in all required fields
   - Click "Save & Find Matches"
   - Verify success message

3. **Verify data persisted:**
   - Return to profile page
   - Form should be pre-populated
   - Or check in test page: "Get Profile"

4. **Verify in database:**
   - Open Supabase Dashboard
   - Check `user_profiles` table
   - Verify your data is there

---

## 📝 Notes

- **Test Data:** Test scripts create profiles with timestamps to avoid conflicts
- **Cleanup:** Test profiles can be deleted from Supabase if needed
- **Multiple Users:** Each user can only see/modify their own profiles (RLS)
- **Production:** Don't run test scripts in production!

---

## 🔗 Related Files

- **Server Actions:** `app/actions/user-profiles.ts`
- **Business Profile Page:** `app/dashboard/business-profile/page.tsx`
- **Database Schema:** `supabase/migrations/001_initial_schema.sql`
- **RLS Policies:** `supabase/migrations/002_rls_policies.sql`

---

## 📞 Support

If tests are failing:
1. Check browser console for errors
2. Check server logs for errors
3. Verify Supabase connection
4. Verify database migrations are applied
5. Check RLS policies are correct

---

## ✅ Success Checklist

Your implementation is working correctly if:
- ✅ Browser test page loads without errors
- ✅ All test buttons work
- ✅ Tests return success status
- ✅ Profile data saves to database
- ✅ Profile data loads from database
- ✅ Business profile page saves correctly
- ✅ Business profile page loads existing data
- ✅ SQL verification script shows all ✓
- ✅ No console errors
- ✅ No server errors

---

**Last Updated:** Implementation complete
**Status:** Ready for testing


