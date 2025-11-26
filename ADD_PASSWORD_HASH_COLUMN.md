# Add password_hash Column (When Ready)

## ⚠️ Current Status

The Prisma schema currently **does NOT include** `password_hash` because:
- The column doesn't exist in your database yet
- You're still using Supabase Auth
- We'll add it when you're ready to migrate to JWT auth

## 🔄 When You're Ready to Add It

### Step 1: Add Column to Database

Run this SQL in your Supabase SQL Editor:

```sql
-- Add password_hash column for JWT authentication
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Create index for faster lookups (optional)
CREATE INDEX IF NOT EXISTS idx_users_password_hash ON public.users(password_hash) 
WHERE password_hash IS NOT NULL;
```

### Step 2: Update Prisma Schema

Uncomment/add this line in `prisma/schema.prisma`:

```prisma
model User {
  id           String   @id @default(uuid()) @db.Uuid
  email        String   @unique
  passwordHash String?  @map("password_hash") @db.Text // Uncomment this
  role         String   @default("smme")
  // ... rest of fields
}
```

### Step 3: Regenerate Prisma Client

```bash
pnpm run db:generate
```

## ✅ For Now

The schema works fine without `password_hash` - it's optional and only needed when you migrate to JWT authentication.

