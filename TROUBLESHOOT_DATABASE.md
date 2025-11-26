# Troubleshooting Database Connection

## Current Status
- ✅ Direct Node.js connection test works
- ❌ Next.js API route can't connect

## Solution Steps

### Step 1: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
# Then restart:
pnpm dev
```

### Step 2: If Still Failing - Use Connection Pooler

Supabase recommends using connection pooling for serverless/Next.js.

1. Go to **Supabase Dashboard** → **Settings** → **Database**
2. Find **Connection Pooling** section
3. Copy the **Connection string** (Transaction mode, port 6543)

It will look like:
```
postgresql://postgres.nxdjdkoamvertmzgslyq:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

Update `.env.local`:
```env
DATABASE_URL="postgresql://postgres.nxdjdkoamvertmzgslyq:MotebangNakin@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&schema=public"
```

### Step 3: Check Network Restrictions

1. Go to **Supabase Dashboard** → **Settings** → **Database**
2. Check **Connection Pooling** settings
3. Make sure IP restrictions allow connections (or disable for development)

### Step 4: Verify Environment Variable Loading

Add this test endpoint to check if env vars are loaded:

```typescript
// app/api/test-env/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL
  return NextResponse.json({
    hasDatabaseUrl: !!dbUrl,
    urlPreview: dbUrl ? dbUrl.substring(0, 30) + '...' : 'missing',
  })
}
```

Visit: `http://localhost:3000/api/test-env`

If `hasDatabaseUrl` is false, Next.js isn't loading `.env.local`.

## Alternative: Use Supabase Client Instead

If Prisma continues to have connection issues, you can use Supabase client for queries while keeping Prisma for migrations:

```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data, error } = await supabase.from('users').select('*')
```

