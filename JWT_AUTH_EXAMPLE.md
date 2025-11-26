# JWT Authentication & Prisma Setup - Examples & Guide

This document explains the JWT authentication examples and Prisma setup that have been added to your codebase.

## 📁 Files Created

### Prisma Setup
- `prisma/schema.prisma` - Prisma schema matching your Supabase database
- `lib/prisma.ts` - Prisma client singleton utility
- `PRISMA_SETUP.md` - Detailed setup instructions

### JWT Authentication Services
- `lib/auth-jwt.ts` - Simple JWT authentication service (manual JWT handling)
- `lib/auth-nextauth.ts` - NextAuth.js configuration (recommended for production)

### API Routes (Examples)
- `app/api/auth/[...nextauth]/route.ts` - NextAuth.js API handler
- `app/api/auth/jwt/login/route.ts` - Simple JWT login endpoint
- `app/api/auth/jwt/register/route.ts` - Simple JWT register endpoint
- `app/api/auth/jwt/me/route.ts` - Get current user from JWT token

### Database Query Examples
- `lib/db/queries-prisma-example.ts` - Example Prisma queries (compare with `lib/db/queries.ts`)
- `app/api/examples/prisma-users/route.ts` - Example API route using Prisma

## 🚀 Quick Start

### 1. Set Up Environment Variables

Add to your `.env.local`:

```env
# Database connection (get from Supabase: Settings → Database → Connection string)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?schema=public"

# JWT Secret (generate a random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-change-this-in-production"
```

Generate secrets:
```bash
# On macOS/Linux:
openssl rand -base64 32

# Or use any random string generator
```

### 2. Add Password Hash Column

Run this SQL in Supabase SQL Editor:

```sql
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS password_hash TEXT;
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Test the Connection

```bash
# Test Prisma connection
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.user.findMany().then(u => console.log('Connected! Found', u.length, 'users')).catch(e => console.error('Error:', e.message)).finally(() => prisma.\$disconnect())"
```

## 🔐 Two Authentication Approaches

### Option 1: Simple JWT Service (lib/auth-jwt.ts)

**Pros:**
- Full control over JWT implementation
- Simple and lightweight
- Easy to customize

**Cons:**
- Manual token management
- No built-in session handling
- Need to handle refresh tokens yourself

**Usage:**

```typescript
import { JWTAuthService } from '@/lib/auth-jwt'

// Login
const { user, token } = await JWTAuthService.login(email, password)

// Register
const { user, token } = await JWTAuthService.register({
  email,
  password,
  firstName,
  lastName,
  phone,
  role: 'smme',
})

// Verify token
const user = await JWTAuthService.verifyToken(token)

// Get current user
const user = await JWTAuthService.getCurrentUser(userId)
```

**API Endpoints:**
- `POST /api/auth/jwt/login` - Login
- `POST /api/auth/jwt/register` - Register
- `GET /api/auth/jwt/me` - Get current user (requires `Authorization: Bearer <token>`)

### Option 2: NextAuth.js (Recommended - lib/auth-nextauth.ts)

**Pros:**
- Industry-standard solution
- Automatic session management
- Built-in CSRF protection
- Cookie-based sessions (more secure)
- Easy to add OAuth providers later

**Cons:**
- Slightly more setup
- Uses cookies instead of simple tokens

**Usage:**

```typescript
// Server Components / API Routes
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-nextauth'

const session = await getServerSession(authOptions)
if (session?.user) {
  // User is authenticated
  console.log(session.user.id, session.user.email)
}

// Client Components
import { useSession } from 'next-auth/react'

function MyComponent() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') return <div>Loading...</div>
  if (status === 'unauthenticated') return <div>Not logged in</div>
  
  return <div>Hello {session?.user?.name}</div>
}
```

**API Endpoints (automatic):**
- `GET/POST /api/auth/signin` - Sign in page
- `GET/POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session
- `GET /api/auth/csrf` - CSRF token

## 📊 Prisma Queries vs Supabase Queries

### Before (Supabase):
```typescript
const supabase = await createClient()
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single()
```

### After (Prisma):
```typescript
import { prisma } from '@/lib/prisma'

const user = await prisma.user.findUnique({
  where: { id: userId },
})
```

### Compare Examples:

- **Supabase queries:** `lib/db/queries.ts`
- **Prisma queries:** `lib/db/queries-prisma-example.ts`

## 🧪 Testing the Examples

### Test Prisma Connection:
```bash
# Visit this URL in browser or use curl:
curl http://localhost:3000/api/examples/prisma-users
```

### Test JWT Login (Simple):
```bash
curl -X POST http://localhost:3000/api/auth/jwt/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test NextAuth.js:
```bash
# Visit in browser:
http://localhost:3000/api/auth/signin
```

## 🔄 Migration Strategy

### Phase 1: Set Up (Done ✅)
- [x] Prisma installed and configured
- [x] JWT auth services created
- [x] Example API routes created

### Phase 2: Testing (Your Turn)
1. Set up environment variables
2. Add `password_hash` column to database
3. Generate Prisma client: `npx prisma generate`
4. Test Prisma queries
5. Test JWT authentication

### Phase 3: Gradual Migration
1. Start using Prisma for new features
2. Migrate one query file at a time
3. Test thoroughly before moving to next file
4. Keep Supabase Auth working during transition

### Phase 4: Full Migration
1. Replace all Supabase queries with Prisma
2. Migrate users from Supabase Auth to JWT
3. Remove Supabase dependencies
4. Clean up old code

## 📝 Next Steps

1. **Read `PRISMA_SETUP.md`** for detailed setup instructions
2. **Configure environment variables** (DATABASE_URL, JWT_SECRET, etc.)
3. **Add password_hash column** to your database
4. **Test Prisma connection** using the example API route
5. **Choose authentication approach:**
   - Simple JWT (`lib/auth-jwt.ts`) for full control
   - NextAuth.js (`lib/auth-nextauth.ts`) for production-ready solution
6. **Replace queries gradually** - start with one file at a time

## 🆘 Common Issues

### "Can't reach database server"
- Check DATABASE_URL is correct
- Verify Supabase project is active
- Check IP whitelist in Supabase settings

### "Schema does not match"
- Run `npx prisma db pull` to sync schema
- Or manually update `prisma/schema.prisma`

### "User not found" when logging in
- User might not have `password_hash` yet
- They're still using Supabase Auth
- Need to migrate password or create new account

## 💡 Tips

- **Keep both systems running** during migration
- **Test thoroughly** before removing Supabase code
- **Use Prisma Studio** for database inspection: `npx prisma studio`
- **Compare queries side-by-side** using the example files

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [JWT.io](https://jwt.io/) - Debug JWT tokens
- [Prisma Studio](https://www.prisma.io/studio) - Database GUI

