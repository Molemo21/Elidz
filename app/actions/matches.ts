'use server'

import { getServerSession } from '@/lib/supabase/auth-helpers'
import { matchQueries } from '@/lib/db/queries'
import { MatchingService } from '@/lib/services/matching-service'
import type { ActionResponse } from './types'

/**
 * Get matches for current user
 */
export async function getUserMatches(): Promise<ActionResponse> {
  try {
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    const result = await matchQueries.getByUserId(user.id)
    return result
  } catch (error: any) {
    console.error('Error fetching matches:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch matches',
    }
  }
}

/**
 * Get match by ID
 */
export async function getMatchById(matchId: string): Promise<ActionResponse> {
  try {
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(matchId)) {
      return { success: false, error: 'Invalid match ID format' }
    }

    const result = await matchQueries.getByUserId(user.id)
    if (!result.success || !result.data) {
      return { success: false, error: 'Match not found' }
    }

    // Find the specific match
    const match = result.data.find((m: any) => m.id === matchId)
    if (!match) {
      return { success: false, error: 'Match not found' }
    }

    return { success: true, data: match }
  } catch (error: any) {
    console.error('Error fetching match:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch match',
    }
  }
}

/**
 * Update match status
 */
export async function updateMatchStatus(
  matchId: string,
  status: 'new' | 'viewed' | 'interested' | 'applied'
): Promise<ActionResponse> {
  try {
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(matchId)) {
      return { success: false, error: 'Invalid match ID format' }
    }

    // Verify match belongs to user
    const matchesResult = await matchQueries.getByUserId(user.id)
    if (!matchesResult.success || !matchesResult.data) {
      return { success: false, error: 'Match not found' }
    }

    const match = matchesResult.data.find((m: any) => m.id === matchId)
    if (!match) {
      return { success: false, error: 'Match not found or unauthorized' }
    }

    const result = await matchQueries.updateStatus(matchId, status)
    return result
  } catch (error: any) {
    console.error('Error updating match status:', error)
    return {
      success: false,
      error: error.message || 'Failed to update match status',
    }
  }
}

/**
 * Mark match as viewed
 */
export async function markMatchAsViewed(matchId: string): Promise<ActionResponse> {
  try {
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(matchId)) {
      return { success: false, error: 'Invalid match ID format' }
    }

    // Verify match belongs to user
    const matchesResult = await matchQueries.getByUserId(user.id)
    if (!matchesResult.success || !matchesResult.data) {
      return { success: false, error: 'Match not found' }
    }

    const match = matchesResult.data.find((m: any) => m.id === matchId)
    if (!match) {
      return { success: false, error: 'Match not found or unauthorized' }
    }

    const result = await matchQueries.markAsViewed(matchId)
    return result
  } catch (error: any) {
    console.error('Error marking match as viewed:', error)
    return {
      success: false,
      error: error.message || 'Failed to mark match as viewed',
    }
  }
}

/**
 * Get unread match count for current user
 */
export async function getUnreadMatchCount(): Promise<ActionResponse<number>> {
  try {
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    const result = await matchQueries.getUnviewedCount(user.id)
    return result
  } catch (error: any) {
    console.error('Error fetching unread match count:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch unread match count',
    }
  }
}

/**
 * Generate matches for current user (internal use - called after profile save)
 * This triggers the AI matching process
 */
export async function generateMatchesForUser(): Promise<ActionResponse<{ matchesCreated: number }>> {
  try {
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    // Only generate matches for approved users
    if (!user.approved) {
      return { success: false, error: 'User must be approved to generate matches' }
    }

    const result = await MatchingService.generateMatchesForUser(user.id)
    
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to generate matches' }
    }

    return { 
      success: true, 
      data: { matchesCreated: result.matchesCreated } 
    }
  } catch (error: any) {
    console.error('Error generating matches:', error)
    return {
      success: false,
      error: error.message || 'Failed to generate matches',
    }
  }
}

