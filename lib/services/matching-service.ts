// Matching Service - Integrates AI matching with database operations
// This service handles the complete flow of generating matches for users

import { prisma } from '@/lib/prisma'
import { AIMatchingService } from '@/lib/ai-service'
import { matchQueries, opportunityQueries, userProfileQueries, notificationQueries } from '@/lib/db/queries'
import type { UserProfile, FundingOpportunity, Match } from '@/lib/db-schema'

export interface MatchingResult {
  success: boolean
  matchesCreated: number
  error?: string
}

/**
 * Matching Service - Handles AI-powered matching of users to funding opportunities
 */
export class MatchingService {
  /**
   * Generate matches for a user after profile save/update
   * This is the main entry point for matching functionality
   */
  static async generateMatchesForUser(userId: string): Promise<MatchingResult> {
    try {
      // 1. Get user profile
      const profileResult = await userProfileQueries.getByUserId(userId)
      if (!profileResult.success || !profileResult.data) {
        return { success: false, matchesCreated: 0, error: 'Profile not found' }
      }

      // 2. Get all active opportunities
      const oppsResult = await opportunityQueries.getActive()
      if (!oppsResult.success || !oppsResult.data) {
        return { success: false, matchesCreated: 0, error: 'Failed to fetch opportunities' }
      }

      // If no opportunities exist, return early
      if (oppsResult.data.length === 0) {
        return { success: true, matchesCreated: 0 }
      }

      // 3. Transform to match AI service types
      const userProfile = this.transformToAIServiceProfile(profileResult.data)
      const opportunities = oppsResult.data.map(this.transformToAIServiceOpportunity)

      // 4. Run AI matching
      const matches = await AIMatchingService.matchOpportunities(userProfile, opportunities)

      // If no matches found, return early
      if (matches.length === 0) {
        return { success: true, matchesCreated: 0 }
      }

      // 5. Check for existing matches to avoid duplicates
      const existingMatchesResult = await matchQueries.getByUserId(userId)
      const existingOppIds = existingMatchesResult.success && existingMatchesResult.data
        ? new Set(existingMatchesResult.data.map((m: any) => m.opportunityId))
        : new Set()

      // 6. Filter out duplicates
      const newMatches = matches.filter(m => !existingOppIds.has(m.opportunity_id))
      
      if (newMatches.length === 0) {
        return { success: true, matchesCreated: 0 }
      }

      // 7. Bulk create matches using transaction
      const matchData = newMatches.map(m => ({
        userId: m.user_id,
        opportunityId: m.opportunity_id,
        matchScore: m.match_score,
        matchReasons: m.match_reasons,
        status: m.status,
      }))

      // Use transaction for atomicity
      const createdMatches = await prisma.$transaction(
        matchData.map(data => 
          prisma.match.create({ data })
        )
      )

      // 8. Create notifications for new matches
      const notificationPromises = createdMatches.map(async (match) => {
        // Get opportunity name for notification
        const opportunity = oppsResult.data!.find((o: any) => o.id === match.opportunityId)
        const opportunityName = opportunity ? (opportunity as any).programName : 'Funding Opportunity'

        return notificationQueries.create({
          userId: match.userId,
          type: 'match',
          title: 'New Funding Match Found!',
          message: `We found a ${match.matchScore}% match: ${opportunityName}`,
        })
      })

      // Create all notifications (don't fail if notification creation fails)
      await Promise.allSettled(notificationPromises)

      return { success: true, matchesCreated: createdMatches.length }
    } catch (error: any) {
      console.error('Error generating matches:', error)
      return { 
        success: false, 
        matchesCreated: 0, 
        error: error.message || 'Failed to generate matches' 
      }
    }
  }

  /**
   * Transform Prisma UserProfile to AI Service UserProfile format
   */
  private static transformToAIServiceProfile(profile: any): UserProfile {
    return {
      id: profile.id,
      user_id: profile.userId,
      company_name: profile.companyName || '',
      registration_number: profile.registrationNumber || '',
      industry: profile.industry || '',
      business_description: profile.businessDescription || '',
      annual_revenue: profile.annualRevenue ? Number(profile.annualRevenue) : 0,
      employees_count: profile.employeesCount || 0,
      years_in_business: profile.yearsInBusiness || 0,
      location: profile.location || '',
      funding_requirements: profile.fundingRequirements || {
        amount_needed: 0,
        funding_purpose: '',
        business_stage: 'startup',
        industry_sector: [],
        preferred_funding_type: [],
      },
      updated_at: profile.updatedAt ? new Date(profile.updatedAt) : new Date(),
    }
  }

  /**
   * Transform Prisma FundingOpportunity to AI Service FundingOpportunity format
   */
  private static transformToAIServiceOpportunity(opp: any): FundingOpportunity {
    return {
      id: opp.id,
      funder_name: opp.funderName || '',
      program_name: opp.programName || '',
      description: opp.description || '',
      amount_range_min: opp.amountRangeMin ? Number(opp.amountRangeMin) : 0,
      amount_range_max: opp.amountRangeMax ? Number(opp.amountRangeMax) : 0,
      eligibility_criteria: opp.eligibilityCriteria || [],
      application_url: opp.applicationUrl || '',
      deadline: opp.deadline ? new Date(opp.deadline) : new Date(),
      industry_focus: opp.industryFocus || [],
      funding_type: opp.fundingType || '',
      requirements: opp.requirements || [],
      created_at: opp.createdAt ? new Date(opp.createdAt) : new Date(),
    }
  }
}

