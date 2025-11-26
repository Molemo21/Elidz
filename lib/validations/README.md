# Validation Schemas

This directory contains Zod validation schemas for all input types in the application.

## Overview

Zod provides:
- **Runtime validation** - Catch errors before they reach the database
- **Type inference** - Automatic TypeScript types from schemas
- **User-friendly errors** - Clear validation messages
- **Data transformation** - Clean and transform input data

## Files

### `schemas.ts`
Contains all validation schemas:
- `userProfileSchema` - User profile validation
- `userRegistrationSchema` - User registration validation
- `applicationSchema` - Application validation
- `fundingOpportunitySchema` - Funding opportunity validation
- `matchSchema` - Match validation

### `helpers.ts`
Validation utility functions:
- `validateWithZod()` - Validate and return result
- `formatZodError()` - Format errors for display
- `safeParseWithZod()` - Safe parse with full Zod result

## Usage Examples

### Basic Validation

```typescript
import { userProfileSchema, validateWithZod } from '@/lib/validations/schemas'

const validation = validateWithZod(userProfileSchema, input)
if (!validation.success) {
  return { success: false, error: validation.error }
}

// validation.data is now type-safe and validated
const result = await userProfileQueries.upsert(userId, validation.data)
```

### In Server Actions

```typescript
'use server'

import { userProfileSchema, validateWithZod } from '@/lib/validations/schemas'

export async function upsertUserProfile(input: unknown) {
  // Validate input
  const validation = validateWithZod(userProfileSchema, input)
  if (!validation.success) {
    return { success: false, error: validation.error }
  }

  // Use validated data
  // ...
}
```

### Partial Validation

```typescript
import { userProfileUpdateSchema, validateWithZod } from '@/lib/validations/schemas'

// For partial updates, all fields are optional
const validation = validateWithZod(userProfileUpdateSchema, partialInput)
```

## Schema Features

### String Validation
- Min/max length
- Trim whitespace
- Email format
- URL format
- Regex patterns

### Number Validation
- Min/max values
- Integer checks
- Positive number checks

### Array Validation
- Min/max length
- Element validation

### Custom Validation
- Cross-field validation (e.g., max >= min)
- Date validation (future dates)
- Enum validation

## Error Messages

All schemas include user-friendly error messages:

```typescript
z.string().min(1, 'Company name is required')
z.number().min(0, 'Annual revenue must be positive')
z.string().email('Invalid email address')
```

## Type Inference

Schemas automatically infer TypeScript types:

```typescript
import type { UserProfileInput } from '@/lib/validations/schemas'

// UserProfileInput is automatically inferred from userProfileSchema
const input: UserProfileInput = {
  company_name: '...',
  // TypeScript knows all required fields
}
```

## Best Practices

1. **Validate early** - Validate inputs at the API boundary
2. **Use specific schemas** - Create schemas for each use case
3. **Provide clear errors** - Write helpful error messages
4. **Transform data** - Use Zod's transform for data cleaning
5. **Reuse schemas** - Create base schemas and extend them


