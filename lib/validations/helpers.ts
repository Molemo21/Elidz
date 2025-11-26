// Validation helper functions
// These provide utilities for validating data with Zod

import { z } from 'zod'
import type { ZodError } from 'zod'

/**
 * Format Zod errors into a user-friendly string
 */
export function formatZodError(error: ZodError): string {
  return error.errors
    .map(err => {
      const path = err.path.join('.')
      return path ? `${path}: ${err.message}` : err.message
    })
    .join(', ')
}

/**
 * Validate data against a Zod schema
 * Returns a result object with success flag and either data or error
 */
export function validateWithZod<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: formatZodError(error) }
    }
    return { success: false, error: 'Validation failed' }
  }
}

/**
 * Safe parse - returns the result object directly from Zod
 * Useful when you want more control over error handling
 */
export function safeParseWithZod<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): z.SafeParseReturnType<unknown, T> {
  return schema.safeParse(data)
}

/**
 * Validate and transform data
 * Useful for cleaning/transforming input data during validation
 */
export function validateAndTransform<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  } else {
    return { success: false, error: formatZodError(result.error) }
  }
}


