# Fix Database Connection Issue

## Problem
Prisma can't reach the Supabase database server. This is likely because:
1. Using direct connection instead of connection pooler
2. IP not whitelisted
3. Connection string format issue

## Solution

### Option 1: Use Connection Pooler (Recommended)

Supabase provides a connection pooler that's better for serverless/Next.js. 

1. Go to Supabase Dashboard → **Settings** → **Database**
2. Find **Connection Pooling** section
3. Copy the **Connection string** from the pooler (port 6543 for transaction mode or 5432 for session mode)
4. It will look like:
   ```
   postgresql://postgres.nxdjdkoamvertmzgslyq:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

Update your `.env.local`:
```env
DATABASE_URL="postgresql://postgres.nxdjdkoamvertmzgslyq:MotebangNakin@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&schema=public"
```

### Option 2: Check IP Whitelist

1. Go to Supabase Dashboard → **Settings** → **Database**
2. Scroll to **Connection Pooling** or **Network Restrictions**
3. Make sure your IP is allowed (or disable IP restrictions for development)

### Option 3: Use Direct Connection with Correct Format

If using direct connection, ensure:
- Port is 5432
- Password is URL-encoded if it has special characters
- Schema parameter is included

```env
DATABASE_URL="postgresql://postgres:MotebangNakin@db.nxdjdkoamvertmzgslyq.supabase.co:5432/postgres?schema=public"
```

## Test Connection

After updating, test with:
```bash
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.user.findMany().then(u => console.log('✅ Connected! Found', u.length, 'users')).catch(e => console.error('❌ Error:', e.message)).finally(() => prisma.\$disconnect())"
```

