// Database Schema Types for SMME Funding Platform

export type UserRole = "smme" | "admin"

export type ApplicationStatus = "draft" | "in_review" | "submitted" | "approved" | "rejected"

export interface User {
  id: string
  email: string
  password_hash: string
  role: UserRole
  first_name: string
  last_name: string
  phone: string
  approved: boolean
  created_at: Date
  last_login: Date | null
  profile?: UserProfile
}

export interface UserProfile {
  id: string
  user_id: string
  // All fields below are nullable in the database (TEXT, NUMERIC, INTEGER, JSONB can be null)
  company_name: string | null
  registration_number: string | null
  industry: string | null
  business_description: string | null
  annual_revenue: number | null
  employees_count: number | null
  years_in_business: number | null
  location: string | null
  funding_requirements: FundingRequirements | null
  updated_at: Date
  // Note: documents is not a database column - it's a computed/joined field
  // It should be populated separately when needed
  documents?: Document[]
}

export interface FundingRequirements {
  amount_needed: number
  funding_purpose: string
  business_stage: "startup" | "growth" | "expansion" | "mature"
  industry_sector: string[]
  preferred_funding_type: string[]
}

export interface Document {
  id: string
  user_id: string
  name: string
  type: string
  url: string
  uploaded_at: Date
}

export interface FundingOpportunity {
  id: string
  funder_name: string
  program_name: string
  description: string
  amount_range_min: number
  amount_range_max: number
  eligibility_criteria: string[]
  application_url: string
  deadline: Date
  industry_focus: string[]
  funding_type: string
  requirements: string[]
  created_at: Date
}

export interface Match {
  id: string
  user_id: string
  opportunity_id: string
  match_score: number
  match_reasons: string[]
  status: "new" | "viewed" | "interested" | "applied"
  created_at: Date
  viewed_at: Date | null
}

export interface Application {
  id: string
  user_id: string
  opportunity_id: string
  match_id: string
  status: ApplicationStatus
  form_data: Record<string, any>
  ai_completed: boolean
  user_edited: boolean
  submitted_at: Date | null
  reviewed_at: Date | null
  outcome: "approved" | "rejected" | null
  outcome_reason: string | null
  signature: string | null
  created_at: Date
  updated_at: Date
}

export interface Notification {
  id: string
  user_id: string
  type: "match" | "application_completed" | "status_update"
  title: string
  message: string
  read: boolean
  created_at: Date
}
