# Update DATABASE_URL to Use Connection Pooler

## Why?
Supabase direct connections (port 5432) often don't work in serverless/Next.js environments. Connection pooling is required.

## How to Get Connection Pooler URL

1. Go to **Supabase Dashboard** → **Settings** → **Database**
2. Scroll to **Connection Pooling** section
3. Select **Transaction mode** (port 6543) - recommended for Prisma
4. Copy the connection string

It will look like:
```
postgresql://postgres.nxdjdkoamvertmzgslyq:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## Update Your .env.local

Replace your current DATABASE_URL with:

```env
DATABASE_URL="postgresql://postgres.nxdjdkoamvertmzgslyq:MotebangNakin@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&schema=public"
```

**Important:** 
- The hostname changes from `db.xxx.supabase.co` to `aws-0-us-east-1.pooler.supabase.com` (or similar)
- The port changes from `5432` to `6543`
- The username format changes to `postgres.xxx` instead of just `postgres`
- Add `?pgbouncer=true&connection_limit=1` query params

## After Updating

1. **Restart your dev server** (important!)
2. Test again: `http://localhost:3000/api/examples/prisma-users`

