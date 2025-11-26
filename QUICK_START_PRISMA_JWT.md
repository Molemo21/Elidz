# Quick Start: Prisma + JWT Auth

This is a quick reference guide to get you started with Prisma and JWT authentication.

## ✅ What's Been Set Up

1. ✅ Prisma installed and configured
2. ✅ JWT authentication services created (2 options)
3. ✅ Example API routes created
4. ✅ Database query examples created

## 🚀 3-Step Quick Start

### Step 1: Configure Database Connection

1. Get your Supabase database connection string:
   - Go to Supabase Dashboard → Settings → Database
   - Copy the **Connection string (URI mode)**
   - Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

2. Add to `.env.local`:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?schema=public"
   JWT_SECRET="generate-random-string-here"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-another-random-string-here"
   ```

### Step 2: Add Password Column to Database

Run this SQL in Supabase SQL Editor:

```sql
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS password_hash TEXT;
```

### Step 3: Generate Prisma Client

```bash
pnpm run db:generate
```

**That's it!** You can now use Prisma and JWT auth.

## 🧪 Test It

### Test Prisma Connection:
```bash
# Start dev server
pnpm dev

# Visit in browser or curl:
curl http://localhost:3000/api/examples/prisma-users
```

### Test JWT Login:
```bash
curl -X POST http://localhost:3000/api/auth/jwt/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📚 Next Steps

1. **Read `PRISMA_SETUP.md`** for detailed setup
2. **Read `JWT_AUTH_EXAMPLE.md`** for authentication examples
3. **Compare queries:**
   - Supabase: `lib/db/queries.ts`
   - Prisma: `lib/db/queries-prisma-example.ts`

## 🎯 Choose Your Auth Approach

### Option A: Simple JWT (`lib/auth-jwt.ts`)
- Manual token management
- Full control
- Use if you want simple, lightweight auth

### Option B: NextAuth.js (`lib/auth-nextauth.ts`) ⭐ Recommended
- Industry standard
- Automatic session management
- Use for production apps

## 🔧 Useful Commands

```bash
# Generate Prisma Client
pnpm run db:generate

# Open Prisma Studio (database GUI)
pnpm run db:studio

# Pull schema from database
pnpm run db:pull

# Push schema to database
pnpm run db:push
```

## 📁 Key Files

- **Prisma Schema:** `prisma/schema.prisma`
- **Prisma Client:** `lib/prisma.ts`
- **JWT Auth Service:** `lib/auth-jwt.ts`
- **NextAuth Config:** `lib/auth-nextauth.ts`
- **Example Queries:** `lib/db/queries-prisma-example.ts`

## ❓ Troubleshooting

**"Can't reach database"**
- Check DATABASE_URL is correct
- Verify Supabase project is active

**"Schema doesn't match"**
- Run `pnpm run db:pull` to sync

**"User not found" when logging in**
- User needs `password_hash` column
- Create account with JWT auth first

## 💡 Tips

- Keep Supabase Auth working while you migrate
- Test thoroughly before removing old code
- Use Prisma Studio (`pnpm run db:studio`) to inspect database
- Start with one query file at a time

