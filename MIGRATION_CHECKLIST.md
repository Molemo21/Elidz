# NextAuth.js Migration Checklist ✅

## ✅ Completed

- [x] NextAuth.js installed and configured
- [x] All authentication pages updated
- [x] Middleware updated
- [x] Server-side helpers updated
- [x] **NEXTAUTH_SECRET set** ✅ (You've completed this!)

## ⏳ Remaining Steps

### 1. Run Database Migration ⚠️ REQUIRED

You need to add the `password_hash` column to your database:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Go to SQL Editor** (left sidebar)
4. **Click "New Query"**
5. **Copy and paste this SQL**:

```sql
-- Migration: Add password_hash column for JWT authentication
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS password_hash TEXT;

COMMENT ON COLUMN public.users.password_hash IS 'Bcrypt hashed password for JWT authentication. Null for users still using Supabase Auth.';
```

6. **Click "Run"** (or press Ctrl+Enter)
7. **Verify success** - You should see "Success. No rows returned"

### 2. Create a Test User ⚠️ REQUIRED

You'll need a user with a password_hash to test login. Options:

#### Option A: Use Registration Page (Recommended)
- Go to `/register`
- Create a new account
- Password will be automatically hashed

#### Option B: Create via SQL (For Admin Users)

First, generate a bcrypt hash for your password. You can use an online tool like https://bcrypt-generator.com/ or use Node.js:

```javascript
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('your-password', 10);
console.log(hash);
```

Then in Supabase SQL Editor:

```sql
-- Example: Create admin user with password "demo123"
-- Replace the password_hash with your generated hash
UPDATE users
SET password_hash = '$2a$10$YourGeneratedHashHere...'
WHERE email = 'admin@elidz.com';
```

Or create a new user:

```sql
INSERT INTO users (id, email, first_name, last_name, phone, role, approved, password_hash)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  'Test',
  'User',
  '+27 123 456 7890',
  'smme',
  true,
  '$2a$10$YourGeneratedHashHere...'
);
```

### 3. Test Authentication ✅

Once migration is done and you have a user:

1. **Test Registration**:
   - Go to `/register`
   - Create a new account
   - Should redirect to `/login`

2. **Test Login**:
   - Go to `/login`
   - Enter credentials
   - Should redirect based on role/approval status

3. **Test Protected Routes**:
   - Try accessing `/dashboard` (should require login)
   - Try accessing `/admin` (should require admin role)

## 🐛 Troubleshooting

### Error: "password_hash column does not exist"
- **Solution**: Run the database migration (Step 1 above)

### Error: "This account still uses Supabase authentication"
- **Solution**: User doesn't have a password_hash. Create password hash for the user.

### Error: "NEXTAUTH_SECRET is missing"
- **Solution**: Check `.env.local` has `NEXTAUTH_SECRET` set (you already have this ✅)

### Login works but session not persisting
- Check browser cookies are enabled
- Check that SessionProvider is in layout (it is ✅)
- Try clearing cookies and logging in again

## 📝 Current Status

- ✅ **NEXTAUTH_SECRET**: Set
- ⏳ **Database Migration**: Need to run
- ⏳ **Test User**: Need to create
- ⏳ **Testing**: Ready once above steps done

## 🚀 Quick Start After Migration

1. Run database migration (5 minutes)
2. Create test user via registration page (2 minutes)
3. Test login (1 minute)

**Total time: ~8 minutes to be fully operational!**

---

**Next Step**: Run the database migration SQL in Supabase SQL Editor

