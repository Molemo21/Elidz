# Complete Workflow Test Suite

This document provides comprehensive test scenarios to verify the entire application flow from registration to dashboard access.

## Prerequisites

- ✅ All migrations have been run (001-005)
- ✅ Admin user exists in database
- ✅ Database function `create_user_record()` exists
- ✅ RLS policies are configured
- ✅ Development server is running

---

## Test Suite 1: Registration Flow

### Test 1.1: Successful User Registration

**Steps:**
1. Navigate to: `http://localhost:3000/register`
2. Fill out the registration form:
   - Email: `testuser-{timestamp}@example.com`
   - Password: `TestPassword123!`
   - First Name: `Test`
   - Last Name: `User`
   - Phone: `+27123456789`
3. Click "Create Account"

**Expected Results:**
- ✅ Form submits successfully
- ✅ Success message appears: "Registration successful! Your account is pending approval..."
- ✅ Redirected to login page after 3 seconds
- ✅ No error messages in browser console
- ✅ No RLS errors in network tab

**Verification (SQL):**
```sql
-- Check if user was created
SELECT id, email, role, approved, created_at
FROM public.users
WHERE email LIKE 'testuser-%@example.com'
ORDER BY created_at DESC
LIMIT 1;
```

**Expected:**
- User exists with `approved = false`
- `role = 'smme'`
- All fields populated correctly

---

### Test 1.2: Registration with Database Function

**Steps:**
1. Open browser DevTools → Network tab
2. Register a new user (as in Test 1.1)
3. Check network requests

**Expected Results:**
- ✅ `signUp` API call succeeds
- ✅ `create_user_record` RPC call succeeds (or direct insert if function not available)
- ✅ No 401/403 errors
- ✅ User record appears in database

**Verification (SQL):**
```sql
-- Verify recent registration used function
SELECT id, email, created_at
FROM public.users
ORDER BY created_at DESC
LIMIT 1;
```

---

## Test Suite 2: Login Flow (Unapproved User)

### Test 2.1: Unapproved User Login

**Steps:**
1. Use credentials from Test 1.1
2. Navigate to: `http://localhost:3000/login`
3. Enter email and password
4. Click "Sign In"

**Expected Results:**
- ✅ Login succeeds (no error)
- ✅ Redirected to `/pending-approval` page
- ✅ NOT redirected to `/dashboard`
- ✅ Message shows: "Your account is pending admin approval"
- ✅ User cannot access dashboard routes

**Verification:**
- Check browser console for redirect logs
- Verify URL is `/pending-approval`

---

### Test 2.2: Unapproved User Cannot Access Dashboard

**Steps:**
1. While logged in as unapproved user
2. Try to navigate to: `http://localhost:3000/dashboard`
3. Try to navigate to: `http://localhost:3000/dashboard/business-profile`

**Expected Results:**
- ✅ Redirected back to `/pending-approval`
- ✅ Cannot access protected routes

---

## Test Suite 3: Admin Approval Workflow

### Test 3.1: Admin Views Users List

**Steps:**
1. Log out of any user account
2. Log in as admin
3. Navigate to: `http://localhost:3000/admin/users`

**Expected Results:**
- ✅ Users list loads without errors
- ✅ Shows all registered users
- ✅ Shows pending users with "Pending" badge
- ✅ Shows approved users with "Approved" badge
- ✅ Table displays: Name, Email, Role, Status, Joined date, Last Login
- ✅ Refresh button works

**Verification (SQL):**
```sql
-- Check users that should appear
SELECT id, email, role, approved, created_at
FROM public.users
ORDER BY created_at DESC;
```

---

### Test 3.2: Admin Approves User

**Steps:**
1. As admin, go to `/admin/users`
2. Find a user with "Pending" status
3. Click "Approve" button
4. Confirm in dialog
5. Wait for update

**Expected Results:**
- ✅ Dialog opens showing user details
- ✅ "Approve" button works
- ✅ Loading state shows during approval
- ✅ Success toast appears: "User approved"
- ✅ User status changes to "Approved" immediately
- ✅ List refreshes automatically
- ✅ User can no longer be approved (button disappears)

**Verification (SQL):**
```sql
-- Check approval status
SELECT id, email, approved, updated_at
FROM public.users
WHERE email = 'testuser-{your-test-email}@example.com';
```

**Expected:**
- `approved = true`

---

### Test 3.3: Admin Declines User

**Steps:**
1. As admin, find a pending user
2. Click "Decline" button
3. Confirm in dialog

**Expected Results:**
- ✅ User status remains "Pending" (or set to false)
- ✅ Success message appears
- ✅ List refreshes

---

## Test Suite 4: Approved User Access

### Test 4.1: Approved User Login

**Steps:**
1. Log out of admin account
2. Log in with approved user (from Test 3.2)
3. Wait for redirect

**Expected Results:**
- ✅ Login succeeds
- ✅ Redirected to `/dashboard` (NOT `/pending-approval`)
- ✅ Can access dashboard features

---

### Test 4.2: Approved User Creates Business Profile

