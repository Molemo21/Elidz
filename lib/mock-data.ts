// Mock data for development and demo purposes

import type { FundingOpportunity, Match, Application, Notification } from "./db-schema"

export const mockFundingOpportunities: FundingOpportunity[] = [
  {
    id: "1",
    funder_name: "ELIDZ Development Fund",
    program_name: "Green Energy Innovation Grant",
    description:
      "Supporting renewable energy initiatives for small and medium enterprises in the manufacturing sector.",
    amount_range_min: 100000,
    amount_range_max: 500000,
    eligibility_criteria: [
      "Registered SMME in South Africa",
      "Focus on renewable energy or sustainability",
      "Annual revenue between R500k - R10m",
      "At least 2 years in operation",
    ],
    application_url: "https://example.com/apply/green-energy",
    deadline: new Date("2025-06-30"),
    industry_focus: ["Manufacturing", "Energy", "Technology"],
    funding_type: "Grant",
    requirements: ["Business plan", "Financial statements", "Tax clearance certificate"],
    created_at: new Date("2025-01-01"),
  },
  {
    id: "2",
    funder_name: "Small Enterprise Development Agency",
    program_name: "Technology Startup Accelerator",
    description: "Funding for early-stage technology companies with innovative solutions.",
    amount_range_min: 50000,
    amount_range_max: 250000,
    eligibility_criteria: [
      "Technology-focused startup",
      "Less than 3 years in operation",
      "Scalable business model",
      "Located in designated zones",
    ],
    application_url: "https://example.com/apply/tech-accelerator",
    deadline: new Date("2025-07-15"),
    industry_focus: ["Technology", "Software", "Innovation"],
    funding_type: "Equity + Grant",
    requirements: ["Pitch deck", "Product demo", "Team overview"],
    created_at: new Date("2025-01-15"),
  },
  {
    id: "3",
    funder_name: "Industrial Development Corporation",
    program_name: "Manufacturing Expansion Loan",
    description: "Low-interest loans for manufacturing businesses looking to expand operations.",
    amount_range_min: 200000,
    amount_range_max: 2000000,
    eligibility_criteria: [
      "Established manufacturing business",
      "Minimum 3 years trading history",
      "Job creation potential",
      "Export potential",
    ],
    application_url: "https://example.com/apply/manufacturing-loan",
    deadline: new Date("2025-08-30"),
    industry_focus: ["Manufacturing", "Automotive", "Industrial"],
    funding_type: "Loan",
    requirements: ["Audited financial statements", "Business expansion plan", "Collateral documentation"],
    created_at: new Date("2025-02-01"),
  },
]

export const mockMatches: Match[] = [
  {
    id: "m1",
    user_id: "user1",
    opportunity_id: "1",
    match_score: 92,
    match_reasons: [
      "Strong alignment with renewable energy focus",
      "Revenue range matches eligibility",
      "Industry sector is a perfect fit",
    ],
    status: "new",
    created_at: new Date("2025-03-15"),
    viewed_at: null,
  },
  {
    id: "m2",
    user_id: "user1",
    opportunity_id: "2",
    match_score: 78,
    match_reasons: [
      "Technology sector alignment",
      "Funding amount matches requirements",
      "Early-stage business profile",
    ],
    status: "viewed",
    created_at: new Date("2025-03-10"),
    viewed_at: new Date("2025-03-12"),
  },
]

export const mockApplications: Application[] = [
  {
    id: "app1",
    user_id: "user1",
    opportunity_id: "1",
    match_id: "m1",
    status: "draft",
    form_data: {
      company_name: "GreenTech Solutions",
      project_description: "Solar panel manufacturing facility",
      funding_amount: 350000,
      employment_impact: 25,
    },
    ai_completed: true,
    user_edited: false,
    submitted_at: null,
    reviewed_at: null,
    outcome: null,
    outcome_reason: null,
    signature: null,
    created_at: new Date("2025-03-16"),
    updated_at: new Date("2025-03-16"),
  },
]

export const mockNotifications: Notification[] = [
  {
    id: "notif1",
    user_id: "user1",
    type: "match",
    title: "New Funding Match Found!",
    message: "We found a 92% match with Green Energy Innovation Grant. This opportunity aligns perfectly with your business profile.",
    read: false,
    created_at: new Date("2025-03-20T10:30:00"),
  },
  {
    id: "notif2",
    user_id: "user1",
    type: "application_completed",
    title: "Application Ready for Review",
    message: "Your application for Green Energy Innovation Grant has been auto-completed by AI. Please review and submit.",
    read: false,
    created_at: new Date("2025-03-19T14:20:00"),
  },
  {
    id: "notif3",
    user_id: "user1",
    type: "status_update",
    title: "Application Status Updated",
    message: "Your application for Technology Startup Accelerator has been submitted and is now under review.",
    read: true,
    created_at: new Date("2025-03-18T09:15:00"),
  },
  {
    id: "notif4",
    user_id: "user1",
    type: "match",
    title: "New Funding Opportunity",
    message: "A new funding opportunity matching your criteria has been added: Manufacturing Expansion Loan.",
    read: true,
    created_at: new Date("2025-03-17T16:45:00"),
  },
]
