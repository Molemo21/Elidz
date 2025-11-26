'use server'

import { getServerSession } from '@/lib/supabase/auth-helpers'
import { userQueries } from '@/lib/db/queries'
import type { UserManagementResponse } from './types'

// Re-export for backward compatibility
export type { UserManagementResponse }

/**
 * Get all users (Admin only)
 * Returns list of all registered users with their details
 */
export async function getAllUsers(): Promise<UserManagementResponse> {
  try {
    // Check authentication and admin status
    const user = await getServerSession()
    if (!user) {
      return { 
        success: false, 
        error: 'Unauthorized: Please log in. If you just logged in, try refreshing the page or logging out and back in.' 
      }
    }

    // Verify user is admin
    if (user.role !== 'admin') {
      console.warn('[getAllUsers] Non-admin user attempted access:', user.email)
      return { success: false, error: 'Unauthorized: Admin access required' }
    }
    
    // Use optimized query helper
    const result = await userQueries.getAll()
    return result
  } catch (error: any) {
    // Handle redirect errors
    if (error.message?.includes('redirect') || error.message?.includes('NEXT_REDIRECT')) {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }
    
    console.error('Unexpected error in getAllUsers:', error)
    return { success: false, error: error.message || 'Failed to fetch users' }
  }
}

/**
 * Get user by ID (Admin only)
 */
export async function getUserById(userId: string): Promise<UserManagementResponse> {
  try {
    // Check authentication and admin status
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    if (user.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }

    // Use optimized query helper
    const result = await userQueries.getById(userId)
    return result
  } catch (error: any) {
    console.error('Error in getUserById:', error)
    return { success: false, error: error.message || 'Failed to fetch user' }
  }
}

/**
 * Approve user (Admin only)
 * Sets approved = true for the specified user
 */
export async function approveUser(userId: string): Promise<UserManagementResponse> {
  try {
    // Check authentication and admin status
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    if (user.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }

    // First verify user exists and check current status
    const existingResult = await userQueries.getById(userId)
    if (!existingResult.success || !existingResult.data) {
      return { success: false, error: existingResult.error || 'User not found' }
    }

    if (existingResult.data.approved) {
      return { success: false, error: 'User is already approved' }
    }

    // Use optimized query helper
    const result = await userQueries.updateApproval(userId, true)
    return result
  } catch (error: any) {
    console.error('Error in approveUser:', error)
    return { success: false, error: error.message || 'Failed to approve user' }
  }
}

/**
 * Decline user (Admin only)
 * Sets approved = false for the specified user
 */
export async function declineUser(userId: string): Promise<UserManagementResponse> {
  try {
    // Check authentication and admin status
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    if (user.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }

    // Verify user exists
    const existingResult = await userQueries.getById(userId)
    if (!existingResult.success || !existingResult.data) {
      return { success: false, error: existingResult.error || 'User not found' }
    }

    // Use optimized query helper
    const result = await userQueries.updateApproval(userId, false)
    return result
  } catch (error: any) {
    console.error('Error in declineUser:', error)
    return { success: false, error: error.message || 'Failed to decline user' }
  }
}

/**
 * Update user approval status (Admin only)
 * Generic function to set approved status
 */
export async function updateUserApproval(
  userId: string, 
  approved: boolean
): Promise<UserManagementResponse> {
  try {
    // Check authentication and admin status
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    if (user.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }

    // Use optimized query helper
    const result = await userQueries.updateApproval(userId, approved)
    return result
  } catch (error: any) {
    console.error('Error in updateUserApproval:', error)
    return { success: false, error: error.message || 'Failed to update user approval' }
  }
}

