// Reusable query helpers with consistent error handling
// These provide a standardized way to interact with the database

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/database.types'

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
 * Generic error handler for Supabase errors
 * Maps common error codes to user-friendly messages
 */
function handleSupabaseError<T>(error: any): QueryResult<T> {
  // Unique constraint violation (duplicate key)
  if (error?.code === '23505') {
    return { success: false, error: 'Record already exists', code: 'DUPLICATE' }
  }
  
  // Foreign key violation
  if (error?.code === '23503') {
    return { success: false, error: 'Referenced record does not exist', code: 'FOREIGN_KEY' }
  }
  
  // Not found
  if (error?.code === 'PGRST116') {
    return { success: false, error: 'Record not found', code: 'NOT_FOUND' }
  }
  
  // Permission denied (RLS)
  if (error?.code === '42501' || error?.message?.includes('permission denied')) {
    return { success: false, error: 'Permission denied', code: 'PERMISSION_DENIED' }
  }
  
  // Generic error
  return { 
    success: false, 
    error: error?.message || 'Database operation failed',
    code: error?.code 
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
  ): Promise<QueryResult<Database['public']['Tables']['user_profiles']['Row']>> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) return handleSupabaseError(error)
      if (!data) return { success: false, error: 'Profile not found', code: 'NOT_FOUND' }
      
      return { success: true, data }
    } catch (error: any) {
      return handleSupabaseError(error)
    }
  },

  /**
   * Upsert user profile (create or update)
   */
  async upsert(
    userId: string,
    profile: Database['public']['Tables']['user_profiles']['Insert']
  ): Promise<QueryResult<Database['public']['Tables']['user_profiles']['Row']>> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(
          { ...profile, user_id: userId },
          { onConflict: 'user_id' }
        )
        .select()
        .single()

      if (error) return handleSupabaseError(error)
      return { success: true, data: data! }
    } catch (error: any) {
      return handleSupabaseError(error)
    }
  },

  /**
   * Update user profile (partial update)
   */
  async update(
    userId: string,
    updates: Database['public']['Tables']['user_profiles']['Update']
  ): Promise<QueryResult<Database['public']['Tables']['user_profiles']['Row']>> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) return handleSupabaseError(error)
      if (!data) return { success: false, error: 'Profile not found', code: 'NOT_FOUND' }
      
      return { success: true, data }
    } catch (error: any) {
      return handleSupabaseError(error)
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
        profile.company_name,
        profile.registration_number,
        profile.industry,
        profile.business_description,
        profile.location,
        profile.annual_revenue,
        profile.employees_count,
        profile.years_in_business,
        profile.funding_requirements
      ]

      if (required.some(field => field === null || field === undefined || field === '')) {
        return false
      }

      // Validate funding_requirements structure
      const fundingReqs = profile.funding_requirements as any
      if (!fundingReqs?.amount_needed || !fundingReqs?.funding_purpose) {
        return false
      }

      return true
    } catch {
      return false
    }
  }
}

// ============================================================================
// USER QUERIES
// ============================================================================

export const userQueries = {
  /**
   * Get all users (admin only - caller must verify admin status)
   */
  async getAll(): Promise<QueryResult<Database['public']['Tables']['users']['Row'][]>> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) return handleSupabaseError(error)
      return { success: true, data: data || [] }
    } catch (error: any) {
      return handleSupabaseError(error)
    }
  },

  /**
   * Get user by ID
   */
  async getById(
    userId: string
  ): Promise<QueryResult<Database['public']['Tables']['users']['Row']>> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) return handleSupabaseError(error)
      if (!data) return { success: false, error: 'User not found', code: 'NOT_FOUND' }
      
      return { success: true, data }
    } catch (error: any) {
      return handleSupabaseError(error)
    }
  },

  /**
   * Get user by email
   */
  async getByEmail(
    email: string
  ): Promise<QueryResult<Database['public']['Tables']['users']['Row']>> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle()

      if (error) return handleSupabaseError(error)
      if (!data) return { success: false, error: 'User not found', code: 'NOT_FOUND' }
      
      return { success: true, data }
    } catch (error: any) {
      return handleSupabaseError(error)
    }
  },

  /**
   * Update user approval status
   */
  async updateApproval(
    userId: string,
    approved: boolean
  ): Promise<QueryResult<Database['public']['Tables']['users']['Row']>> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('users')
        .update({ approved })
        .eq('id', userId)
        .select()
        .single()

      if (error) return handleSupabaseError(error)
      if (!data) return { success: false, error: 'User not found', code: 'NOT_FOUND' }
      
      return { success: true, data }
    } catch (error: any) {
      return handleSupabaseError(error)
    }
  },

  /**
   * Update user last login timestamp
   */
  async updateLastLogin(userId: string): Promise<QueryResult<Database['public']['Tables']['users']['Row']>> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single()

      if (error) return handleSupabaseError(error)
      return { success: true, data: data! }
    } catch (error: any) {
      return handleSupabaseError(error)
    }
  }
}

