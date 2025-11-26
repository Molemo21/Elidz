# Testing Checklist

## ✅ Pre-Testing Setup

### 1. Database Connection
- [ ] Verify `DATABASE_URL` is set in `.env.local`
- [ ] Ensure database is accessible
- [ ] Run migrations: `pnpm db:migrate` or `pnpm db:push`

### 2. Start Development Server
```bash
pnpm dev
```

---

## 🧪 Test Scenarios

### Test 1: Admin Opportunities Management

**Goal:** Verify admins can create and manage opportunities

**Steps:**
1. [ ] Log in as admin user
2. [ ] Navigate to Admin Dashboard (`/admin`)
3. [ ] Click "Manage Opportunities" card (or go to `/admin/opportunities`)
4. [ ] Verify page loads without errors
5. [ ] Click "Add Opportunity" button
6. [ ] Fill in the form:
   - Funder Name: `Test Funder`
   - Program Name: `Test Program`
   - Description: `Test description for funding opportunity`
   - Min Amount: `100000`
   - Max Amount: `500000`
   - Funding Type: `Grant`
   - Deadline: Select a future date
   - Application URL: `https://example.com/apply`
   - Industry Focus: `Manufacturing, Technology` (comma-separated)
   - Eligibility Criteria: `Registered SMME, At least 2 years` (comma-separated)
   - Requirements: `Business plan, Financial statements` (comma-separated)
7. [ ] Click "Create Opportunity"
8. [ ] Verify success toast appears
9. [ ] Verify opportunity appears in the table
10. [ ] Click "Edit" on the opportunity
11. [ ] Modify a field (e.g., change description)
12. [ ] Click "Update Opportunity"
13. [ ] Verify changes are saved
14. [ ] Click "Delete" on a test opportunity
15. [ ] Confirm deletion in dialog
16. [ ] Verify opportunity is removed from list

**Expected Results:**
- ✅ All CRUD operations work
- ✅ Form validation works
- ✅ Data persists in database
- ✅ UI updates correctly

---

### Test 2: User Opportunities Browsing

**Goal:** Verify users can see opportunities from database

**Steps:**
1. [ ] Log in as regular user (SMME)
2. [ ] Navigate to Opportunities page (`/opportunities`)
3. [ ] Verify page loads
4. [ ] If opportunities exist:
   - [ ] Verify opportunities are displayed
   - [ ] Check that match scores show (if user has matches)
   - [ ] Verify opportunity details are correct
   - [ ] Click "View Details" on an opportunity
   - [ ] Verify detail page loads correctly
5. [ ] If no opportunities exist:
   - [ ] Verify empty state message appears
   - [ ] Message should be helpful and clear

**Expected Results:**
- ✅ Real data from database (not mock data)
- ✅ Loading states work
- ✅ Empty state is user-friendly
- ✅ Navigation works correctly

---

### Test 3: AI Matching Flow

**Goal:** Verify matching works when profile is saved

**Steps:**
1. [ ] Ensure at least 1 opportunity exists in database
2. [ ] Log in as approved user (or approve a test user)
3. [ ] Navigate to Business Profile (`/dashboard/business-profile`)
4. [ ] Fill in or update profile:
   - Company Name: `Test Company`
   - Registration Number: `2024/123456/07`
   - Industry: `Manufacturing`
   - Business Description: `Test business description`
   - Annual Revenue: `1000000`
   - Employees: `25`
   - Years in Business: `3`
   - Location: `East London, Eastern Cape`
   - Funding Amount: `300000`
   - Funding Purpose: `Expand operations`
   - Business Stage: `Growth`
5. [ ] Click "Save & Find Matches"
6. [ ] Verify profile saves successfully
7. [ ] Wait for matching to complete (check console for any errors)
8. [ ] Navigate to Dashboard (`/dashboard`)
9. [ ] Verify matches appear in "New Matches" section
10. [ ] Verify match scores are displayed
11. [ ] Click on a match to view details

**Expected Results:**
- ✅ Profile saves successfully
- ✅ Matching runs automatically (for approved users)
- ✅ Matches appear on dashboard
- ✅ Match scores are calculated correctly
- ✅ Match reasons are displayed

---

### Test 4: Dashboard Data Loading

**Goal:** Verify dashboard shows real data

**Steps:**
1. [ ] Log in as user with profile and matches
2. [ ] Navigate to Dashboard (`/dashboard`)
3. [ ] Verify loading state appears briefly
4. [ ] Check "New Matches" card:
   - [ ] Shows correct count
   - [ ] Lists real matches from database
   - [ ] Match scores are correct
5. [ ] Check "Your Applications" section:
   - [ ] Shows real applications (if any)
   - [ ] Status badges are correct
6. [ ] Check stats cards:
   - [ ] New Matches count is accurate
   - [ ] Draft Applications count is accurate
   - [ ] In Progress count is accurate
   - [ ] Success Rate is calculated correctly

**Expected Results:**
- ✅ All data comes from database
- ✅ No mock data displayed
- ✅ Loading states work
- ✅ Statistics are accurate

---

### Test 5: Application Creation

**Goal:** Verify applications save to database

**Steps:**
1. [ ] Log in as user
2. [ ] Navigate to an opportunity detail page
3. [ ] Click "Start Application"
4. [ ] Verify AI pre-fills the form
5. [ ] Edit some fields
6. [ ] Click "Save Draft"
7. [ ] Verify draft is saved
8. [ ] Navigate to Applications page
9. [ ] Verify draft application appears
10. [ ] Click "Continue Application"
11. [ ] Make final edits
12. [ ] Enter signature (full name)
13. [ ] Click "Sign & Submit"
14. [ ] Verify application is submitted
15. [ ] Check Applications page - status should be "submitted"

**Expected Results:**
- ✅ Applications save to database
- ✅ Draft functionality works
- ✅ Submission works
- ✅ Status updates correctly

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot fetch data from service"
**Solution:** 
- Check `DATABASE_URL` in `.env.local`
- Ensure database is running
- Run migrations: `pnpm db:migrate`

### Issue: "No opportunities found"
**Solution:**
- Use admin UI to create opportunities
- Or run seed script: `pnpm db:seed` (after DB is configured)

### Issue: "Matching not working"
**Solution:**
- Ensure user is approved (`approved: true` in database)
- Check browser console for errors
- Verify opportunities exist in database
- Check that profile is complete

### Issue: "Unauthorized" errors
**Solution:**
- Ensure user is logged in
- Check session is valid
- Verify user role in database

---

## 📊 Success Criteria

All tests pass when:
- ✅ Admin can create/edit/delete opportunities
- ✅ Users can browse real opportunities
- ✅ AI matching works automatically
- ✅ Dashboard shows real data
- ✅ Applications save to database
- ✅ No mock data is displayed
- ✅ All server actions work correctly
- ✅ Error handling is graceful

---

## 🎯 Quick Test (5 minutes)

If you want a quick smoke test:

1. **Admin creates opportunity:**
   - Log in as admin → `/admin/opportunities` → Create one opportunity

2. **User browses:**
   - Log in as user → `/opportunities` → Verify opportunity appears

3. **User saves profile:**
   - Go to `/dashboard/business-profile` → Save profile → Check dashboard for matches

If these 3 work, the core functionality is operational! 🎉

