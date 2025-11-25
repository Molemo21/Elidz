// Database types for Supabase
// This is a basic version - you can generate a complete one using:
// npx supabase gen types typescript --project-id your-project-id > lib/supabase/database.types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'smme' | 'admin'
          first_name: string
          last_name: string
          phone: string
          approved: boolean
          created_at: string
          last_login: string | null
        }
        Insert: {
          id: string
          email: string
          role?: 'smme' | 'admin'
          first_name: string
          last_name: string
          phone: string
          approved?: boolean
          created_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          role?: 'smme' | 'admin'
          first_name?: string
          last_name?: string
          phone?: string
          approved?: boolean
          created_at?: string
          last_login?: string | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          company_name: string | null
          registration_number: string | null
          industry: string | null
          business_description: string | null
          annual_revenue: number | null
          employees_count: number | null
          years_in_business: number | null
          location: string | null
          funding_requirements: Json | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name?: string | null
          registration_number?: string | null
          industry?: string | null
          business_description?: string | null
          annual_revenue?: number | null
          employees_count?: number | null
          years_in_business?: number | null
          location?: string | null
          funding_requirements?: Json | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string | null
          registration_number?: string | null
          industry?: string | null
          business_description?: string | null
          annual_revenue?: number | null
          employees_count?: number | null
          years_in_business?: number | null
          location?: string | null
          funding_requirements?: Json | null
          updated_at?: string
        }
      }
      funding_opportunities: {
        Row: {
          id: string
          funder_name: string
          program_name: string
          description: string
          amount_range_min: number
          amount_range_max: number
          eligibility_criteria: string[]
          application_url: string
          deadline: string
          industry_focus: string[]
          funding_type: string
          requirements: string[]
          created_at: string
        }
        Insert: {
          id?: string
          funder_name: string
          program_name: string
          description: string
          amount_range_min: number
          amount_range_max: number
          eligibility_criteria: string[]
          application_url: string
          deadline: string
          industry_focus: string[]
          funding_type: string
          requirements: string[]
          created_at?: string
        }
        Update: {
          id?: string
          funder_name?: string
          program_name?: string
          description?: string
          amount_range_min?: number
          amount_range_max?: number
          eligibility_criteria?: string[]
          application_url?: string
          deadline?: string
          industry_focus?: string[]
          funding_type?: string
          requirements?: string[]
          created_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          user_id: string
          opportunity_id: string
          match_score: number
          match_reasons: string[]
          status: 'new' | 'viewed' | 'interested' | 'applied'
          created_at: string
          viewed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          opportunity_id: string
          match_score: number
          match_reasons: string[]
          status?: 'new' | 'viewed' | 'interested' | 'applied'
          created_at?: string
          viewed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          opportunity_id?: string
          match_score?: number
          match_reasons?: string[]
          status?: 'new' | 'viewed' | 'interested' | 'applied'
          created_at?: string
          viewed_at?: string | null
        }
      }
      applications: {
        Row: {
          id: string
          user_id: string
          opportunity_id: string
          match_id: string | null
          status: 'draft' | 'in_review' | 'submitted' | 'approved' | 'rejected'
          form_data: Json
          ai_completed: boolean
          user_edited: boolean
          submitted_at: string | null
          reviewed_at: string | null
          outcome: 'approved' | 'rejected' | null
          outcome_reason: string | null
          signature: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          opportunity_id: string
          match_id?: string | null
          status?: 'draft' | 'in_review' | 'submitted' | 'approved' | 'rejected'
          form_data?: Json
          ai_completed?: boolean
          user_edited?: boolean
          submitted_at?: string | null
          reviewed_at?: string | null
          outcome?: 'approved' | 'rejected' | null
          outcome_reason?: string | null
          signature?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          opportunity_id?: string
          match_id?: string | null
          status?: 'draft' | 'in_review' | 'submitted' | 'approved' | 'rejected'
          form_data?: Json
          ai_completed?: boolean
          user_edited?: boolean
          submitted_at?: string | null
          reviewed_at?: string | null
          outcome?: 'approved' | 'rejected' | null
          outcome_reason?: string | null
          signature?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          url: string
          uploaded_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          url: string
          uploaded_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: string
          url?: string
          uploaded_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'match' | 'application_completed' | 'status_update'
          title: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'match' | 'application_completed' | 'status_update'
          title: string
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'match' | 'application_completed' | 'status_update'
          title?: string
          message?: string
          read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

