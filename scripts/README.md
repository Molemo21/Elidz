# Test Scripts

## Onboarding Flow Test

Tests the complete onboarding flow to ensure all redirects and profile completion checks work correctly.

### Prerequisites

1. **Environment Variables** (in `.env.local` or `.env`):
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Optional but recommended
   ```

2. **Install Dependencies**:
   ```bash
   pnpm install
   ```
   
   **Optional**: Install `dotenv` for easier environment variable loading:
   ```bash
   pnpm add -D dotenv
   ```
   (The script will work without it if environment variables are set in your system)

### Usage

#### Basic Test (without cleanup):
```bash
pnpm test:onboarding
# or
node scripts/test-onboarding-flow.js
```

#### Test with Cleanup (deletes test user after):
```bash
pnpm test:onboarding:cleanup
# or
node scripts/test-onboarding-flow.js --cleanup
```

### What It Tests

1. ✅ **User Registration** - Creates a new test user
2. ✅ **User Record Creation** - Verifies user record exists in database
3. ✅ **Profile Completion Check** - Verifies profile is incomplete initially
4. ✅ **Business Profile Creation** - Creates complete business profile
5. ✅ **Profile Completion Verification** - Verifies profile is now complete
6. ✅ **Admin Approval** - Tests admin approval functionality
7. ✅ **Cleanup** - Deletes test data (if --cleanup flag used)

### Expected Flow

```
Registration → Login → Onboarding (profile incomplete)
  ↓
Complete Profile → Pending Approval (profile complete, not approved)
  ↓
Admin Approves → Dashboard (profile complete, approved)
```

### Test Output

The script provides colored output:
- 🟢 **Green** - Test passed
- 🔴 **Red** - Test failed
- 🟡 **Yellow** - Warning (non-critical)
- 🔵 **Blue** - Information

### Notes

- Test user email is auto-generated: `test-onboarding-{timestamp}@example.com`
- If service role key is not provided, some tests will be skipped with warnings
- Test data is not automatically cleaned up unless `--cleanup` flag is used
- You can manually delete test users from Supabase dashboard if needed

### Troubleshooting

**Error: Missing Supabase environment variables**
- Ensure `.env.local` or `.env` file exists in project root
- Check that variables are prefixed with `NEXT_PUBLIC_` for client-side access

**Error: Service role key not provided**
- Some tests require admin access
- Add `SUPABASE_SERVICE_ROLE_KEY` to your `.env.local` file
- Get it from Supabase Dashboard → Settings → API → service_role key

**Test user not deleted**
- Use `--cleanup` flag to enable automatic cleanup
- Or manually delete from Supabase Dashboard → Authentication → Users

