# Migrating Existing Supabase Auth Users to JWT

## Problem

Users who registered before the JWT migration were created using Supabase Auth. These users:
- Have accounts in `public.users` table
- **Do NOT have `password_hash` set** (passwords were stored in Supabase Auth)
- Cannot log in with the new JWT authentication system

## Solution

### For Users (Self-Service)

Users can set their password using the **Forgot Password** flow:

1. Go to `/forgot-password`
2. Enter their email address
3. Click "Continue"
4. Set a new password
5. They can now log in with JWT authentication

### For Admins

Admins can see which users need passwords in the Admin Users page:

1. Go to `/admin/users`
2. Look for the "Need Password" stat card
3. Users needing passwords will have a "Needs Password" badge in the Status column
4. You can contact these users to guide them through the password reset process

### Database Migration

Run the migration script to identify users needing passwords:

```sql
-- Run this in Supabase SQL Editor
-- File: supabase/migrations/010_migrate_existing_users_to_jwt.sql

-- View all users needing passwords
SELECT * FROM public.users_needing_password_migration ORDER BY created_at DESC;

-- Count users needing passwords
SELECT COUNT(*) FROM public.users_needing_password_migration;
```

### Technical Details

**Why can't we migrate passwords?**
- Passwords in Supabase Auth are hashed using Supabase's system
- We cannot retrieve the original passwords
- We cannot convert Supabase Auth hashes to bcrypt hashes
- **Solution**: Users must set new passwords via "Forgot Password"

**What happens to old users?**
- They can still access their account data
- They just need to set a password to log in
- Once they set a password, they can log in normally

### Migration Checklist

- [x] Created migration script to identify users needing passwords
- [x] Updated forgot-password flow to work for users without passwords
- [x] Updated login error messages to guide users
- [x] Added admin UI to show users needing passwords
- [ ] (Optional) Send email notification to users needing passwords
- [ ] (Optional) Create bulk email tool for admins

### Next Steps

1. **Run the migration**: Execute `010_migrate_existing_users_to_jwt.sql` in Supabase
2. **Identify affected users**: Check the `users_needing_password_migration` view
3. **Notify users**: Contact users to set passwords via forgot-password
4. **Monitor**: Check admin dashboard for users still needing passwords

