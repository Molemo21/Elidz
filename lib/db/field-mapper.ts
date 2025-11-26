// Field name mapper: snake_case (validation) <-> camelCase (Prisma)
// Converts between database column names (snake_case) and Prisma model fields (camelCase)

/**
 * Convert snake_case to camelCase
 */
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Convert camelCase to snake_case
 */
function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

/**
 * Transform object keys from snake_case to camelCase
 */
export function toPrismaFormat<T extends Record<string, any>>(data: T): any {
  if (!data || typeof data !== 'object') return data

  if (Array.isArray(data)) {
    return data.map(item => toPrismaFormat(item))
  }

  const transformed: any = {}
  for (const [key, value] of Object.entries(data)) {
    const camelKey = snakeToCamel(key)
    
    // Handle nested objects (like funding_requirements)
    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      transformed[camelKey] = toPrismaFormat(value)
    } else {
      transformed[camelKey] = value
    }
  }
  
  return transformed
}

/**
 * Transform object keys from camelCase to snake_case
 */
export function fromPrismaFormat<T extends Record<string, any>>(data: T): any {
  if (!data || typeof data !== 'object') return data

  if (Array.isArray(data)) {
    return data.map(item => fromPrismaFormat(item))
  }

  const transformed: any = {}
  for (const [key, value] of Object.entries(data)) {
    const snakeKey = camelToSnake(key)
    
    // Handle nested objects
    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      transformed[snakeKey] = fromPrismaFormat(value)
    } else {
      transformed[snakeKey] = value
    }
  }
  
  return transformed
}

/**
 * User profile field mapping: validation (snake_case) -> Prisma (camelCase)
 */
export const userProfileFieldMap: Record<string, string> = {
  company_name: 'companyName',
  registration_number: 'registrationNumber',
  business_description: 'businessDescription',
  annual_revenue: 'annualRevenue',
  employees_count: 'employeesCount',
  years_in_business: 'yearsInBusiness',
  funding_requirements: 'fundingRequirements',
}

/**
 * Transform user profile data from validation format to Prisma format
 */
export function transformUserProfileToPrisma(data: any): any {
  if (!data || typeof data !== 'object') return data

  const transformed: any = {}
  
  for (const [key, value] of Object.entries(data)) {
    const prismaKey = userProfileFieldMap[key] || snakeToCamel(key)
    
    // Special handling for nested objects
    if (key === 'funding_requirements' && value && typeof value === 'object') {
      transformed[prismaKey] = value // Keep as-is (already in correct format)
    } else {
      transformed[prismaKey] = value
    }
  }
  
  return transformed
}

