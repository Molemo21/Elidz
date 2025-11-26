// Zod validation schemas for all input types
// These provide runtime validation and type inference

import { z } from 'zod'

// ============================================================================
// USER PROFILE VALIDATION
// ============================================================================

/**
 * Funding requirements schema
 */
export const fundingRequirementsSchema = z.object({
  amount_needed: z.number().min(0, 'Funding amount must be positive'),
  funding_purpose: z.string().min(10, 'Funding purpose must be at least 10 characters').max(2000),
  business_stage: z.enum(['startup', 'growth', 'expansion', 'mature'], {
    errorMap: () => ({ message: 'Business stage must be one of: startup, growth, expansion, mature' })
  }),
  industry_sector: z.array(z.string()).min(1, 'At least one industry sector is required'),
  preferred_funding_type: z.array(z.string()).min(1, 'At least one funding type is required')
})

/**
 * User profile schema for create/update operations
 */
export const userProfileSchema = z.object({
  company_name: z.string()
    .min(1, 'Company name is required')
    .max(255, 'Company name must be less than 255 characters')
    .trim(),
  registration_number: z.string()
    .min(1, 'Registration number is required')
    .max(100, 'Registration number must be less than 100 characters')
    .trim(),
  industry: z.string()
    .min(1, 'Industry is required')
    .max(100, 'Industry must be less than 100 characters')
    .trim(),
  business_description: z.string()
    .min(10, 'Business description must be at least 10 characters')
    .max(2000, 'Business description must be less than 2000 characters')
    .trim(),
  annual_revenue: z.number()
    .min(0, 'Annual revenue must be positive')
    .max(999999999999999, 'Annual revenue is too large'),
  employees_count: z.number()
    .int('Employee count must be a whole number')
    .min(0, 'Employee count must be non-negative')
    .max(1000000, 'Employee count is too large'),
  years_in_business: z.number()
    .int('Years in business must be a whole number')
    .min(0, 'Years in business must be non-negative')
    .max(200, 'Years in business is too large'),
  location: z.string()
    .min(1, 'Location is required')
    .max(255, 'Location must be less than 255 characters')
    .trim(),
  funding_requirements: fundingRequirementsSchema
})

/**
 * Partial update schema (all fields optional)
 */
export const userProfileUpdateSchema = userProfileSchema.partial()

/**
 * Inferred types from schemas
 */
export type UserProfileInput = z.infer<typeof userProfileSchema>
export type UserProfileUpdateInput = z.infer<typeof userProfileUpdateSchema>
export type FundingRequirementsInput = z.infer<typeof fundingRequirementsSchema>

// ============================================================================
// USER REGISTRATION VALIDATION
// ============================================================================

export const userRegistrationSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters')
    .trim(),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters')
    .trim(),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .max(20, 'Phone number must be less than 20 characters')
    .trim(),
  role: z.enum(['smme', 'admin']).default('smme')
})

export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>

// ============================================================================
// APPLICATION VALIDATION
// ============================================================================

export const applicationSchema = z.object({
  opportunity_id: z.string().uuid('Invalid opportunity ID'),
  match_id: z.string().uuid('Invalid match ID').optional().nullable(),
  status: z.enum(['draft', 'in_review', 'submitted', 'approved', 'rejected']).default('draft'),
  form_data: z.record(z.any()).default({}),
  signature: z.string().min(1, 'Signature is required').optional()
})

export const applicationUpdateSchema = z.object({
  status: z.enum(['draft', 'in_review', 'submitted', 'approved', 'rejected']).optional(),
  form_data: z.record(z.any()).optional(),
  signature: z.string().optional(),
  outcome: z.enum(['approved', 'rejected']).optional(),
  outcome_reason: z.string().optional()
})

export type ApplicationInput = z.infer<typeof applicationSchema>
export type ApplicationUpdateInput = z.infer<typeof applicationUpdateSchema>

// ============================================================================
// FUNDING OPPORTUNITY VALIDATION
// ============================================================================

