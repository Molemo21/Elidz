# Comprehensive Test Suite Documentation

This document explains all available test scripts and how to use them to verify your codebase is working correctly.

---

## 📁 Test Files Overview

### Browser-Based Tests (Interactive)

1. **`/test-registration-flow`** - Automated registration flow testing
2. **`/test-user-profiles`** - User profile management testing  
3. **`/test-supabase`** - Database connection verification

### SQL Test Scripts (Supabase SQL Editor)

1. **`TEST_REGISTRATION.sql`** - Comprehensive registration system tests
2. **`TEST_ADMIN_WORKFLOW.sql`** - Admin approval workflow tests
3. **`TEST_USER_PROFILES.sql`** - User profiles database tests (if exists)
4. **`VERIFY_ADMIN_USER_MANAGEMENT.sql`** - Admin user management verification

### Documentation

1. **`TEST_COMPLETE_WORKFLOW.md`** - Complete manual test scenarios
2. **`TEST_SUITE_README.md`** - This file

---

## 🚀 Quick Start Testing

### Step 1: Run SQL Verification Scripts

1. Open **Supabase Dashboard → SQL Editor**
2. Run each SQL test file in order:
   - `TEST_REGISTRATION.sql` ✅
   - `TEST_ADMIN_WORKFLOW.sql` ✅
   - Verify all checks show "✅ PASS"

### Step 2: Test Registration Flow

1. Start your dev server: `pnpm dev`
2. Navigate to: `http://localhost:3000/test-registration-flow`
3. Click **"Run All Tests"**
4. Verify all tests pass ✅

### Step 3: Manual End-to-End Test

Follow the complete workflow in `TEST_COMPLETE_WORKFLOW.md`:
- Register → Login (unapproved) → Admin approval → Login (approved) → Create profile

---

## 📋 Test Suites Explained

### 1. Registration Flow Tests

**Location:** `/test-registration-flow` + `TEST_REGISTRATION.sql`

**What it tests:**
- ✅ User registration functionality
- ✅ Database function `create_user_record()` exists
- ✅ INSERT policy works
- ✅ User records created correctly
- ✅ Auth users sync with public.users

**When to run:**
- After running migration 005
- When registration fails
- After any registration-related changes

---

### 2. Admin Workflow Tests

**Location:** `TEST_ADMIN_WORKFLOW.sql` + Manual testing

**What it tests:**
- ✅ Admin user exists and is approved
- ✅ Admin RLS policies configured
- ✅ `is_admin()` function works
- ✅ Admin can view all users
- ✅ Admin can update users (approve/decline)
- ✅ User approval statuses correct

**When to run:**
- After setting up admin user
- When admin can't see users
- When approval doesn't work

---

### 3. Complete Workflow Tests

**Location:** `TEST_COMPLETE_WORKFLOW.md`

**What it tests:**
- ✅ Full user journey (registration → approval → dashboard)
- ✅ Business profile creation
- ✅ Data integrity
- ✅ Error handling
- ✅ All integration points

**When to run:**
- Before deploying to production
- After major changes
- Weekly regression testing

---

## 🔍 Test Coverage Matrix

| Feature | Browser Test | SQL Test | Manual Test |
|---------|-------------|----------|-------------|
| Registration | ✅ | ✅ | ✅ |
| Login (Unapproved) | ⚠️ | ⚠️ | ✅ |
| Admin View Users | ⚠️ | ✅ | ✅ |
| Admin Approve | ⚠️ | ✅ | ✅ |
| Login (Approved) | ⚠️ | ⚠️ | ✅ |
| Business Profile | ✅ | ✅ | ✅ |
| RLS Policies | ❌ | ✅ | ⚠️ |
| Database Functions | ❌ | ✅ | ⚠️ |

**Legend:**
- ✅ = Comprehensive test available
- ⚠️ = Partial test or manual verification needed
- ❌ = Not covered by this test type

---

## 📊 Running Tests

### Browser Tests

```bash
# Start dev server
pnpm dev

# Navigate to test pages:
# http://localhost:3000/test-registration-flow
# http://localhost:3000/test-user-profiles
```

### SQL Tests

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy test SQL file content
4. Paste and Run
5. Review results

### Manual Tests

Follow step-by-step instructions in `TEST_COMPLETE_WORKFLOW.md`

---

## ✅ Success Criteria

### All Tests Should Show:

**SQL Tests:**
- ✅ All checks marked "✅ PASS"
- ✅ Final status: "✅✅✅ ALL CHECKS PASSED"
- ✅ No "❌ FAIL" or "⚠️" warnings

**Browser Tests:**
- ✅ All tests show green checkmarks
- ✅ No red X marks
- ✅ No console errors
- ✅ Test results show expected data

**Manual Tests:**
- ✅ All steps complete successfully
- ✅ No error messages
- ✅ Expected redirects occur
- ✅ Data persists correctly

---

## 🐛 Troubleshooting Failed Tests

### Registration Tests Fail

**Problem:** "Function does not exist" or RLS errors

**Solution:**
```sql
-- Run migration 005
-- Verify function exists
SELECT proname FROM pg_proc WHERE proname = 'create_user_record';
-- Verify INSERT policy exists
SELECT policyname FROM pg_policies WHERE tablename = 'users' AND cmd = 'INSERT';
```

### Admin Tests Fail

**Problem:** "Admin policies missing" or "is_admin function missing"

**Solution:**
```sql
-- Verify policies
SELECT policyname FROM pg_policies WHERE tablename = 'users' AND policyname LIKE '%admin%';
-- Verify function
SELECT proname FROM pg_proc WHERE proname = 'is_admin';
```

### User Profile Tests Fail

**Problem:** "Profile not found" or "Cannot save"

**Solution:**
- Check user is approved
- Verify RLS policies for user_profiles
- Check server actions are working

---

## 📈 Test Execution Order

For comprehensive testing, run tests in this order:

1. **SQL Verification** (5 minutes)
   - `TEST_REGISTRATION.sql`
   - `TEST_ADMIN_WORKFLOW.sql`
   - Verify all checks pass

2. **Browser Automation** (2 minutes)
   - `/test-registration-flow`
   - `/test-user-profiles`

3. **Manual End-to-End** (15 minutes)
   - Follow `TEST_COMPLETE_WORKFLOW.md`
   - Test full user journey

4. **Integration Tests** (10 minutes)
   - Test error scenarios
   - Test edge cases
   - Verify data integrity

**Total Time:** ~30 minutes for full test suite

---

## 🔄 Continuous Testing

### Daily Testing (Quick)
- Run SQL verification scripts
- Test registration once
- Verify admin can see users

### Weekly Testing (Full)
- Run complete test suite
- Test all user flows
- Verify data integrity
- Check for regressions

### Before Deployment (Comprehensive)
- Run all test suites
- Manual testing of critical paths
- Performance testing
- Security verification

---

## 📝 Test Results Template

When reporting test results, use this format:

```
Test Suite: [Name]
Date: [Date]
Tester: [Name]

Results:
- Test 1: ✅ PASS / ❌ FAIL
- Test 2: ✅ PASS / ❌ FAIL
- ...

Issues Found:
- [List any issues]

Recommendations:
- [Any fixes needed]
```

---

## 🎯 Test Goals

The test suite verifies:

1. **Functionality** - Features work as expected
2. **Integration** - Components work together
3. **Data Integrity** - Database state is correct
4. **Security** - RLS policies protect data
5. **User Experience** - Flows are smooth and intuitive

---

**Last Updated:** 2025-01-27
**Test Suite Version:** 1.0
**Coverage:** Registration, Login, Admin, Profiles


