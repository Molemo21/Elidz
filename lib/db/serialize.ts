// Utility to serialize Prisma data for client components
// Converts Decimal objects to numbers, Dates to strings, etc.

/**
 * Check if value is a Prisma Decimal
 * Prisma Decimal has toNumber() and toString() methods
 */
function isDecimal(value: any): boolean {
  return value != null && 
         typeof value === 'object' && 
         typeof value.toNumber === 'function' &&
         typeof value.toString === 'function' &&
         !(value instanceof Date)
}

/**
 * Serialize a Prisma UserProfile for client components
 * Converts Decimal and other non-serializable types
 */
export function serializeUserProfile(profile: any) {
  if (!profile) return null

  return {
    ...profile,
    annualRevenue: decimalToNumber(profile.annualRevenue),
    // Keep other fields as-is
  }
}

/**
 * Serialize any Prisma result for client components
 * Recursively converts Decimal values
 */
export function serializePrismaResult<T>(data: T): T {
  if (data === null || data === undefined) return data

  if (Array.isArray(data)) {
    return data.map(serializePrismaResult) as T
  }

  if (isDecimal(data)) {
    return (data as any).toNumber() as T
  }

  if (data instanceof Date) {
    return data.toISOString() as T
  }

  if (typeof data === 'object') {
    const serialized: any = {}
    for (const [key, value] of Object.entries(data)) {
      serialized[key] = serializePrismaResult(value)
    }
    return serialized as T
  }

  return data
}

