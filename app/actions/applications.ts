'use server'

import { getServerSession } from '@/lib/supabase/auth-helpers'
import { applicationQueries } from '@/lib/db/queries'
import type { ActionResponse } from './types'

export interface ApplicationData {
  opportunityId: string
  matchId?: string | null
  formData: Record<string, any>
  signature?: string | null
}

/**
 * Create or update application (SMME users)
 */
export async function saveApplication(
  data: ApplicationData,
  status: 'draft' | 'submitted' = 'draft'
): Promise<ActionResponse> {
  try {
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    // SMME users can create applications
    if (user.role !== 'smme' && user.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Only SMME users can create applications' }
    }

    // Validate UUID format for opportunityId
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(data.opportunityId)) {
      return { success: false, error: 'Invalid opportunity ID format. Please select a valid opportunity.' }
    }

    // Validate matchId if provided
    if (data.matchId && !uuidRegex.test(data.matchId)) {
      return { success: false, error: 'Invalid match ID format.' }
    }

    const result = await applicationQueries.upsert({
      userId: user.id,
      opportunityId: data.opportunityId,
      matchId: data.matchId,
      formData: data.formData,
      status,
      userEdited: true,
      signature: data.signature || null,
    })

    return result
  } catch (error: any) {
    console.error('Error saving application:', error)
    return {
      success: false,
      error: error.message || 'Failed to save application',
    }
  }
}

/**
 * Get all applications (Admin only)
 */
export async function getAllApplications(): Promise<ActionResponse> {
  try {
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    if (user.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }

    const result = await applicationQueries.getAll()
    return result
  } catch (error: any) {
    console.error('Error fetching applications:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch applications',
    }
  }
}

/**
 * Get applications for current user
 */
export async function getUserApplications(): Promise<ActionResponse> {
  try {
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    const result = await applicationQueries.getByUserId(user.id)
    return result
  } catch (error: any) {
    console.error('Error fetching user applications:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch applications',
    }
  }
}

/**
 * Update application status (Admin only)
 */
export async function updateApplicationStatus(
  applicationId: string,
  status: 'draft' | 'in_review' | 'submitted' | 'approved' | 'rejected'
): Promise<ActionResponse> {
  try {
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    if (user.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }

    const result = await applicationQueries.updateStatus(applicationId, status)
    return result
  } catch (error: any) {
    console.error('Error updating application status:', error)
    return {
      success: false,
      error: error.message || 'Failed to update application status',
    }
  }
}

