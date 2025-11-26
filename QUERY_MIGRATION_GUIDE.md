# Query Migration Guide: Supabase → Prisma

This guide shows side-by-side comparisons and best practices for migrating from Supabase to Prisma.

## 📊 Query Pattern Comparison

### 1. **Find Many (Get All)**

**Supabase:**
```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .order('created_at', { ascending: false })
```

**Prisma (Best Practice):**
```typescript
const users = await prisma.user.findMany({
  orderBy: { createdAt: 'desc' },
})
```

**Key Differences:**
- ✅ Prisma: More concise, type-safe
- ✅ Prisma: Uses `orderBy` object instead of separate method
- ✅ Prisma: No error/data destructuring needed

---

### 2. **Find Unique (Get One)**

**Supabase:**
```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .maybeSingle() // Returns null if not found
```

**Prisma (Best Practice):**
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
})
// Returns null if not found
```

**Key Differences:**
- ✅ Prisma: `findUnique` is clearer intent
- ✅ Prisma: No `.maybeSingle()` needed - returns null automatically
- ✅ Prisma: Uses `where` clause consistently

---

### 3. **Filter Queries**

**Supabase:**
```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('role', 'admin')
  .eq('approved', true)
```

**Prisma (Best Practice):**
```typescript
const users = await prisma.user.findMany({
  where: {
    role: 'admin',
    approved: true,
  },
})
```

**Key Differences:**
- ✅ Prisma: All filters in one `where` object
- ✅ Prisma: More readable and maintainable
- ✅ Prisma: Better TypeScript autocomplete

---

### 4. **Array Filters (Contains)**

**Supabase:**
```typescript
const { data, error } = await supabase
  .from('funding_opportunities')
  .select('*')
  .contains('industry_focus', [industry])
```

**Prisma (Best Practice):**
```typescript
const opportunities = await prisma.fundingOpportunity.findMany({
  where: {
    industryFocus: {
      has: industry, // Array contains
    },
  },
})
```

**Key Differences:**
- ✅ Prisma: Uses `has` for array contains
- ✅ Prisma: Also supports `hasEvery`, `hasSome`

---

### 5. **Date Comparisons**

**Supabase:**
```typescript
const now = new Date().toISOString()
const { data, error } = await supabase
  .from('funding_opportunities')
  .select('*')
  .gt('deadline', now)
```

**Prisma (Best Practice):**
```typescript
const opportunities = await prisma.fundingOpportunity.findMany({
  where: {
    deadline: {
      gt: new Date(), // Prisma handles Date objects directly
    },
  },
})
```

**Key Differences:**
- ✅ Prisma: No need to convert to ISO string
- ✅ Prisma: Type-safe date operations
- ✅ Prisma: Supports `gt`, `gte`, `lt`, `lte`, etc.

---

### 6. **Updates**

**Supabase:**
```typescript
const { data, error } = await supabase
  .from('users')
  .update({ approved: true })
  .eq('id', userId)
  .select()
  .single()
```

**Prisma (Best Practice):**
```typescript
const user = await prisma.user.update({
  where: { id: userId },
  data: { approved: true },
})
```

**Key Differences:**
- ✅ Prisma: Throws error if not found (use `updateMany` if you want silent failure)
- ✅ Prisma: No need for `.select().single()` - returns updated record
- ✅ Prisma: More concise

---

### 7. **Upsert (Create or Update)**

**Supabase:**
```typescript
const { data, error } = await supabase
  .from('user_profiles')
  .upsert(
    { ...profile, user_id: userId },
    { onConflict: 'user_id' }
  )
  .select()
  .single()
```

**Prisma (Best Practice):**
```typescript
const profile = await prisma.userProfile.upsert({
  where: { userId },
  update: profile,
  create: {
    userId,
    ...profile,
  },
})
```

**Key Differences:**
- ✅ Prisma: Clear separation of `update` and `create` logic
- ✅ Prisma: More explicit about what happens in each case
- ✅ Prisma: Type-safe

---

### 8. **Select Specific Fields**

**Supabase:**
```typescript
const { data, error } = await supabase
  .from('users')
  .select('id, email, first_name, last_name')
```

**Prisma (Best Practice):**
```typescript
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
  },
})
```

**Key Differences:**
- ✅ Prisma: Type-safe field selection
- ✅ Prisma: Autocomplete for available fields
- ✅ Prisma: Can include relations

---

### 9. **Relations (Joins)**

**Supabase:**
```typescript
const { data, error } = await supabase
  .from('users')
  .select(`
    *,
    profile:user_profiles(*)
  `)
```

**Prisma (Best Practice):**
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    profile: true,
  },
})
```

**Key Differences:**
- ✅ Prisma: Type-safe relations
- ✅ Prisma: Nested includes for deep relations
- ✅ Prisma: Better performance with query optimization

---

### 10. **Error Handling**

**Supabase:**
```typescript
const { data, error } = await supabase.from('users').select('*')
if (error) {
  // Handle error
  return { success: false, error: error.message }
}
```

**Prisma (Best Practice):**
```typescript
try {
  const users = await prisma.user.findMany()
  return { success: true, data: users }
} catch (error) {
  // Handle specific Prisma errors
  if (error.code === 'P2025') {
    return { success: false, error: 'Record not found', code: 'NOT_FOUND' }
  }
  return { success: false, error: error.message }
}
```

**Key Differences:**
- ✅ Prisma: Uses try/catch (more standard)
- ✅ Prisma: Specific error codes (P2025 = not found, P2002 = unique constraint, etc.)
- ✅ Prisma: Better error types

---

## 🎯 Best Practices Checklist

### ✅ Type Safety
- [ ] Use Prisma generated types
- [ ] Avoid `any` - use specific types
- [ ] Leverage TypeScript autocomplete

### ✅ Error Handling
- [ ] Wrap queries in try/catch
- [ ] Handle Prisma error codes
- [ ] Return consistent error format

### ✅ Performance
- [ ] Use `select` to limit fields
- [ ] Use `include` strategically for relations
- [ ] Add indexes for common queries

### ✅ Readability
- [ ] Use descriptive variable names
- [ ] Group related queries
- [ ] Add comments for complex queries

### ✅ Maintainability
- [ ] Keep query functions focused
- [ ] Reuse common patterns
- [ ] Document complex logic

---

## 📝 Common Prisma Error Codes

| Code | Meaning | When It Happens |
|------|---------|----------------|
| `P2025` | Record not found | Update/delete on non-existent record |
| `P2002` | Unique constraint violation | Creating duplicate unique field |
| `P2003` | Foreign key constraint | Referencing non-existent record |
| `P2014` | Required relation missing | Creating record without required relation |

---

## 🚀 Migration Strategy

1. **Start with read queries** (findMany, findUnique)
2. **Move to simple writes** (create, update)
3. **Handle complex operations** (upsert, transactions)
4. **Add relations** (include, nested queries)
5. **Optimize** (select, indexes, query analysis)

---

## 📚 Next Steps

1. ✅ Review this comparison guide
2. ⏭️ Migrate `lib/db/queries.ts` to Prisma
3. ⏭️ Update all imports throughout the app
4. ⏭️ Test thoroughly
5. ⏭️ Remove Supabase dependencies

