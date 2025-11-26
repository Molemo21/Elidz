// Prisma Query Helpers - Production Ready
// Migrated from Supabase to Prisma with best practices
// 
// Key improvements:
// - Full type safety with Prisma generated types
// - Consistent error handling
// - Better performance with optimized queries
// - Clearer, more maintainable code
// - No RLS restrictions - access control handled in application code

import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { transformUserProfileToPrisma } from './field-mapper'
import { serializePrismaResult } from './serialize'

/**
 * Generic result type for all queries
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

      // Serialize Decimal values for client components
      return { success: true, data: serializePrismaResult(profile) }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Upsert user profile (create or update)
   * Transforms snake_case validation data to camelCase Prisma format
   */
  async upsert(
    userId: string,
    profile: any // Accept any for flexibility, validated by caller (snake_case format)
  ): Promise<QueryResult<Prisma.UserProfileGetPayload<{}>>> {
    try {
      // Transform from validation format (snake_case) to Prisma format (camelCase)
      const prismaProfile = transformUserProfileToPrisma(profile)
      
      const result = await prisma.userProfile.upsert({
        where: { userId },
        update: prismaProfile as Prisma.UserProfileUpdateInput,
        create: {
          userId,
          ...prismaProfile,
        } as Prisma.UserProfileCreateInput,
      })

      // Serialize Decimal values for client components
      return { success: true, data: serializePrismaResult(result) }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Update user profile (partial update)
   * Transforms snake_case validation data to camelCase Prisma format
   */
  async update(
    userId: string,
    updates: any // Accept any for flexibility (snake_case or camelCase)
  ): Promise<QueryResult<Prisma.UserProfileGetPayload<{}>>> {
    try {
      // Transform from validation format (snake_case) to Prisma format (camelCase)
      const prismaUpdates = transformUserProfileToPrisma(updates)
      
      const profile = await prisma.userProfile.update({
        where: { userId },
        data: prismaUpdates as Prisma.UserProfileUpdateInput,
      })

      // Serialize Decimal values for client components
      return { success: true, data: serializePrismaResult(profile) }
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
   * Returns users with password_hash included (for checking if password is set)
   */
  async getAll(): Promise<QueryResult<Prisma.UserGetPayload<{}>[]>> {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          passwordHash: true, // Include to check if password is set
          role: true,
          firstName: true,
          lastName: true,
          phone: true,
          approved: true,
          createdAt: true,
          lastLogin: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      // Map Prisma field names to database field names for client
      const mappedUsers = users.map(user => ({
        id: user.id,
        email: user.email,
        password_hash: user.passwordHash, // Map to snake_case for client
        role: user.role,
        first_name: user.firstName,
        last_name: user.lastName,
        phone: user.phone,
        approved: user.approved,
        created_at: user.createdAt.toISOString(),
        last_login: user.lastLogin?.toISOString() || null,
      }))

      return { success: true, data: mappedUsers as any }
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

      // Serialize Decimal values for client components
      return { success: true, data: serializePrismaResult(opportunities) }
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

      // Serialize Decimal values for client components
      return { success: true, data: serializePrismaResult(opportunity) }
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

      // Serialize Decimal values for client components
      return { success: true, data: serializePrismaResult(opportunities) }
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

      // Serialize Decimal values for client components
      return { success: true, data: serializePrismaResult(opportunities) }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Create new funding opportunity (admin only - caller must verify admin status)
   */
  async create(
    data: Prisma.FundingOpportunityCreateInput
  ): Promise<QueryResult<Prisma.FundingOpportunityGetPayload<{}>>> {
    try {
      const opportunity = await prisma.fundingOpportunity.create({
        data,
      })

      // Serialize Decimal values for client components
      return { success: true, data: serializePrismaResult(opportunity) }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Update funding opportunity (admin only - caller must verify admin status)
   */
  async update(
    id: string,
    data: Prisma.FundingOpportunityUpdateInput
  ): Promise<QueryResult<Prisma.FundingOpportunityGetPayload<{}>>> {
    try {
      const opportunity = await prisma.fundingOpportunity.update({
        where: { id },
        data,
      })

      // Serialize Decimal values for client components
      return { success: true, data: serializePrismaResult(opportunity) }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Delete funding opportunity (admin only - caller must verify admin status)
   */
  async delete(id: string): Promise<QueryResult<void>> {
    try {
      await prisma.fundingOpportunity.delete({
        where: { id },
      })

      return { success: true }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Get opportunities by filters
   */
  async getByFilters(filters: {
    industry?: string
    minAmount?: number
    maxAmount?: number
    fundingType?: string
    deadlineAfter?: Date
  }): Promise<QueryResult<Prisma.FundingOpportunityGetPayload<{}>[]>> {
    try {
      const where: Prisma.FundingOpportunityWhereInput = {}

      if (filters.industry) {
        where.industryFocus = {
          has: filters.industry,
        }
      }

      if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
        where.amountRangeMin = {}
        where.amountRangeMax = {}
        
        if (filters.minAmount !== undefined) {
          where.amountRangeMin = { lte: filters.minAmount }
        }
        if (filters.maxAmount !== undefined) {
          where.amountRangeMax = { gte: filters.maxAmount }
        }
      }

      if (filters.fundingType) {
        where.fundingType = {
          contains: filters.fundingType,
          mode: 'insensitive',
        }
      }

      if (filters.deadlineAfter) {
        where.deadline = {
          gte: filters.deadlineAfter,
        }
      }

      const opportunities = await prisma.fundingOpportunity.findMany({
        where,
        orderBy: {
          deadline: 'asc',
        },
      })

      // Serialize Decimal values for client components
      return { success: true, data: serializePrismaResult(opportunities) }
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

  /**
   * Create a new match
   */
  async create(
    data: Prisma.MatchCreateInput
  ): Promise<QueryResult<Prisma.MatchGetPayload<{}>>> {
    try {
      const match = await prisma.match.create({
        data,
      })

      return { success: true, data: match }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Bulk create matches (uses transaction for atomicity)
   */
  async bulkCreate(
    matches: Prisma.MatchCreateInput[]
  ): Promise<QueryResult<Prisma.MatchGetPayload<{}>[]>> {
    try {
      // Use transaction to ensure all matches are created or none
      const createdMatches = await prisma.$transaction(
        matches.map((match) => prisma.match.create({ data: match }))
      )

      return { success: true, data: createdMatches }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Get matches by opportunity ID
   */
  async getByOpportunityId(
    opportunityId: string
  ): Promise<QueryResult<Prisma.MatchGetPayload<{}>[]>> {
    try {
      const matches = await prisma.match.findMany({
        where: { opportunityId },
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
   * Mark match as viewed
   */
  async markAsViewed(matchId: string): Promise<QueryResult<Prisma.MatchGetPayload<{}>>> {
    try {
      const match = await prisma.match.update({
        where: { id: matchId },
        data: {
          status: 'viewed',
          viewedAt: new Date(),
        },
      })

      return { success: true, data: match }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Get count of unviewed matches for user
   */
  async getUnviewedCount(userId: string): Promise<QueryResult<number>> {
    try {
      const count = await prisma.match.count({
        where: {
          userId,
          status: 'new',
        },
      })

      return { success: true, data: count }
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
   * Get all applications (admin only - caller must verify admin status)
   */
  async getAll(): Promise<QueryResult<Prisma.ApplicationGetPayload<{
    include: {
      user: {
        select: {
          id: true
          email: true
          firstName: true
          lastName: true
        }
      }
      opportunity: {
        select: {
          id: true
          programName: true
          funderName: true
        }
      }
    }
  }>[]>> {
    try {
      const applications = await prisma.application.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          opportunity: {
            select: {
              id: true,
              programName: true,
              funderName: true,
            },
          },
        },
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
   * Create or update application
   */
  async upsert(
    data: {
      userId: string
      opportunityId: string
      matchId?: string | null
      formData: Record<string, any>
      status?: string
      aiCompleted?: boolean
      userEdited?: boolean
      signature?: string | null
    }
  ): Promise<QueryResult<Prisma.ApplicationGetPayload<{}>>> {
    try {
      // Check if application already exists for this user/opportunity
      const existing = await prisma.application.findFirst({
        where: {
          userId: data.userId,
          opportunityId: data.opportunityId,
        },
      })

      if (existing) {
        // Update existing application
        const application = await prisma.application.update({
          where: { id: existing.id },
          data: {
            formData: data.formData,
            status: data.status || existing.status,
            aiCompleted: data.aiCompleted ?? existing.aiCompleted,
            userEdited: data.userEdited ?? existing.userEdited,
            signature: data.signature ?? existing.signature,
            matchId: data.matchId ?? existing.matchId,
            submittedAt: data.status === 'submitted' ? new Date() : existing.submittedAt,
          },
        })

        return { success: true, data: application }
      } else {
        // Create new application
        const application = await prisma.application.create({
          data: {
            userId: data.userId,
            opportunityId: data.opportunityId,
            matchId: data.matchId,
            formData: data.formData,
            status: data.status || 'draft',
            aiCompleted: data.aiCompleted || false,
            userEdited: data.userEdited || false,
            signature: data.signature,
            submittedAt: data.status === 'submitted' ? new Date() : null,
          },
        })

        return { success: true, data: application }
      }
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

  /**
   * Get draft applications for user
   */
  async getDrafts(
    userId: string
  ): Promise<QueryResult<Prisma.ApplicationGetPayload<{}>[]>> {
    try {
      const applications = await prisma.application.findMany({
        where: {
          userId,
          status: 'draft',
        },
        orderBy: {
          updatedAt: 'desc',
        },
      })

      return { success: true, data: applications }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Get applications by status for user
   */
  async getByStatus(
    userId: string,
    status: string
  ): Promise<QueryResult<Prisma.ApplicationGetPayload<{}>[]>> {
    try {
      const applications = await prisma.application.findMany({
        where: {
          userId,
          status,
        },
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
   * Delete application (for draft cleanup)
   */
  async delete(id: string): Promise<QueryResult<void>> {
    try {
      await prisma.application.delete({
        where: { id },
      })

      return { success: true }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },
}

// ============================================================================
// NOTIFICATION QUERIES
// ============================================================================

export const notificationQueries = {
  /**
   * Get notifications for user
   */
  async getByUserId(
    userId: string,
    filters?: { read?: boolean }
  ): Promise<QueryResult<Prisma.NotificationGetPayload<{}>[]>> {
    try {
      const where: Prisma.NotificationWhereInput = { userId }

      if (filters?.read !== undefined) {
        where.read = filters.read
      }

      const notifications = await prisma.notification.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
      })

      return { success: true, data: notifications }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Get unread notification count for user
   */
  async getUnreadCount(userId: string): Promise<QueryResult<number>> {
    try {
      const count = await prisma.notification.count({
        where: {
          userId,
          read: false,
        },
      })

      return { success: true, data: count }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Create a new notification
   */
  async create(
    data: Prisma.NotificationCreateInput
  ): Promise<QueryResult<Prisma.NotificationGetPayload<{}>>> {
    try {
      const notification = await prisma.notification.create({
        data,
      })

      return { success: true, data: notification }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<QueryResult<Prisma.NotificationGetPayload<{}>>> {
    try {
      const notification = await prisma.notification.update({
        where: { id },
        data: { read: true },
      })

      return { success: true, data: notification }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Mark all notifications as read for user
   */
  async markAllAsRead(userId: string): Promise<QueryResult<number>> {
    try {
      const result = await prisma.notification.updateMany({
        where: {
          userId,
          read: false,
        },
        data: {
          read: true,
        },
      })

      return { success: true, data: result.count }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Delete notification
   */
  async delete(id: string): Promise<QueryResult<void>> {
    try {
      await prisma.notification.delete({
        where: { id },
      })

      return { success: true }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },
}

// ============================================================================
// DOCUMENT QUERIES
// ============================================================================

export const documentQueries = {
  /**
   * Get documents for user
   */
  async getByUserId(
    userId: string
  ): Promise<QueryResult<Prisma.DocumentGetPayload<{}>[]>> {
    try {
      const documents = await prisma.document.findMany({
        where: { userId },
        orderBy: {
          uploadedAt: 'desc',
        },
      })

      return { success: true, data: documents }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Get document by ID
   */
  async getById(
    id: string
  ): Promise<QueryResult<Prisma.DocumentGetPayload<{}>>> {
    try {
      const document = await prisma.document.findUnique({
        where: { id },
      })

      if (!document) {
        return {
          success: false,
          error: 'Document not found',
          code: 'NOT_FOUND',
        }
      }

      return { success: true, data: document }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Get documents by type for user
   */
  async getByType(
    userId: string,
    type: string
  ): Promise<QueryResult<Prisma.DocumentGetPayload<{}>[]>> {
    try {
      const documents = await prisma.document.findMany({
        where: {
          userId,
          type,
        },
        orderBy: {
          uploadedAt: 'desc',
        },
      })

      return { success: true, data: documents }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Create a new document record
   */
  async create(
    data: Prisma.DocumentCreateInput
  ): Promise<QueryResult<Prisma.DocumentGetPayload<{}>>> {
    try {
      const document = await prisma.document.create({
        data,
      })

      return { success: true, data: document }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },

  /**
   * Delete document
   */
  async delete(id: string): Promise<QueryResult<void>> {
    try {
      await prisma.document.delete({
        where: { id },
      })

      return { success: true }
    } catch (error: any) {
      return handlePrismaError(error)
    }
  },
}
