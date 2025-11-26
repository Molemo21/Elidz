// Type helpers for database tables
// These provide type-safe access to database types

import type { Database } from '@/lib/supabase/database.types'

/**
 * Extract Row type from a table
 */
export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row']

/**
 * Extract Insert type from a table
 */
export type Inserts<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert']

/**
 * Extract Update type from a table
 */
export type Updates<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update']

/**
 * Type-safe table references
 */
export type User = Tables<'users'>
export type UserProfile = Tables<'user_profiles'>
export type FundingOpportunity = Tables<'funding_opportunities'>
export type Match = Tables<'matches'>
export type Application = Tables<'applications'>
export type Document = Tables<'documents'>
export type Notification = Tables<'notifications'>

/**
 * Helper to convert database timestamps (strings) to Date objects
 * Useful when you need Date objects instead of ISO strings
 */
export type WithDates<T> = {
  [K in keyof T]: T[K] extends string 
    ? (K extends `${string}_at` | 'created_at' | 'updated_at' | 'deadline' | 'submitted_at' | 'reviewed_at' | 'viewed_at' | 'uploaded_at' | 'last_login'
        ? Date 
        : T[K])
    : T[K]
}

/**
 * Helper to make all fields optional for partial updates
 */
export type PartialTable<T extends keyof Database['public']['Tables']> = 
  Partial<Updates<T>>


