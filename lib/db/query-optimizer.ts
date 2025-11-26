// Query optimization utilities
// These provide optimized query patterns and helpers

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database.types'

/**
 * Optimized query builder with common patterns
 */
export class QueryBuilder {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Get user profile with related user data in one query
   * Uses Supabase's relational query syntax
   */
  async getUserProfileWithRelations(userId: string) {
    return this.supabase
      .from('user_profiles')
      .select(`
        *,
        users:user_id (
          id,
          email,
          role,
          first_name,
          last_name,
          approved
        )
      `)
      .eq('user_id', userId)
      .maybeSingle()
  }

  /**
   * Get matches with opportunity details
   * Reduces N+1 query problem by fetching related data in one query
   */
  async getMatchesWithOpportunities(userId: string) {
    return this.supabase
      .from('matches')
      .select(`
        *,
        funding_opportunities:opportunity_id (
          id,
          funder_name,
          program_name,
          amount_range_min,
          amount_range_max,
          deadline,
          application_url
        )
      `)
      .eq('user_id', userId)
      .order('match_score', { ascending: false })
  }

  /**
   * Get applications with full details including opportunity and match info
   */
  async getApplicationsWithDetails(userId: string) {
    return this.supabase
      .from('applications')
      .select(`
        *,
        funding_opportunities:opportunity_id (
          id,
          funder_name,
          program_name,
          amount_range_min,
          amount_range_max,
          deadline
        ),
        matches:match_id (
          id,
          match_score,
          match_reasons
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  }

  /**
   * Batch update multiple records efficiently
   * Uses Promise.all for parallel updates (Supabase handles connection pooling)
   */
  async batchUpdate<T extends keyof Database['public']['Tables']>(
    table: T,
    updates: Array<{
      id: string
      data: Partial<Database['public']['Tables'][T]['Update']>
    }>
  ) {
    return Promise.all(
      updates.map(({ id, data }) =>
        this.supabase
          .from(table)
          .update(data)
          .eq('id', id)
          .select()
          .single()
      )
    )
  }

  /**
   * Paginated query helper
   * Provides consistent pagination across the application
   */
  async paginate<T extends keyof Database['public']['Tables']>(
    table: T,
    options: {
      page: number
      pageSize: number
      orderBy?: keyof Database['public']['Tables'][T]['Row']
      ascending?: boolean
      filters?: Record<string, any>
    }
  ) {
    const { page, pageSize, orderBy, ascending = false, filters = {} } = options
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = this.supabase
      .from(table)
      .select('*', { count: 'exact' })
      .range(from, to)

    if (orderBy) {
      query = query.order(orderBy as string, { ascending })
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          query = query.in(key, value)
        } else {
          query = query.eq(key, value)
        }
      }
    })

    return query
  }

  /**
   * Search helper with text search
   * Useful for searching across text fields
   */
  async search<T extends keyof Database['public']['Tables']>(
    table: T,
    searchTerm: string,
    searchFields: Array<keyof Database['public']['Tables'][T]['Row']>,
    options?: {
      limit?: number
      orderBy?: keyof Database['public']['Tables'][T]['Row']
      ascending?: boolean
    }
  ) {
    const { limit = 50, orderBy, ascending = false } = options || {}
    
    let query = this.supabase
      .from(table)
      .select('*')
      .limit(limit)

    // Use ilike for case-insensitive search
    // Note: This is a simple implementation - for production, consider full-text search
    const searchConditions = searchFields.map(field => 
      `${field as string}.ilike.%${searchTerm}%`
    )

    if (searchConditions.length > 0) {
      // Use or() for multiple field search
      query = query.or(searchConditions.join(','))
    }

    if (orderBy) {
      query = query.order(orderBy as string, { ascending })
    }

    return query
  }
}


