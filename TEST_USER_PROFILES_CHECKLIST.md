# User Profiles Implementation Test Checklist

## ✅ Prerequisites
- [ ] User is logged in to the application
- [ ] Supabase connection is configured (check `/test-supabase`)
- [ ] Database migrations have been run
- [ ] User has an approved account

---

## 🧪 Test 1: Get User Profile (No Profile Exists)

**Steps:**
1. Navigate to `/test-user-profiles`
2. Click "Test Get Profile" button
3. Observe the result

**Expected Result:**
- ✅ Should return success but no data (or null)
- ✅ Message should indicate "No profile found"
- ✅ Status badge should be green (passed)

**Status:** [ ] Pass [ ] Fail

**Notes:**
_________________________________________________

---

## 🧪 Test 2: Create User Profile

**Steps:**
1. Click "Test Create Profile" button
2. Wait for the test to complete
3. Check the result details

**Expected Result:**
- ✅ Should create a new profile in database
- ✅ Should return success with profile data
- ✅ Profile should be visible in Supabase dashboard
- ✅ All fields should be properly saved
- ✅ `funding_requirements` should be valid JSONB

**Status:** [ ] Pass [ ] Fail

**Notes:**
_________________________________________________

---

## 🧪 Test 3: Get User Profile (After Creation)

**Steps:**
1. Click "Test Get Profile" button again
2. Check the result

**Expected Result:**
- ✅ Should return success with the created profile data
- ✅ All fields should match what was created
- ✅ `funding_requirements` JSONB should be properly structured

**Status:** [ ] Pass [ ] Fail

**Notes:**
_________________________________________________

---

## 🧪 Test 4: Update User Profile

**Steps:**
1. Click "Test Update Profile" button
2. Wait for completion
3. Check the result

**Expected Result:**
- ✅ Should update existing profile
- ✅ Company name should change
- ✅ Business description should change
- ✅ Should return updated profile data
- ✅ `updated_at` timestamp should be recent

**Status:** [ ] Pass [ ] Fail

**Notes:**
_________________________________________________

---

## 🧪 Test 5: Upsert User Profile

**Steps:**
1. Click "Test Upsert Profile" button
2. Wait for completion
3. Check the result

**Expected Result:**
- ✅ Should create or update profile (upsert behavior)
- ✅ Should return success with profile data
- ✅ All fields should be properly set
- ✅ Should handle both new and existing profiles

**Status:** [ ] Pass [ ] Fail

**Notes:**
_________________________________________________

---

## 🧪 Test 6: Run All Tests

**Steps:**
1. Click "Clear Results" if needed
2. Click "Run All Tests" button
3. Wait for all tests to complete
4. Review the summary

**Expected Result:**
- ✅ All tests should run sequentially
- ✅ Test summary should show pass/fail counts
- ✅ Results should be displayed clearly
- ✅ At least 3-4 tests should pass

**Status:** [ ] Pass [ ] Fail

**Notes:**
_________________________________________________

---

## 🧪 Test 7: Business Profile Page Integration

**Steps:**
1. Navigate to `/dashboard/business-profile`
2. Fill out the form with test data:
   - Company Name: "Test Company"
   - Registration Number: "TEST-12345"
   - Industry: Select any (e.g., "Manufacturing")
   - Business Description: "Test description for integration test"
   - Annual Revenue: `1000000`
   - Employees: `10`
   - Years in Business: `2`
   - Location: "Test Location"
   - Funding Amount: `500000`
   - Funding Purpose: "Test purpose"
   - Business Stage: Select any (e.g., "Growth")
3. Click "Save & Find Matches"
4. Wait for redirect

**Expected Result:**
- ✅ Should show success message
- ✅ Should redirect to dashboard after 2 seconds
- ✅ Data should be saved in database
- ✅ No error messages

**Status:** [ ] Pass [ ] Fail

**Notes:**
_________________________________________________

---

## 🧪 Test 8: Profile Loading

**Steps:**
1. Navigate to `/dashboard/business-profile` again
2. Wait for page to load
3. Check form fields

