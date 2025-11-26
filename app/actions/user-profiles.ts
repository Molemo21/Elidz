'use server'

import { getServerSession } from '@/lib/supabase/auth-helpers'
import { userProfileQueries } from '@/lib/db/queries'
import { userProfileSchema, userProfileUpdateSchema } from '@/lib/validations/schemas'
import { validateWithZod } from '@/lib/validations/helpers'
import type { FundingRequirements } from '@/lib/db-schema'
import type { UserProfileResponse } from './types'

/**
 * Input type for creating/updating user profile
 * @deprecated Use UserProfileInput from lib/validations/schemas instead
 * Kept for backward compatibility
 */
export interface UserProfileInput {
  company_name: string
  registration_number: string
  industry: string
  business_description: string
  annual_revenue: number
  employees_count: number
  years_in_business: number
  location: string
  funding_requirements: FundingRequirements
}

// Re-export for convenience
export type { UserProfileInput as UserProfileInputType } from '@/lib/validations/schemas'
export type { UserProfileResponse }

/**
 * Get user's profile from database
 */
export async function getUserProfile(): Promise<UserProfileResponse> {
  try {
    // Check authentication
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Authentication required. Please log in.' }
    }

    // Use optimized query helper
    const result = await userProfileQueries.getByUserId(user.id)
    return result
  } catch (error: any) {
    // Check if this is a Next.js redirect error - if so, re-throw it
    if (error && typeof error === 'object' && 'digest' in error && error.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Error in getUserProfile:', error)
    return { success: false, error: error.message || 'Failed to fetch profile' }
  }
}

/**
 * Create a new user profile
 */
export async function createUserProfile(input: UserProfileInput): Promise<UserProfileResponse> {
  try {
    // Validate input with Zod
    const validation = validateWithZod(userProfileSchema, input)
    if (!validation.success) {
      return { success: false, error: validation.error }
    }

    // Check authentication
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Authentication required. Please log in.' }
    }

    // Use optimized query helper
    const result = await userProfileQueries.upsert(user.id, validation.data)
    return result
  } catch (error: any) {
    // Check if this is a Next.js redirect error - if so, re-throw it
    if (error && typeof error === 'object' && 'digest' in error && error.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Error in createUserProfile:', error)
    return { success: false, error: error.message || 'Failed to create profile' }
  }
}

/**
 * Update existing user profile
 */
export async function updateUserProfile(input: Partial<UserProfileInput>): Promise<UserProfileResponse> {
  try {
    // Validate input with Zod (partial schema)
    const validation = validateWithZod(userProfileUpdateSchema, input)
    if (!validation.success) {
      return { success: false, error: validation.error }
    }

    // Check authentication
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Authentication required. Please log in.' }
    }

    // Check if profile exists
    const existingResult = await userProfileQueries.getByUserId(user.id)
    
    if (existingResult.success && existingResult.data) {
      // Update existing profile
      const result = await userProfileQueries.update(user.id, validation.data)
      return result
    } else {
      // Create new profile if doesn't exist (upsert behavior)
      const result = await userProfileQueries.upsert(user.id, validation.data)
      return result
    }
  } catch (error: any) {
    // Check if this is a Next.js redirect error - if so, re-throw it
    if (error && typeof error === 'object' && 'digest' in error && error.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Error in updateUserProfile:', error)
    return { success: false, error: error.message || 'Failed to update profile' }
  }
}

/**
 * Upsert user profile (create or update in one operation)
 * This is the recommended method as it handles both cases automatically
 */
export async function upsertUserProfile(input: UserProfileInput): Promise<UserProfileResponse> {
  try {
    // Validate input with Zod
    const validation = validateWithZod(userProfileSchema, input)
    if (!validation.success) {
      return { success: false, error: validation.error }
    }

    // Check authentication
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Authentication required. Please log in.' }
    }

    // Use optimized query helper
    const result = await userProfileQueries.upsert(user.id, validation.data)
    return result
  } catch (error: any) {
    // Check if this is a Next.js redirect error - if so, re-throw it
    if (error && typeof error === 'object' && 'digest' in error && error.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Error in upsertUserProfile:', error)
    return { success: false, error: error.message || 'Failed to save profile' }
  }
}

/**
 * Check if user profile is complete (has all required onboarding data)
 * Returns true if all required fields are filled, false otherwise
 */
export async function isProfileComplete(): Promise<boolean> {
  try {
    // Check authentication
    const user = await getServerSession()
    if (!user) {
      return false
    }

    // Use optimized query helper
    return await userProfileQueries.isComplete(user.id)
  } catch (error: any) {
    console.error('Error checking profile completion:', error)
    // On error, assume incomplete to be safe
    return false
  }
}

