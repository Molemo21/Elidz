// AI Service for funding opportunity matching and application completion

import type { UserProfile, FundingOpportunity, Match } from "./db-schema"

export class AIMatchingService {
  /**
   * Find and match funding opportunities based on user profile
   */
  static async matchOpportunities(userProfile: UserProfile, opportunities: FundingOpportunity[]): Promise<Match[]> {
    // Simulate AI matching algorithm
    const matches: Match[] = []

    for (const opportunity of opportunities) {
      const score = this.calculateMatchScore(userProfile, opportunity)

      if (score >= 60) {
        // Minimum threshold
        matches.push({
          id: `match_${Date.now()}_${opportunity.id}`,
          user_id: userProfile.user_id,
          opportunity_id: opportunity.id,
          match_score: score,
          match_reasons: this.generateMatchReasons(userProfile, opportunity, score),
          status: "new",
          created_at: new Date(),
          viewed_at: null,
        })
      }
    }

    return matches.sort((a, b) => b.match_score - a.match_score)
  }

  /**
   * Calculate match score between user profile and opportunity
   */
  private static calculateMatchScore(profile: UserProfile, opportunity: FundingOpportunity): number {
    let score = 0

    // Industry alignment (30 points)
    const industryMatch = opportunity.industry_focus.some((industry) =>
      profile.industry.toLowerCase().includes(industry.toLowerCase()),
    )
    if (industryMatch) score += 30

    // Funding amount match (25 points)
    const { amount_needed } = profile.funding_requirements
    if (amount_needed >= opportunity.amount_range_min && amount_needed <= opportunity.amount_range_max) {
      score += 25
    } else if (Math.abs(amount_needed - opportunity.amount_range_min) / opportunity.amount_range_min < 0.3) {
      score += 15 // Partial match
    }

    // Business stage alignment (20 points)
    const stageMatch = this.matchBusinessStage(
      profile.funding_requirements.business_stage,
      opportunity.eligibility_criteria,
    )
    score += stageMatch

    // Funding type preference (15 points)
    const typeMatch = profile.funding_requirements.preferred_funding_type.some((type) =>
      opportunity.funding_type.toLowerCase().includes(type.toLowerCase()),
    )
    if (typeMatch) score += 15

    // Years in business (10 points)
    if (profile.years_in_business >= 2) score += 10

    return Math.min(100, score)
  }

  /**
   * Generate human-readable match reasons
   */
  private static generateMatchReasons(profile: UserProfile, opportunity: FundingOpportunity, score: number): string[] {
    const reasons: string[] = []

    if (opportunity.industry_focus.some((i) => profile.industry.includes(i))) {
      reasons.push(`Your ${profile.industry} business aligns perfectly with their industry focus`)
    }

    const { amount_needed } = profile.funding_requirements
    if (amount_needed >= opportunity.amount_range_min && amount_needed <= opportunity.amount_range_max) {
      reasons.push("Your funding requirement matches their available range")
    }

    if (score >= 85) {
      reasons.push("Excellent overall compatibility with this program")
    } else if (score >= 70) {
      reasons.push("Strong compatibility with most eligibility criteria")
    }

    return reasons
  }

  /**
   * Match business stage with opportunity criteria
   */
  private static matchBusinessStage(stage: string, criteria: string[]): number {
    const criteriaText = criteria.join(" ").toLowerCase()

    if (stage === "startup" && criteriaText.includes("startup")) return 20
    if (stage === "growth" && (criteriaText.includes("growth") || criteriaText.includes("established"))) return 20
    if (stage === "expansion" && criteriaText.includes("expansion")) return 20
    if (stage === "mature" && criteriaText.includes("established")) return 20

    return 10 // Partial match
  }

  /**
   * Auto-complete application form using AI and user profile
   */
  static async completeApplication(
    userProfile: UserProfile,
    opportunity: FundingOpportunity,
  ): Promise<Record<string, any>> {
    // Simulate AI form completion
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      // Basic Information
      company_name: userProfile.company_name,
      registration_number: userProfile.registration_number,
      contact_person: `Contact Person`,
      email: "contact@company.com",
      phone: "(+27) 123-456-7890",

      // Business Details
      industry_sector: userProfile.industry,
      years_in_operation: userProfile.years_in_business,
      number_of_employees: userProfile.employees_count,
      annual_turnover: userProfile.annual_revenue,
      business_location: userProfile.location,

      // Funding Request
      funding_amount_requested: userProfile.funding_requirements.amount_needed,
      funding_purpose: userProfile.funding_requirements.funding_purpose,
      project_description: `${userProfile.business_description}. This project will help us achieve our strategic goals and contribute to economic growth.`,

      // Impact
      job_creation_potential: Math.ceil(userProfile.employees_count * 0.2),
      economic_impact_description:
        "This funding will enable business expansion, increase production capacity, and create sustainable employment opportunities.",

      // Requirements
      business_plan_attached: false,
      financial_statements_attached: false,
      tax_clearance_attached: false,

      // AI metadata
      ai_completed_at: new Date().toISOString(),
      confidence_score: 0.85,
    }
  }

  /**
   * Search for funding opportunities using AI
   */
  static async searchOpportunities(query: string, opportunities: FundingOpportunity[]): Promise<FundingOpportunity[]> {
    // Simulate AI-powered search
    const searchTerms = query.toLowerCase().split(" ")

    return opportunities.filter((opp) => {
      const searchableText = [
        opp.funder_name,
        opp.program_name,
        opp.description,
        ...opp.industry_focus,
        opp.funding_type,
      ]
        .join(" ")
        .toLowerCase()

      return searchTerms.some((term) => searchableText.includes(term))
    })
  }
}
