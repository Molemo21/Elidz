// Prisma Query Helpers - Production Ready
// Migrated from Supabase queries with best practices
// 
// Key improvements:
// - Full type safety with Prisma generated types
// - Consistent error handling
// - Better performance with optimized queries
// - Clearer, more maintainable code

import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

/**
 * Generic result type for all queries (matches Supabase pattern)
 */
export type QueryResult<T> = {
  success: boolean
  data?: T
  error?: string
  code?: string
}

/**
 * Prisma error handler - maps Prisma errors to consistent format
 */
function handlePrismaError<T>(error: any): QueryResult<T> {
  // Record not found (P2025)
  if (error?.code === 'P2025') {
    return { success: false, error: 'Record not found', code: 'NOT_FOUND' }
  }
  
  // Unique constraint violation (P2002)
  if (error?.code === 'P2002') {
    const field = error.meta?.target?.[0] || 'field'
    return { 
      success: false, 
      error: `Record with this ${field} already exists`, 
      code: 'DUPLICATE' 
    }
  }
  
  // Foreign key constraint violation (P2003)
  if (error?.code === 'P2003') {
    return { 
      success: false, 
      error: 'Referenced record does not exist', 
      code: 'FOREIGN_KEY' 
    }
  }
  
  // Generic error
  return {
    success: false,
    error: error?.message || 'Database operation failed',
    code: error?.code,
  }
}

// ============================================================================
// USER PROFILE QUERIES
// ============================================================================

export const userProfileQueries = {
  /**
   * Get user profile by user ID
   */
  async getByUserId(
    userId: string
  ): Promise<QueryResult<Prisma.UserProfileGetPayload<{}>>> {
    try {
      const profile = await prisma.userProfile.findUnique({
        where: { userId },
      })

      if (!profile) {
        return { success: false, error: 'Profile not found', code: 'NOT_FOUND' }
      }

      return { success: true, data: profile }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Upsert user profile (create or update)
   */
  async upsert(
    userId: string,
    profile: any // Accept any for flexibility, will be validated by caller
  ): Promise<QueryResult<Prisma.UserProfileGetPayload<{}>>> {
    try {
      const result = await prisma.userProfile.upsert({
        where: { userId },
        update: profile as Prisma.UserProfileUpdateInput,
        create: {
          userId,
          ...profile,
        } as Prisma.UserProfileCreateInput,
      })

      return { success: true, data: result }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Update user profile (partial update)
   */
  async update(
    userId: string,
    updates: Prisma.UserProfileUpdateInput
  ): Promise<QueryResult<Prisma.UserProfileGetPayload<{}>>> {
    try {
      const profile = await prisma.userProfile.update({
        where: { userId },
        data: updates,
      })

      return { success: true, data: profile }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Check if profile is complete (has all required onboarding data)
   */
  async isComplete(userId: string): Promise<boolean> {
    try {
      const result = await this.getByUserId(userId)
      if (!result.success || !result.data) return false

      const profile = result.data

      // Check required fields
      const required = [
        profile.companyName,
        profile.registrationNumber,
        profile.industry,
        profile.businessDescription,
        profile.location,
        profile.annualRevenue,
        profile.employeesCount,
        profile.yearsInBusiness,
        profile.fundingRequirements,
      ]

      if (required.some(field => field === null || field === undefined || field === '')) {
        return false
      }

      // Validate funding_requirements structure
      const fundingReqs = profile.fundingRequirements as any
      if (!fundingReqs?.amount_needed || !fundingReqs?.funding_purpose) {
        return false
      }

      return true
    } catch {
      return false
    }
  },
}

// ============================================================================
// USER QUERIES
// ============================================================================

export const userQueries = {
  /**
   * Get all users (admin only - caller must verify admin status)
   */
  async getAll(): Promise<QueryResult<Prisma.UserGetPayload<{}>[]>> {
    try {
      const users = await prisma.user.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      })

      return { success: true, data: users }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Get user by ID
   */
  async getById(
    userId: string
  ): Promise<QueryResult<Prisma.UserGetPayload<{}>>> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        return { success: false, error: 'User not found', code: 'NOT_FOUND' }
      }

      return { success: true, data: user }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Get user by email
   */
  async getByEmail(
    email: string
  ): Promise<QueryResult<Prisma.UserGetPayload<{}>>> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        return { success: false, error: 'User not found', code: 'NOT_FOUND' }
      }

      return { success: true, data: user }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Update user approval status
   */
  async updateApproval(
    userId: string,
    approved: boolean
  ): Promise<QueryResult<Prisma.UserGetPayload<{}>>> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { approved },
      })

      return { success: true, data: user }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Update user last login timestamp
   */
  async updateLastLogin(
    userId: string
  ): Promise<QueryResult<Prisma.UserGetPayload<{}>>> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { lastLogin: new Date() },
      })

      return { success: true, data: user }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },
}

