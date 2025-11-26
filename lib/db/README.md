# Database Query Helpers

This directory contains reusable database query helpers and utilities for the application.

## Overview

The query helpers provide:
- **Type-safe queries** using generated database types
- **Consistent error handling** with user-friendly messages
- **Reusable patterns** to reduce code duplication
- **Optimized queries** with relation fetching

## Files

### `queries.ts`
Contains reusable query functions organized by entity:
- `userProfileQueries` - User profile operations
- `userQueries` - User management operations
- `opportunityQueries` - Funding opportunity operations
- `matchQueries` - Match operations
- `applicationQueries` - Application operations

### `types.ts`
Type helpers for database tables:
- `Tables<T>` - Extract Row type from a table
- `Inserts<T>` - Extract Insert type from a table
- `Updates<T>` - Extract Update type from a table
- Pre-defined types: `User`, `UserProfile`, `FundingOpportunity`, etc.

### `query-optimizer.ts`
Advanced query utilities:
- `QueryBuilder` class for optimized queries
- Relation fetching (reduces N+1 queries)
- Pagination helpers
- Batch operations
- Search utilities

## Usage Examples

### Basic Query

```typescript
import { userProfileQueries } from '@/lib/db/queries'

// Get user profile
const result = await userProfileQueries.getByUserId(userId)
if (result.success) {
  console.log(result.data)
} else {
  console.error(result.error)
}
```

### With Validation

```typescript
import { userProfileQueries } from '@/lib/db/queries'
import { userProfileSchema, validateWithZod } from '@/lib/validations/schemas'

// Validate input first
const validation = validateWithZod(userProfileSchema, input)
if (!validation.success) {
  return { success: false, error: validation.error }
}

// Then use query helper
const result = await userProfileQueries.upsert(userId, validation.data)
```

### Optimized Queries with Relations

```typescript
import { createClient } from '@/lib/supabase/server'
import { QueryBuilder } from '@/lib/db/query-optimizer'

const supabase = await createClient()
const builder = new QueryBuilder(supabase)

// Get matches with opportunity details in one query
const { data, error } = await builder.getMatchesWithOpportunities(userId)
```

## Error Handling

All query helpers return a `QueryResult<T>` type:

```typescript
type QueryResult<T> = {
  success: boolean
  data?: T
  error?: string
  code?: string  // Error code for programmatic handling
}
```

Common error codes:
- `DUPLICATE` - Unique constraint violation
- `FOREIGN_KEY` - Foreign key violation
- `NOT_FOUND` - Record not found
- `PERMISSION_DENIED` - RLS policy violation

## Best Practices

1. **Always check `success`** before accessing `data`
2. **Use validation** before database operations
3. **Use optimized queries** when fetching relations
4. **Handle error codes** for better UX
5. **Log errors** for debugging

## Type Generation

To generate types from your database:

```bash
# Using npm script (requires NEXT_PUBLIC_SUPABASE_URL in .env.local)
npm run db:types

# Or manually
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/database.types.ts
```