**Steps:**
1. As approved user, navigate to: `http://localhost:3000/dashboard/business-profile`
2. Fill out business profile form:
   - Company Name: `Test Company`
   - Registration Number: `TEST123456`
   - Industry: `Technology`
   - Business Description: `Test description`
   - Annual Revenue: `100000`
   - Employees: `10`
   - Years in Business: `2`
   - Location: `Johannesburg, South Africa`
   - Funding Amount Needed: `50000`
   - Funding Purpose: `Expansion`
   - Business Stage: `Growth`
3. Click "Save & Find Matches"

**Expected Results:**
- ✅ Form submits successfully
- ✅ Success message appears
- ✅ Redirected to dashboard
- ✅ Data is saved to database

**Verification (SQL):**
```sql
-- Check if profile was created
SELECT up.*, u.email
FROM user_profiles up
JOIN users u ON u.id = up.user_id
WHERE u.email = 'testuser-{your-test-email}@example.com';
```

**Expected:**
- Profile exists with all filled data
- `funding_requirements` contains JSONB data

---

### Test 4.3: Business Profile Loads Existing Data

**Steps:**
1. After Test 4.2, navigate back to: `/dashboard/business-profile`
2. Check form fields

**Expected Results:**
- ✅ All previously entered data is pre-filled
- ✅ Form shows existing values
- ✅ Can update and save again

---

## Test Suite 5: Integration Tests

### Test 5.1: Complete User Journey

**End-to-End Test:**
1. ✅ Register new user → Should succeed
2. ✅ Try to log in → Redirected to pending-approval
3. ✅ Admin logs in → Can see new user
4. ✅ Admin approves user → Status changes
5. ✅ User logs in again → Access to dashboard
6. ✅ User creates business profile → Profile saved
7. ✅ User can edit profile → Updates work

**Expected:**
- All steps complete without errors
- No database inconsistencies
- All redirects work correctly

---

### Test 5.2: Database Integrity

**Run SQL Verification:**
```sql
-- Check for orphaned records
SELECT 
  'Orphaned auth users' as check_type,
  COUNT(*) as count
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = au.id
)
UNION ALL
SELECT 
  'Users without profiles' as check_type,
  COUNT(*) as count
FROM public.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_profiles up WHERE up.user_id = u.id
);
```

**Expected:**
- Orphaned auth users: 0 (or very few if any failed registrations)
- Users without profiles: OK (profiles are optional)

---

## Test Suite 6: Error Handling

### Test 6.1: Duplicate Email Registration

**Steps:**
1. Register with email: `existing@example.com`
2. Try to register again with same email

**Expected Results:**
- ✅ Error message: "User already registered" or similar
- ✅ Registration fails gracefully
- ✅ No partial user creation

---

### Test 6.2: Invalid Data Registration

**Steps:**
1. Try to register with invalid email format
2. Try to register with short password (< 8 chars)
3. Try to register with mismatched passwords

**Expected Results:**
- ✅ Client-side validation prevents submission
- ✅ Appropriate error messages shown
- ✅ No API calls made

---

## Test Suite 7: Browser-Based Test Page

### Test 7.1: Use Automated Test Page

**Steps:**
1. Navigate to: `http://localhost:3000/test-registration-flow`
2. Click "Run All Tests"

**Expected Results:**
- ✅ All automated tests pass
- ✅ Test results show green checkmarks
- ✅ Detailed results available

---

## Test Suite 8: SQL Verification

### Test 8.1: Run Complete SQL Test Suite

**Steps:**
1. Open Supabase SQL Editor
2. Run: `TEST_REGISTRATION.sql`
3. Review all test results

**Expected Results:**
- ✅ All checks show "✅ PASS"
- ✅ Final status: "✅✅✅ ALL CHECKS PASSED"

---

## Quick Test Checklist

Use this checklist for rapid testing:

- [ ] **Registration**
  - [ ] Can register new user
  - [ ] User created in database
  - [ ] No RLS errors
  
- [ ] **Login (Unapproved)**
  - [ ] Can log in
  - [ ] Redirected to pending-approval
  - [ ] Cannot access dashboard

- [ ] **Admin**
  - [ ] Can view users list
  - [ ] Can approve users
  - [ ] Status updates correctly

- [ ] **Approved User**
  - [ ] Can log in
  - [ ] Access to dashboard
  - [ ] Can create business profile
  - [ ] Profile saves and loads

- [ ] **Database**
  - [ ] Function exists
  - [ ] Policies configured
  - [ ] No orphaned records

---

## Troubleshooting

### Issue: Registration fails with RLS error
**Solution:**
- Run migration 005 to create database function
- Verify INSERT policy exists
- Check function permissions

### Issue: User can't log in after approval
**Solution:**
- Verify `approved = true` in database
- Clear browser cookies/localStorage
- Check session is valid

### Issue: Admin can't see users
**Solution:**
- Verify admin role in database
- Check RLS policies exist
- Verify `is_admin()` function works

---

## Success Criteria

✅ **System is ready when:**
- All tests pass
- No console errors
- Database queries succeed
- User flows work end-to-end
- Admin approval works
- Business profiles save/load

---

**Last Updated:** 2025-01-27
**Test Coverage:** Registration, Login, Approval, Profile Creation