// ============================================================================
// FUNDING OPPORTUNITY QUERIES
// ============================================================================

export const opportunityQueries = {
  /**
   * Get all opportunities
   */
  async getAll(): Promise<QueryResult<Prisma.FundingOpportunityGetPayload<{}>[]>> {
    try {
      const opportunities = await prisma.fundingOpportunity.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      })

      return { success: true, data: opportunities }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Get opportunity by ID
   */
  async getById(
    opportunityId: string
  ): Promise<QueryResult<Prisma.FundingOpportunityGetPayload<{}>>> {
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
      return handlePrismaError(error)
    }
  },

  /**
   * Get opportunities by industry
   */
  async getByIndustry(
    industry: string
  ): Promise<QueryResult<Prisma.FundingOpportunityGetPayload<{}>[]>> {
    try {
      const opportunities = await prisma.fundingOpportunity.findMany({
        where: {
          industryFocus: {
            has: industry, // Array contains
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return { success: true, data: opportunities }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Get active opportunities (deadline in future)
   */
  async getActive(): Promise<QueryResult<Prisma.FundingOpportunityGetPayload<{}>[]>> {
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
      return handlePrismaError(error)
    }
  },
}

// ============================================================================
// MATCH QUERIES
// ============================================================================

export const matchQueries = {
  /**
   * Get matches for user
   */
  async getByUserId(
    userId: string
  ): Promise<QueryResult<Prisma.MatchGetPayload<{}>[]>> {
    try {
      const matches = await prisma.match.findMany({
        where: { userId },
        orderBy: {
          matchScore: 'desc',
        },
      })

      return { success: true, data: matches }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Update match status
   */
  async updateStatus(
    matchId: string,
    status: string // 'new' | 'viewed' | 'interested' | 'applied'
  ): Promise<QueryResult<Prisma.MatchGetPayload<{}>>> {
    try {
      const updateData: Prisma.MatchUpdateInput = { status }
      
      // Set viewed_at when status becomes 'viewed'
      if (status === 'viewed') {
        updateData.viewedAt = new Date()
      }

      const match = await prisma.match.update({
        where: { id: matchId },
        data: updateData,
      })

      return { success: true, data: match }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },
}

// ============================================================================
// APPLICATION QUERIES
// ============================================================================

export const applicationQueries = {
  /**
   * Get applications for user
   */
  async getByUserId(
    userId: string
  ): Promise<QueryResult<Prisma.ApplicationGetPayload<{}>[]>> {
    try {
      const applications = await prisma.application.findMany({
        where: { userId },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return { success: true, data: applications }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Get application by ID
   */
  async getById(
    applicationId: string
  ): Promise<QueryResult<Prisma.ApplicationGetPayload<{}>>> {
    try {
      const application = await prisma.application.findUnique({
        where: { id: applicationId },
      })

      if (!application) {
        return {
          success: false,
          error: 'Application not found',
          code: 'NOT_FOUND',
        }
      }

      return { success: true, data: application }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Update application status
   */
  async updateStatus(
    applicationId: string,
    status: string // 'draft' | 'in_review' | 'submitted' | 'approved' | 'rejected'
  ): Promise<QueryResult<Prisma.ApplicationGetPayload<{}>>> {
    try {
      const updateData: Prisma.ApplicationUpdateInput = { status }

      if (status === 'submitted') {
        updateData.submittedAt = new Date()
      } else if (status === 'approved' || status === 'rejected') {
        updateData.reviewedAt = new Date()
      }

      const application = await prisma.application.update({
        where: { id: applicationId },
        data: updateData,
      })

      return { success: true, data: application }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },
}