export const fundingOpportunitySchema = z.object({
  funder_name: z.string()
    .min(1, 'Funder name is required')
    .max(255, 'Funder name must be less than 255 characters')
    .trim(),
  program_name: z.string()
    .min(1, 'Program name is required')
    .max(255, 'Program name must be less than 255 characters')
    .trim(),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must be less than 5000 characters')
    .trim(),
  amount_range_min: z.number()
    .min(0, 'Minimum amount must be positive')
    .max(999999999999999, 'Amount is too large'),
  amount_range_max: z.number()
    .min(0, 'Maximum amount must be positive')
    .max(999999999999999, 'Amount is too large'),
  eligibility_criteria: z.array(z.string())
    .min(1, 'At least one eligibility criterion is required')
    .max(50, 'Too many eligibility criteria'),
  application_url: z.string()
    .min(1, 'Application URL is required')
    .max(500, 'URL must be less than 500 characters')
    .refine((url) => {
      // More flexible URL validation - allows URLs with or without protocol
      try {
        // If it doesn't start with http:// or https://, add https:// for validation
        const testUrl = url.startsWith('http://') || url.startsWith('https://') 
          ? url 
          : `https://${url}`
        new URL(testUrl)
        return true
      } catch {
        return false
      }
    }, {
      message: 'Invalid application URL format. Please enter a valid URL (e.g., https://example.com/apply)'
    }),
  deadline: z.string()
    .min(1, 'Deadline is required')
    .refine((date) => {
      // Accept both date (YYYY-MM-DD) and ISO datetime formats
      const parsed = new Date(date)
      return !isNaN(parsed.getTime())
    }, {
      message: 'Invalid deadline format. Please select a valid date.'
    })
    .refine((date) => {
      const parsed = new Date(date)
      return parsed > new Date()
    }, {
      message: 'Deadline must be in the future'
    }),
  industry_focus: z.array(z.string())
    .min(1, 'At least one industry focus is required')
    .max(50, 'Too many industry focuses'),
  funding_type: z.string()
    .min(1, 'Funding type is required')
    .max(100, 'Funding type must be less than 100 characters')
    .trim(),
  requirements: z.array(z.string())
    .min(1, 'At least one requirement is required')
    .max(50, 'Too many requirements')
}).refine((data) => data.amount_range_max >= data.amount_range_min, {
  message: 'Maximum amount must be greater than or equal to minimum amount',
  path: ['amount_range_max']
})

export type FundingOpportunityInput = z.infer<typeof fundingOpportunitySchema>

// ============================================================================
// MATCH VALIDATION
// ============================================================================

export const matchSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  opportunity_id: z.string().uuid('Invalid opportunity ID'),
  match_score: z.number()
    .int('Match score must be a whole number')
    .min(0, 'Match score must be between 0 and 100')
    .max(100, 'Match score must be between 0 and 100'),
  match_reasons: z.array(z.string())
    .min(1, 'At least one match reason is required')
    .max(20, 'Too many match reasons'),
  status: z.enum(['new', 'viewed', 'interested', 'applied']).default('new')
})

export type MatchInput = z.infer<typeof matchSchema>

// ============================================================================
// NOTIFICATION VALIDATION
// ============================================================================

export const notificationSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  type: z.enum(['match', 'application_completed', 'status_update'], {
    errorMap: () => ({ message: 'Type must be one of: match, application_completed, status_update' })
  }),
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .trim(),
  message: z.string()
    .min(1, 'Message is required')
    .max(2000, 'Message must be less than 2000 characters')
    .trim(),
  read: z.boolean().default(false)
})

export const notificationUpdateSchema = z.object({
  read: z.boolean().optional()
})

export type NotificationInput = z.infer<typeof notificationSchema>
export type NotificationUpdateInput = z.infer<typeof notificationUpdateSchema>

// ============================================================================
// DOCUMENT VALIDATION
// ============================================================================

export const documentSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  name: z.string()
    .min(1, 'Document name is required')
    .max(255, 'Document name must be less than 255 characters')
    .trim(),
  type: z.string()
    .min(1, 'Document type is required')
    .max(100, 'Document type must be less than 100 characters')
    .trim(),
  url: z.string()
    .url('Invalid document URL')
    .max(1000, 'URL must be less than 1000 characters')
})

export type DocumentInput = z.infer<typeof documentSchema>

// ============================================================================
// SEARCH/FILTER VALIDATION
// ============================================================================

export const opportunitySearchSchema = z.object({
  industry: z.string().optional(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
  fundingType: z.string().optional(),
  deadlineAfter: z.string().datetime().optional()
})

export type OpportunitySearchInput = z.infer<typeof opportunitySearchSchema>

