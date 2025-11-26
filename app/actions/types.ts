// Shared types for server actions
// These provide consistent response types across all actions

import type { Database } from '@/lib/supabase/database.types'

/**
 * Generic action response type
 */
export interface ActionResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  code?: string
}

/**
 * Type-safe response types for each entity
 */
export type UserProfileResponse = ActionResponse<Database['public']['Tables']['user_profiles']['Row']>
export type UserManagementResponse = ActionResponse<Database['public']['Tables']['users']['Row'] | Database['public']['Tables']['users']['Row'][]>
export type FundingOpportunityResponse = ActionResponse<Database['public']['Tables']['funding_opportunities']['Row'] | Database['public']['Tables']['funding_opportunities']['Row'][]>
export type MatchResponse = ActionResponse<Database['public']['Tables']['matches']['Row'] | Database['public']['Tables']['matches']['Row'][]>
export type ApplicationResponse = ActionResponse<Database['public']['Tables']['applications']['Row'] | Database['public']['Tables']['applications']['Row'][]>


