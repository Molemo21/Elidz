'use server'

import { getServerSession, requireAdmin } from '@/lib/supabase/auth-helpers'
import { opportunityQueries } from '@/lib/db/queries'
import { fundingOpportunitySchema, opportunitySearchSchema } from '@/lib/validations/schemas'
import { validateWithZod } from '@/lib/validations/helpers'
import type { ActionResponse } from './types'
import type { FundingOpportunityInput, OpportunitySearchInput } from '@/lib/validations/schemas'

/**
 * Get all active funding opportunities
 */
export async function getAllOpportunities(): Promise<ActionResponse> {
  try {
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    const result = await opportunityQueries.getActive()
    return result
  } catch (error: any) {
    console.error('Error fetching opportunities:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch opportunities',
    }
  }
}

/**
 * Get opportunity by ID
 */
export async function getOpportunityById(opportunityId: string): Promise<ActionResponse> {
  try {
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(opportunityId)) {
      return { success: false, error: 'Invalid opportunity ID format' }
    }

    const result = await opportunityQueries.getById(opportunityId)
    return result
  } catch (error: any) {
    console.error('Error fetching opportunity:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch opportunity',
    }
  }
}

/**
 * Search opportunities by filters
 */
export async function searchOpportunities(filters: OpportunitySearchInput): Promise<ActionResponse> {
  try {
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    // Validate filters
    const validation = validateWithZod(opportunitySearchSchema, filters)
    if (!validation.success) {
      return { success: false, error: validation.error }
    }

    // Transform filters for query
    const queryFilters: any = {}
    if (validation.data.industry) queryFilters.industry = validation.data.industry
    if (validation.data.minAmount !== undefined) queryFilters.minAmount = validation.data.minAmount
    if (validation.data.maxAmount !== undefined) queryFilters.maxAmount = validation.data.maxAmount
    if (validation.data.fundingType) queryFilters.fundingType = validation.data.fundingType
    if (validation.data.deadlineAfter) {
      queryFilters.deadlineAfter = new Date(validation.data.deadlineAfter)
    }

    const result = await opportunityQueries.getByFilters(queryFilters)
    return result
  } catch (error: any) {
    console.error('Error searching opportunities:', error)
    return {
      success: false,
      error: error.message || 'Failed to search opportunities',
    }
  }
}

/**
 * Create new funding opportunity (Admin only)
 */
export async function createOpportunity(data: FundingOpportunityInput): Promise<ActionResponse> {
  try {
    await requireAdmin()

    // Validate input
    const validation = validateWithZod(fundingOpportunitySchema, data)
    if (!validation.success) {
      return { success: false, error: validation.error }
    }

    // Transform to Prisma format
    const prismaData = {
      funderName: validation.data.funder_name,
      programName: validation.data.program_name,
      description: validation.data.description,
      amountRangeMin: validation.data.amount_range_min,
      amountRangeMax: validation.data.amount_range_max,
      eligibilityCriteria: validation.data.eligibility_criteria,
      applicationUrl: validation.data.application_url,
      deadline: new Date(validation.data.deadline),
      industryFocus: validation.data.industry_focus,
      fundingType: validation.data.funding_type,
      requirements: validation.data.requirements,
    }

    const result = await opportunityQueries.create(prismaData)
    
    // Ensure the result is properly formatted
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data,
      }
    }
    
    return {
      success: false,
      error: result.error || 'Failed to create opportunity',
    }
  } catch (error: any) {
    console.error('Error creating opportunity:', error)
    // Ensure error message is a string
    const errorMessage = error?.message || error?.toString() || 'Failed to create opportunity'
    return {
      success: false,
      error: typeof errorMessage === 'string' ? errorMessage : 'Failed to create opportunity',
    }
  }
}

/**
 * Update funding opportunity (Admin only)
 */
export async function updateOpportunity(
  id: string,
  data: Partial<FundingOpportunityInput>
): Promise<ActionResponse> {
  try {
    await requireAdmin()

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return { success: false, error: 'Invalid opportunity ID format' }
    }

    // Validate input (partial schema)
    const partialSchema = fundingOpportunitySchema.partial()
    const validation = validateWithZod(partialSchema, data)
    if (!validation.success) {
      return { success: false, error: validation.error }
    }

    // Transform to Prisma format
    const prismaData: any = {}
    if (validation.data.funder_name) prismaData.funderName = validation.data.funder_name
    if (validation.data.program_name) prismaData.programName = validation.data.program_name
    if (validation.data.description) prismaData.description = validation.data.description
    if (validation.data.amount_range_min !== undefined) prismaData.amountRangeMin = validation.data.amount_range_min
    if (validation.data.amount_range_max !== undefined) prismaData.amountRangeMax = validation.data.amount_range_max
    if (validation.data.eligibility_criteria) prismaData.eligibilityCriteria = validation.data.eligibility_criteria
    if (validation.data.application_url) prismaData.applicationUrl = validation.data.application_url
    if (validation.data.deadline) prismaData.deadline = new Date(validation.data.deadline)
    if (validation.data.industry_focus) prismaData.industryFocus = validation.data.industry_focus
    if (validation.data.funding_type) prismaData.fundingType = validation.data.funding_type
    if (validation.data.requirements) prismaData.requirements = validation.data.requirements

    const result = await opportunityQueries.update(id, prismaData)
    return result
  } catch (error: any) {
    console.error('Error updating opportunity:', error)
    return {
      success: false,
      error: error.message || 'Failed to update opportunity',
    }
  }
}

/**
 * Delete funding opportunity (Admin only)
 */
export async function deleteOpportunity(id: string): Promise<ActionResponse> {
  try {
    await requireAdmin()

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return { success: false, error: 'Invalid opportunity ID format' }
    }

    const result = await opportunityQueries.delete(id)
    return result
  } catch (error: any) {
    console.error('Error deleting opportunity:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete opportunity',
    }
  }
}

