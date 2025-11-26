// Example: Prisma Query Helpers
// This shows how to replace Supabase queries with Prisma queries
// Compare this with lib/db/queries.ts (which uses Supabase)

import { prisma } from '../prisma'

/**
 * Generic result type (similar to Supabase query pattern)
 */
export type QueryResult<T> = {
  success: boolean
  data?: T
  error?: string
  code?: string
}

// ============================================================================
// USER QUERIES (Prisma Example)
// ============================================================================

export const userQueriesPrisma = {
  /**
   * Get all users
   */
  async getAll(): Promise<QueryResult<any[]>> {
    try {
      const users = await prisma.user.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      })

      return { success: true, data: users }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch users',
        code: error.code,
      }
    }
  },

  /**
   * Get user by ID
   */
  async getById(userId: string): Promise<QueryResult<any>> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        return { success: false, error: 'User not found', code: 'NOT_FOUND' }
      }

      return { success: true, data: user }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch user',
        code: error.code,
      }
    }
  },

  /**
   * Get user by email
   */
  async getByEmail(email: string): Promise<QueryResult<any>> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return { success: false, error: 'User not found', code: 'NOT_FOUND' }
      }

      return { success: true, data: user }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch user',
        code: error.code,
      }
    }
  },

  /**
   * Update user approval status
   */
  async updateApproval(userId: string, approved: boolean): Promise<QueryResult<any>> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { approved },
      })

      return { success: true, data: user }
    } catch (error: any) {
      // Handle Prisma not found error
      if (error.code === 'P2025') {
        return { success: false, error: 'User not found', code: 'NOT_FOUND' }
      }

      return {
        success: false,
        error: error.message || 'Failed to update user',
        code: error.code,
      }
    }
  },
}

// ============================================================================
// USER PROFILE QUERIES (Prisma Example)
// ============================================================================

export const userProfileQueriesPrisma = {
  /**
   * Get user profile by user ID
   */
  async getByUserId(userId: string): Promise<QueryResult<any>> {
    try {
      const profile = await prisma.userProfile.findUnique({
        where: { userId },
      })

      if (!profile) {
        return { success: false, error: 'Profile not found', code: 'NOT_FOUND' }
      }

      return { success: true, data: profile }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch profile',
        code: error.code,
      }
    }
  },

  /**
   * Upsert user profile (create or update)
   */
  async upsert(userId: string, profileData: any): Promise<QueryResult<any>> {
    try {
      const profile = await prisma.userProfile.upsert({
        where: { userId },
        update: profileData,
        create: {
          userId,
          ...profileData,
        },
      })

      return { success: true, data: profile }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to upsert profile',
        code: error.code,
      }
    }
  },
}

// ============================================================================
// FUNDING OPPORTUNITY QUERIES (Prisma Example)
// ============================================================================

export const opportunityQueriesPrisma = {
  /**
   * Get all opportunities
   */
  async getAll(): Promise<QueryResult<any[]>> {
    try {
      const opportunities = await prisma.fundingOpportunity.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      })

      return { success: true, data: opportunities }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch opportunities',
        code: error.code,
      }
    }
  },

  /**
   * Get opportunity by ID
   */
  async getById(opportunityId: string): Promise<QueryResult<any>> {
    try {
      const opportunity = await prisma.fundingOpportunity.findUnique({
        where: { id: opportunityId },
      })

      if (!opportunity) {
        return {
          success: false,
          error: 'Opportunity not found',
          code: 'NOT_FOUND',
        }
      }

      return { success: true, data: opportunity }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch opportunity',
        code: error.code,
      }
    }
  },

  /**
   * Get active opportunities (deadline in future)
   */
  async getActive(): Promise<QueryResult<any[]>> {
    try {
      const now = new Date()
      const opportunities = await prisma.fundingOpportunity.findMany({
        where: {
          deadline: {
            gt: now,
          },
        },
        orderBy: {
          deadline: 'asc',
        },
      })

      return { success: true, data: opportunities }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch active opportunities',
        code: error.code,
      }
    }
  },
}
