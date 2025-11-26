# Seed Script & Admin Opportunities Management

## ✅ What's Been Implemented

### 1. Database Seed Script
**Location:** `prisma/seed.ts`

A comprehensive seed script that populates the database with 6 sample funding opportunities covering various industries and funding types.

**Features:**
- ✅ Idempotent (won't create duplicates)
- ✅ Error handling for database connection
- ✅ Clear console output
- ✅ Uses Prisma for type-safe operations

**Sample Opportunities Included:**
1. ELIDZ Development Fund - Green Energy Innovation Grant
2. Small Enterprise Development Agency - Technology Startup Accelerator
3. Industrial Development Corporation - Manufacturing Expansion Loan
4. Department of Small Business Development - Rural Business Development Grant
5. National Empowerment Fund - Black Industrialists Programme
6. Technology Innovation Agency - Innovation Support Programme

### 2. Admin Opportunities Management Page
**Location:** `app/admin/opportunities/page.tsx`

A full-featured admin interface for managing funding opportunities.

**Features:**
- ✅ List all opportunities in a table view
- ✅ Create new opportunities with comprehensive form
- ✅ Edit existing opportunities
- ✅ Delete opportunities with confirmation
- ✅ View opportunity details (amount range, deadline, industry focus, etc.)
- ✅ Empty state when no opportunities exist
- ✅ Real-time data from database

**Form Fields:**
- Funder Name
- Program Name
- Description
- Amount Range (Min/Max)
- Funding Type
- Deadline
- Application URL
- Industry Focus (comma-separated)
- Eligibility Criteria (comma-separated)
- Requirements (comma-separated)

### 3. Admin Dashboard Integration
- ✅ Added "Funding Opportunities" card to admin dashboard
- ✅ Shows count of active opportunities
- ✅ Quick link to manage opportunities

### 4. Improved Empty States
- ✅ Opportunities page shows helpful message when no opportunities exist
- ✅ Admin page shows call-to-action to create first opportunity
- ✅ Better user experience

---

## 🚀 How to Use

### Running the Seed Script

**Prerequisites:**
1. Ensure `DATABASE_URL` is set in `.env.local`
2. Database must be accessible and migrations must be run

**Command:**
```bash
pnpm db:seed
```

**What it does:**
- Connects to database
- Checks if opportunities already exist (prevents duplicates)
- Creates 6 sample opportunities if database is empty
- Provides clear feedback on success/failure

**Note:** If you get a connection error, ensure:
- `DATABASE_URL` is correctly set in `.env.local`
- Database is running and accessible
- Prisma migrations have been run (`pnpm db:migrate` or `pnpm db:push`)

### Using Admin Opportunities Management

1. **Access the Page:**
   - Log in as admin
   - Go to Admin Dashboard
   - Click "Manage Opportunities" card
   - Or navigate directly to `/admin/opportunities`

2. **Create Opportunity:**
   - Click "Add Opportunity" button
   - Fill in all required fields
   - Use comma-separated values for:
     - Industry Focus: `Manufacturing, Technology, Energy`
     - Eligibility Criteria: `Registered SMME, At least 2 years in operation`
     - Requirements: `Business plan, Financial statements`
   - Click "Create Opportunity"

3. **Edit Opportunity:**
   - Click "Edit" button on any opportunity row
   - Modify fields as needed
   - Click "Update Opportunity"

4. **Delete Opportunity:**
   - Click "Delete" button on any opportunity row
   - Confirm deletion in the dialog
   - ⚠️ **Warning:** This will also delete all associated matches and applications

---

## 📋 Best Practices

### For Seed Script:
1. **Run once** after initial database setup
2. **Don't run in production** - use admin UI instead
3. **Check existing data** - script won't overwrite existing opportunities

### For Admin UI:
1. **Validate deadlines** - ensure deadlines are in the future
2. **Amount ranges** - max should be >= min
3. **URLs** - use valid application URLs
4. **Industry focus** - use consistent industry names for better matching
5. **Eligibility criteria** - be specific and clear for better AI matching

### Data Quality Tips:
- Use consistent industry names (e.g., "Manufacturing" not "Manufacturing" and "Manufacturing & Production")
- Keep eligibility criteria clear and specific
- Set realistic amount ranges
- Ensure deadlines are far enough in the future
- Use descriptive program names

---

## 🔄 Next Steps

After seeding or creating opportunities:

1. **Users can browse** opportunities at `/opportunities`
2. **AI matching** will work when users complete their profiles
3. **Applications** can be created for these opportunities
4. **Admin can manage** all opportunities from the admin panel

---

## 🐛 Troubleshooting

### Seed Script Fails:
- **Error: "Cannot fetch data from service"**
  - Check `DATABASE_URL` in `.env.local`
  - Ensure database is running
  - Verify network connectivity

- **Error: "Table does not exist"**
  - Run migrations: `pnpm db:migrate` or `pnpm db:push`
  - Ensure Prisma schema matches database

### Admin Page Issues:
- **"Unauthorized" error**
  - Ensure you're logged in as admin
  - Check user role in database

- **Opportunities not showing**
  - Check if opportunities exist in database
  - Verify deadline is in the future (only active opportunities show)
  - Check browser console for errors

---

## 📝 Notes

- The seed script creates opportunities with deadlines in 2025
- All opportunities are set as "active" (deadline in future)
- Industry focus, eligibility criteria, and requirements are stored as arrays
- The admin UI converts comma-separated strings to arrays automatically