// ============================================================================
// FUNDING OPPORTUNITY QUERIES
// ============================================================================

export const opportunityQueries = {
  /**
   * Get all opportunities
   */
  async getAll(): Promise<QueryResult<Database['public']['Tables']['funding_opportunities']['Row'][]>> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('funding_opportunities')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) return handleSupabaseError(error)
      return { success: true, data: data || [] }
    } catch (error: any) {
      return handleSupabaseError(error)
    }
  },

  /**
   * Get opportunity by ID
   */
  async getById(
    opportunityId: string
  ): Promise<QueryResult<Database['public']['Tables']['funding_opportunities']['Row']>> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('funding_opportunities')
        .select('*')
        .eq('id', opportunityId)
        .maybeSingle()

      if (error) return handleSupabaseError(error)
      if (!data) return { success: false, error: 'Opportunity not found', code: 'NOT_FOUND' }
      
      return { success: true, data }
    } catch (error: any) {
      return handleSupabaseError(error)
    }
  },

  /**
   * Get opportunities by industry
   */
  async getByIndustry(
    industry: string
  ): Promise<QueryResult<Database['public']['Tables']['funding_opportunities']['Row'][]>> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('funding_opportunities')
        .select('*')
        .contains('industry_focus', [industry])
        .order('created_at', { ascending: false })

      if (error) return handleSupabaseError(error)
      return { success: true, data: data || [] }
    } catch (error: any) {
      return handleSupabaseError(error)
    }
  },

  /**
   * Get active opportunities (deadline in future)
   */
  async getActive(): Promise<QueryResult<Database['public']['Tables']['funding_opportunities']['Row'][]>> {
    try {
      const supabase = await createClient()
      const now = new Date().toISOString()
      const { data, error } = await supabase
        .from('funding_opportunities')
        .select('*')
        .gt('deadline', now)
        .order('deadline', { ascending: true })

      if (error) return handleSupabaseError(error)
      return { success: true, data: data || [] }
    } catch (error: any) {
      return handleSupabaseError(error)
    }
  }
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
  ): Promise<QueryResult<Database['public']['Tables']['matches']['Row'][]>> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('user_id', userId)
        .order('match_score', { ascending: false })

      if (error) return handleSupabaseError(error)
      return { success: true, data: data || [] }
    } catch (error: any) {
      return handleSupabaseError(error)
    }
  },

  /**
   * Update match status
   */
  async updateStatus(
    matchId: string,
    status: Database['public']['Tables']['matches']['Row']['status']
  ): Promise<QueryResult<Database['public']['Tables']['matches']['Row']>> {
    try {
      const supabase = await createClient()
      const updateData: any = { status }
      if (status === 'viewed') {
        updateData.viewed_at = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('matches')
        .update(updateData)
        .eq('id', matchId)
        .select()
        .single()

      if (error) return handleSupabaseError(error)
      if (!data) return { success: false, error: 'Match not found', code: 'NOT_FOUND' }
      
      return { success: true, data }
    } catch (error: any) {
      return handleSupabaseError(error)
    }
  }
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
  ): Promise<QueryResult<Database['public']['Tables']['applications']['Row'][]>> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) return handleSupabaseError(error)
      return { success: true, data: data || [] }
    } catch (error: any) {
      return handleSupabaseError(error)
    }
  },

  /**
   * Get application by ID
   */
  async getById(
    applicationId: string
  ): Promise<QueryResult<Database['public']['Tables']['applications']['Row']>> {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .maybeSingle()

      if (error) return handleSupabaseError(error)
      if (!data) return { success: false, error: 'Application not found', code: 'NOT_FOUND' }
      
      return { success: true, data }
    } catch (error: any) {
      return handleSupabaseError(error)
    }
  },

  /**
   * Update application status
   */
  async updateStatus(
    applicationId: string,
    status: Database['public']['Tables']['applications']['Row']['status']
  ): Promise<QueryResult<Database['public']['Tables']['applications']['Row']>> {
    try {
      const supabase = await createClient()
      const updateData: any = { status }
      
      if (status === 'submitted') {
        updateData.submitted_at = new Date().toISOString()
      } else if (status === 'approved' || status === 'rejected') {
        updateData.reviewed_at = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('applications')
        .update(updateData)
        .eq('id', applicationId)
        .select()
        .single()

      if (error) return handleSupabaseError(error)
      if (!data) return { success: false, error: 'Application not found', code: 'NOT_FOUND' }
      
      return { success: true, data }
    } catch (error: any) {
      return handleSupabaseError(error)
    }
  }
}