**Expected Result:**
- ✅ Form should be pre-populated with saved data
- ✅ All fields should show the values you entered
- ✅ Company name should match
- ✅ All numbers should be properly displayed
- ✅ Funding requirements should be loaded

**Status:** [ ] Pass [ ] Fail

**Notes:**
_________________________________________________

---

## 🧪 Test 9: Data Validation

**Steps:**
1. Navigate to `/dashboard/business-profile`
2. Try to submit with invalid data:
   - Try negative numbers (e.g., -1000 for revenue)
   - Try leaving required fields empty
   - Try non-numeric values in number fields
3. Attempt to submit

**Expected Result:**
- ✅ Should show validation error messages
- ✅ Should not save invalid data
- ✅ Form should remain on page
- ✅ Error messages should be clear and helpful

**Status:** [ ] Pass [ ] Fail

**Notes:**
_________________________________________________

---

## 🧪 Test 10: Database Verification

**Steps:**
1. Open Supabase Dashboard
2. Navigate to Table Editor > `user_profiles`
3. Find your profile record (filter by your user_id or email)
4. Inspect the record

**Expected Result:**
- ✅ All fields should match what you entered
- ✅ `funding_requirements` should be a valid JSONB object
- ✅ `updated_at` should be recent timestamp
- ✅ `user_id` should match your authenticated user ID
- ✅ No duplicate profiles should exist

**Status:** [ ] Pass [ ] Fail

**Notes:**
_________________________________________________

---

## 🧪 Test 11: Multiple Updates

**Steps:**
1. Update profile multiple times
2. Change different fields each time:
   - First update: Change company name
   - Second update: Change annual revenue
   - Third update: Change location
3. After each update, verify in database

**Expected Result:**
- ✅ Each update should save correctly
- ✅ `updated_at` should change each time
- ✅ No duplicate profiles should be created
- ✅ Previous values should be overwritten correctly

**Status:** [ ] Pass [ ] Fail

**Notes:**
_________________________________________________

---

## 🧪 Test 12: SQL Verification Script

**Steps:**
1. Open Supabase SQL Editor
2. Run `TEST_USER_PROFILES.sql` script
3. Check all queries return expected results

**Expected Result:**
- ✅ Table structure should be correct
- ✅ RLS should be enabled
- ✅ Policies should exist
- ✅ Indexes should exist
- ✅ Triggers should exist
- ✅ Constraints should exist
- ✅ Summary check should show all ✓

**Status:** [ ] Pass [ ] Fail

**Notes:**
_________________________________________________

---

## 📊 Test Summary

**Test Results:**
- Total Tests: 12
- Passed: ___
- Failed: ___
- Success Rate: ___%

**Overall Assessment:**
- [ ] All critical tests passed
- [ ] Implementation is working correctly
- [ ] Ready for production use
- [ ] Needs fixes (see notes below)

**Issues Found:**
_________________________________________________
_________________________________________________
_________________________________________________

**Recommendations:**
_________________________________________________
_________________________________________________
_________________________________________________

**Tested By:** _________________  
**Date:** _________________  
**Environment:** [ ] Development [ ] Staging [ ] Production

---

## 🔍 Quick Reference

### Test Page URL
```
http://localhost:3000/test-user-profiles
```

### Business Profile Page URL
```
http://localhost:3000/dashboard/business-profile
```

### Database Table
```
public.user_profiles
```

### Server Actions File
```
app/actions/user-profiles.ts
```

### Key Functions to Test
- `getUserProfile()` - Fetch user's profile
- `createUserProfile()` - Create new profile
- `updateUserProfile()` - Update existing profile
- `upsertUserProfile()` - Create or update

---

## ✅ Success Criteria

The implementation is considered successful if:
- ✅ All 12 tests pass
- ✅ Data saves correctly to database
- ✅ Data loads correctly from database
- ✅ Validation works as expected
- ✅ No errors in browser console
- ✅ No errors in server logs
- ✅ RLS policies work correctly
- ✅ Profile updates work correctly


