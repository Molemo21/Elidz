// Opportunity Pool - Pre-configured funding opportunities for admins
// This pool provides a diverse set of realistic opportunities across various industries
// Admins can browse and import these opportunities to quickly populate the database

import type { FundingOpportunityInput } from '@/lib/validations/schemas'

export interface OpportunityTemplate {
  id: string
  name: string
  category: string
  industry: string[]
  fundingType: string
  amountRange: { min: number; max: number }
  data: FundingOpportunityInput
}

/**
 * Generate a future deadline (default: 6 months from now)
 */
function getFutureDeadline(monthsFromNow: number = 6): string {
  const date = new Date()
  date.setMonth(date.getMonth() + monthsFromNow)
  date.setHours(23, 59, 59, 999)
  return date.toISOString()
}

/**
 * Opportunity Pool - Comprehensive collection of funding opportunities
 */
export const opportunityPool: OpportunityTemplate[] = [
  // TECHNOLOGY & INNOVATION
  {
    id: 'tech-001',
    name: 'Technology Startup Accelerator',
    category: 'Technology',
    industry: ['Technology', 'Software', 'Innovation'],
    fundingType: 'Equity + Grant',
    amountRange: { min: 50000, max: 250000 },
    data: {
      funder_name: 'Small Enterprise Development Agency',
      program_name: 'Technology Startup Accelerator',
      description: 'Funding for early-stage technology companies with innovative solutions. Focus on scalable business models and high-growth potential.',
      amount_range_min: 50000,
      amount_range_max: 250000,
      eligibility_criteria: [
        'Technology-focused startup',
        'Less than 3 years in operation',
        'Scalable business model',
        'Located in designated zones',
        'Minimum 2 founders',
      ],
      application_url: 'https://seda.org.za/tech-accelerator',
      deadline: getFutureDeadline(4),
      industry_focus: ['Technology', 'Software', 'Innovation'],
      funding_type: 'Equity + Grant',
      requirements: ['Pitch deck', 'Product demo', 'Team overview', 'Financial projections'],
    },
  },
  {
    id: 'tech-002',
    name: 'Digital Transformation Grant',
    category: 'Technology',
    industry: ['Technology', 'Digital', 'E-commerce'],
    fundingType: 'Grant',
    amountRange: { min: 100000, max: 500000 },
    data: {
      funder_name: 'Department of Trade, Industry and Competition',
      program_name: 'Digital Transformation Grant',
      description: 'Support for SMMEs looking to digitize operations, implement e-commerce solutions, or adopt digital technologies.',
      amount_range_min: 100000,
      amount_range_max: 500000,
      eligibility_criteria: [
        'Registered SMME in South Africa',
        'Annual turnover between R1m - R50m',
        'Digital transformation project plan',
        'At least 1 year in operation',
      ],
      application_url: 'https://thedtic.gov.za/digital-grant',
      deadline: getFutureDeadline(5),
      industry_focus: ['Technology', 'Digital', 'E-commerce', 'Retail'],
      funding_type: 'Grant',
      requirements: ['Business plan', 'Digital transformation proposal', 'Financial statements', 'Tax clearance'],
    },
  },
  {
    id: 'tech-003',
    name: 'AI Innovation Fund',
    category: 'Technology',
    industry: ['Technology', 'Artificial Intelligence', 'Machine Learning'],
    fundingType: 'Grant',
    amountRange: { min: 200000, max: 1000000 },
    data: {
      funder_name: 'Innovation Hub',
      program_name: 'AI Innovation Fund',
      description: 'Funding for businesses developing AI and machine learning solutions with commercial applications.',
      amount_range_min: 200000,
      amount_range_max: 1000000,
      eligibility_criteria: [
        'AI/ML focused business',
        'Proof of concept or MVP',
        'Technical team with relevant expertise',
        'Commercial viability demonstrated',
      ],
      application_url: 'https://innovationhub.co.za/ai-fund',
      deadline: getFutureDeadline(6),
      industry_focus: ['Technology', 'Artificial Intelligence', 'Machine Learning', 'Data Science'],
      funding_type: 'Grant',
      requirements: ['Technical proposal', 'MVP demonstration', 'Team CVs', 'Market analysis'],
    },
  },

  // MANUFACTURING & INDUSTRIAL
  {
    id: 'mfg-001',
    name: 'Manufacturing Expansion Loan',
    category: 'Manufacturing',
    industry: ['Manufacturing', 'Automotive', 'Industrial'],
    fundingType: 'Loan',
    amountRange: { min: 200000, max: 2000000 },
    data: {
      funder_name: 'Industrial Development Corporation',
      program_name: 'Manufacturing Expansion Loan',
      description: 'Low-interest loans for manufacturing businesses looking to expand operations, upgrade equipment, or increase production capacity.',
      amount_range_min: 200000,
      amount_range_max: 2000000,
      eligibility_criteria: [
        'Established manufacturing business',
        'Minimum 3 years trading history',
        'Job creation potential',
        'Export potential',
        'Positive cash flow',
      ],
      application_url: 'https://idc.co.za/manufacturing-loan',
      deadline: getFutureDeadline(8),
      industry_focus: ['Manufacturing', 'Automotive', 'Industrial', 'Engineering'],
      funding_type: 'Loan',
      requirements: ['Audited financial statements', 'Business expansion plan', 'Collateral documentation', 'Cash flow projections'],
    },
  },
  {
    id: 'mfg-002',
    name: 'Green Energy Innovation Grant',
    category: 'Manufacturing',
    industry: ['Manufacturing', 'Energy', 'Technology'],
    fundingType: 'Grant',
    amountRange: { min: 100000, max: 500000 },
    data: {
      funder_name: 'ELIDZ Development Fund',
      program_name: 'Green Energy Innovation Grant',
      description: 'Supporting renewable energy initiatives for small and medium enterprises in the manufacturing sector.',
      amount_range_min: 100000,
      amount_range_max: 500000,
      eligibility_criteria: [
        'Registered SMME in South Africa',
        'Focus on renewable energy or sustainability',
        'Annual revenue between R500k - R10m',
        'At least 2 years in operation',
      ],
      application_url: 'https://elidz.co.za/green-energy-grant',
      deadline: getFutureDeadline(6),
      industry_focus: ['Manufacturing', 'Energy', 'Technology', 'Sustainability'],
      funding_type: 'Grant',
      requirements: ['Business plan', 'Financial statements', 'Tax clearance certificate', 'Environmental impact assessment'],
    },
  },
  {
    id: 'mfg-003',
    name: 'Local Content Manufacturing Support',
    category: 'Manufacturing',
    industry: ['Manufacturing', 'Industrial', 'Production'],
    fundingType: 'Grant',
    amountRange: { min: 150000, max: 750000 },
    data: {
      funder_name: 'Manufacturing Competitiveness Enhancement Programme',
      program_name: 'Local Content Manufacturing Support',
      description: 'Support for manufacturers producing goods with high local content, creating jobs and supporting local supply chains.',
      amount_range_min: 150000,
      amount_range_max: 750000,
      eligibility_criteria: [
        'Manufacturing business with 60%+ local content',
        'Job creation of minimum 10 positions',
        'Established supply chain',
        'Minimum 2 years in operation',
      ],
      application_url: 'https://thedtic.gov.za/mcep',
      deadline: getFutureDeadline(7),
      industry_focus: ['Manufacturing', 'Industrial', 'Production', 'Supply Chain'],
      funding_type: 'Grant',
      requirements: ['Local content certification', 'Job creation plan', 'Supply chain documentation', 'Financial statements'],
    },
  },

  // AGRICULTURE & AGRIBUSINESS
  {
    id: 'agri-001',
    name: 'Agribusiness Development Fund',
    category: 'Agriculture',
    industry: ['Agriculture', 'Farming', 'Agribusiness'],
    fundingType: 'Loan + Grant',
    amountRange: { min: 100000, max: 500000 },
    data: {
      funder_name: 'Land Bank',
      program_name: 'Agribusiness Development Fund',
      description: 'Comprehensive funding for agricultural businesses including crop production, livestock, and agri-processing.',
      amount_range_min: 100000,
      amount_range_max: 500000,
      eligibility_criteria: [
        'Registered agricultural business',
        'Land ownership or lease agreement',
        'Minimum 1 year farming experience',
        'Business plan for agricultural operations',
      ],
      application_url: 'https://landbank.co.za/agri-fund',
      deadline: getFutureDeadline(5),
      industry_focus: ['Agriculture', 'Farming', 'Agribusiness', 'Food Production'],
      funding_type: 'Loan + Grant',
      requirements: ['Land ownership/lease documents', 'Agricultural business plan', 'Financial statements', 'Environmental compliance'],
    },
  },
  {
    id: 'agri-002',
    name: 'Food Processing Innovation Grant',
    category: 'Agriculture',
    industry: ['Agriculture', 'Food Processing', 'Manufacturing'],
    fundingType: 'Grant',
    amountRange: { min: 200000, max: 1000000 },
    data: {
      funder_name: 'Department of Agriculture, Land Reform and Rural Development',
      program_name: 'Food Processing Innovation Grant',
      description: 'Funding for food processing businesses looking to add value to agricultural products through processing and packaging.',
      amount_range_min: 200000,
      amount_range_max: 1000000,
      eligibility_criteria: [
        'Food processing business',
        'Value addition to agricultural products',
        'Job creation potential',
        'Market access demonstrated',
      ],
      application_url: 'https://dalrrd.gov.za/food-processing',
      deadline: getFutureDeadline(6),
      industry_focus: ['Agriculture', 'Food Processing', 'Manufacturing', 'Packaging'],
      funding_type: 'Grant',
      requirements: ['Processing facility plan', 'Market analysis', 'Food safety certification', 'Financial projections'],
    },
  },

  // TOURISM & HOSPITALITY
  {
    id: 'tourism-001',
    name: 'Tourism Enterprise Development Fund',
    category: 'Tourism',
    industry: ['Tourism', 'Hospitality', 'Travel'],
    fundingType: 'Grant',
    amountRange: { min: 50000, max: 300000 },
    data: {
      funder_name: 'Tourism Enterprise Partnership',
      program_name: 'Tourism Enterprise Development Fund',
      description: 'Support for tourism and hospitality businesses including accommodation, tour operators, and tourism services.',
      amount_range_min: 50000,
      amount_range_max: 300000,
      eligibility_criteria: [
        'Tourism or hospitality business',
        'Registered with relevant tourism authority',
        'Minimum 1 year in operation',
        'Tourism grading or certification',
      ],
      application_url: 'https://tep.co.za/development-fund',
      deadline: getFutureDeadline(4),
      industry_focus: ['Tourism', 'Hospitality', 'Travel', 'Accommodation'],
      funding_type: 'Grant',
      requirements: ['Tourism registration', 'Business plan', 'Financial statements', 'Grading certificate'],
    },
  },
  {
    id: 'tourism-002',
    name: 'Cultural Tourism Initiative',
    category: 'Tourism',
    industry: ['Tourism', 'Culture', 'Heritage'],
    fundingType: 'Grant',
    amountRange: { min: 75000, max: 400000 },
    data: {
      funder_name: 'Department of Sport, Arts and Culture',
      program_name: 'Cultural Tourism Initiative',
      description: 'Funding for businesses promoting cultural heritage, arts, and traditional experiences for tourists.',
      amount_range_min: 75000,
      amount_range_max: 400000,
      eligibility_criteria: [
        'Cultural or heritage tourism business',
        'Community involvement',
        'Preservation of cultural heritage',
        'Tourism potential demonstrated',
      ],
      application_url: 'https://dsac.gov.za/cultural-tourism',
      deadline: getFutureDeadline(5),
      industry_focus: ['Tourism', 'Culture', 'Heritage', 'Arts'],
      funding_type: 'Grant',
      requirements: ['Cultural heritage documentation', 'Community engagement plan', 'Tourism marketing plan', 'Financial statements'],
    },
  },

  // RETAIL & WHOLESALE
  {
    id: 'retail-001',
    name: 'Retail Expansion Programme',
    category: 'Retail',
    industry: ['Retail', 'Wholesale', 'E-commerce'],
    fundingType: 'Loan',
    amountRange: { min: 100000, max: 500000 },
    data: {
      funder_name: 'Small Enterprise Finance Agency',
      program_name: 'Retail Expansion Programme',
      description: 'Loans for retail and wholesale businesses looking to expand, open new locations, or increase inventory.',
      amount_range_min: 100000,
      amount_range_max: 500000,
      eligibility_criteria: [
        'Retail or wholesale business',
        'Minimum 2 years trading history',
        'Positive cash flow',
        'Expansion plan',
      ],
      application_url: 'https://sefa.org.za/retail-expansion',
      deadline: getFutureDeadline(6),
      industry_focus: ['Retail', 'Wholesale', 'E-commerce', 'Distribution'],
      funding_type: 'Loan',
      requirements: ['Financial statements', 'Expansion plan', 'Market analysis', 'Cash flow projections'],
    },
  },

  // CONSTRUCTION & INFRASTRUCTURE
  {
    id: 'construction-001',
    name: 'Construction SMME Support Fund',
    category: 'Construction',
    industry: ['Construction', 'Infrastructure', 'Engineering'],
    fundingType: 'Loan + Grant',
    amountRange: { min: 200000, max: 1500000 },
    data: {
      funder_name: 'Construction Industry Development Board',
      program_name: 'Construction SMME Support Fund',
      description: 'Funding for construction businesses including equipment purchase, working capital, and project financing.',
      amount_range_min: 200000,
      amount_range_max: 1500000,
      eligibility_criteria: [
        'Registered construction business',
        'CIDB grading',
        'Minimum 2 years in operation',
        'Track record of completed projects',
      ],
      application_url: 'https://cidb.org.za/smme-fund',
      deadline: getFutureDeadline(7),
      industry_focus: ['Construction', 'Infrastructure', 'Engineering', 'Building'],
      funding_type: 'Loan + Grant',
      requirements: ['CIDB certificate', 'Project portfolio', 'Financial statements', 'Equipment quotes'],
    },
  },

  // CREATIVE INDUSTRIES
  {
    id: 'creative-001',
    name: 'Creative Industries Development Fund',
    category: 'Creative',
    industry: ['Creative', 'Arts', 'Media', 'Entertainment'],
    fundingType: 'Grant',
    amountRange: { min: 25000, max: 200000 },
    data: {
      funder_name: 'National Arts Council',
      program_name: 'Creative Industries Development Fund',
      description: 'Support for creative businesses in film, music, design, fashion, and other creative sectors.',
      amount_range_min: 25000,
      amount_range_max: 200000,
      eligibility_criteria: [
        'Creative industry business',
        'Portfolio of creative work',
        'Commercial viability',
        'Minimum 1 year in operation',
      ],
      application_url: 'https://nac.org.za/creative-fund',
      deadline: getFutureDeadline(4),
      industry_focus: ['Creative', 'Arts', 'Media', 'Entertainment', 'Design'],
      funding_type: 'Grant',
      requirements: ['Portfolio of work', 'Business plan', 'Market analysis', 'Financial statements'],
    },
  },

  // HEALTHCARE & PHARMACEUTICALS
  {
    id: 'health-001',
    name: 'Healthcare Innovation Grant',
    category: 'Healthcare',
    industry: ['Healthcare', 'Pharmaceuticals', 'Medical'],
    fundingType: 'Grant',
    amountRange: { min: 150000, max: 800000 },
    data: {
      funder_name: 'Department of Health',
      program_name: 'Healthcare Innovation Grant',
      description: 'Funding for healthcare businesses providing innovative medical services, products, or solutions.',
      amount_range_min: 150000,
      amount_range_max: 800000,
      eligibility_criteria: [
        'Healthcare or medical business',
        'Relevant licenses and certifications',
        'Innovative healthcare solution',
        'Minimum 1 year in operation',
      ],
      application_url: 'https://health.gov.za/innovation-grant',
      deadline: getFutureDeadline(6),
      industry_focus: ['Healthcare', 'Pharmaceuticals', 'Medical', 'Wellness'],
      funding_type: 'Grant',
      requirements: ['Medical licenses', 'Business plan', 'Regulatory compliance', 'Financial statements'],
    },
  },

  // EDUCATION & TRAINING
  {
    id: 'education-001',
    name: 'Skills Development Fund',
    category: 'Education',
    industry: ['Education', 'Training', 'Skills Development'],
    fundingType: 'Grant',
    amountRange: { min: 100000, max: 500000 },
    data: {
      funder_name: 'Sector Education and Training Authority',
      program_name: 'Skills Development Fund',
      description: 'Funding for training providers and educational businesses offering skills development programs.',
      amount_range_min: 100000,
      amount_range_max: 500000,
      eligibility_criteria: [
        'Registered training provider',
        'Accredited programs',
        'Skills development focus',
        'Minimum 2 years in operation',
      ],
      application_url: 'https://seta.org.za/skills-fund',
      deadline: getFutureDeadline(5),
      industry_focus: ['Education', 'Training', 'Skills Development', 'Vocational'],
      funding_type: 'Grant',
      requirements: ['Accreditation certificates', 'Training program outline', 'Business plan', 'Financial statements'],
    },
  },

  // TRANSPORT & LOGISTICS
  {
    id: 'transport-001',
    name: 'Transport and Logistics Support',
    category: 'Transport',
    industry: ['Transport', 'Logistics', 'Freight'],
    fundingType: 'Loan',
    amountRange: { min: 150000, max: 1000000 },
    data: {
      funder_name: 'Transport Enterprise Development Fund',
      program_name: 'Transport and Logistics Support',
      description: 'Loans for transport and logistics businesses including vehicle purchase, fleet expansion, and working capital.',
      amount_range_min: 150000,
      amount_range_max: 1000000,
      eligibility_criteria: [
        'Transport or logistics business',
        'Valid operating licenses',
        'Minimum 2 years in operation',
        'Fleet or operational capacity',
      ],
      application_url: 'https://transportfund.co.za/apply',
      deadline: getFutureDeadline(6),
      industry_focus: ['Transport', 'Logistics', 'Freight', 'Distribution'],
      funding_type: 'Loan',
      requirements: ['Operating licenses', 'Fleet documentation', 'Financial statements', 'Business plan'],
    },
  },

  // ENERGY & RENEWABLES
  {
    id: 'energy-001',
    name: 'Renewable Energy Development Fund',
    category: 'Energy',
    industry: ['Energy', 'Renewable Energy', 'Solar', 'Wind'],
    fundingType: 'Grant + Loan',
    amountRange: { min: 300000, max: 2000000 },
    data: {
      funder_name: 'Department of Mineral Resources and Energy',
      program_name: 'Renewable Energy Development Fund',
      description: 'Comprehensive funding for renewable energy projects including solar, wind, and other clean energy initiatives.',
      amount_range_min: 300000,
      amount_range_max: 2000000,
      eligibility_criteria: [
        'Renewable energy project',
        'Technical feasibility study',
        'Environmental impact assessment',
        'Grid connection or off-grid solution',
      ],
      application_url: 'https://dmre.gov.za/renewable-fund',
      deadline: getFutureDeadline(8),
      industry_focus: ['Energy', 'Renewable Energy', 'Solar', 'Wind', 'Sustainability'],
      funding_type: 'Grant + Loan',
      requirements: ['Feasibility study', 'Environmental assessment', 'Technical specifications', 'Financial projections'],
    },
  },

  // MINING & MINERALS
  {
    id: 'mining-001',
    name: 'Small Scale Mining Support',
    category: 'Mining',
    industry: ['Mining', 'Minerals', 'Extraction'],
    fundingType: 'Loan',
    amountRange: { min: 250000, max: 1500000 },
    data: {
      funder_name: 'Mining Development Fund',
      program_name: 'Small Scale Mining Support',
      description: 'Funding for small-scale mining operations including equipment, exploration, and operational costs.',
      amount_range_min: 250000,
      amount_range_max: 1500000,
      eligibility_criteria: [
        'Valid mining license',
        'Small-scale mining operation',
        'Environmental compliance',
        'Minimum 1 year mining experience',
      ],
      application_url: 'https://miningfund.co.za/apply',
      deadline: getFutureDeadline(7),
      industry_focus: ['Mining', 'Minerals', 'Extraction', 'Resources'],
      funding_type: 'Loan',
      requirements: ['Mining license', 'Environmental compliance', 'Mining plan', 'Financial statements'],
    },
  },

  // TEXTILES & CLOTHING
  {
    id: 'textile-001',
    name: 'Textile and Clothing Development Fund',
    category: 'Textiles',
    industry: ['Textiles', 'Clothing', 'Fashion', 'Manufacturing'],
    fundingType: 'Grant',
    amountRange: { min: 100000, max: 600000 },
    data: {
      funder_name: 'Textile and Clothing Industry Development Fund',
      program_name: 'Textile and Clothing Development Fund',
      description: 'Support for textile and clothing manufacturers including equipment, raw materials, and capacity building.',
      amount_range_min: 100000,
      amount_range_max: 600000,
      eligibility_criteria: [
        'Textile or clothing manufacturer',
        'Local production focus',
        'Job creation potential',
        'Minimum 1 year in operation',
      ],
      application_url: 'https://textilefund.co.za/apply',
      deadline: getFutureDeadline(5),
      industry_focus: ['Textiles', 'Clothing', 'Fashion', 'Manufacturing'],
      funding_type: 'Grant',
      requirements: ['Production plan', 'Equipment quotes', 'Market analysis', 'Financial statements'],
    },
  },

  // GENERAL BUSINESS SUPPORT
  {
    id: 'general-001',
    name: 'General Business Development Fund',
    category: 'General',
    industry: ['General Business', 'SMME', 'Enterprise'],
    fundingType: 'Loan',
    amountRange: { min: 50000, max: 500000 },
    data: {
      funder_name: 'Small Enterprise Finance Agency',
      program_name: 'General Business Development Fund',
      description: 'Flexible funding for various SMME businesses for working capital, equipment purchase, or business expansion.',
      amount_range_min: 50000,
      amount_range_max: 500000,
      eligibility_criteria: [
        'Registered SMME',
        'Minimum 1 year in operation',
        'Viable business model',
        'Positive cash flow or growth potential',
      ],
      application_url: 'https://sefa.org.za/general-fund',
      deadline: getFutureDeadline(6),
      industry_focus: ['General Business', 'SMME', 'Enterprise'],
      funding_type: 'Loan',
      requirements: ['Business plan', 'Financial statements', 'Cash flow projections', 'Tax clearance'],
    },
  },
  {
    id: 'general-002',
    name: 'Women-Owned Business Fund',
    category: 'General',
    industry: ['General Business', 'Women-Owned', 'Enterprise'],
    fundingType: 'Grant + Loan',
    amountRange: { min: 50000, max: 300000 },
    data: {
      funder_name: 'Women Entrepreneurship Fund',
      program_name: 'Women-Owned Business Fund',
      description: 'Dedicated funding for women-owned businesses across all sectors, with mentorship and support programs.',
      amount_range_min: 50000,
      amount_range_max: 300000,
      eligibility_criteria: [
        'Women-owned business (51%+ ownership)',
        'Registered SMME',
        'Minimum 6 months in operation',
        'Business growth potential',
      ],
      application_url: 'https://womenfund.co.za/apply',
      deadline: getFutureDeadline(5),
      industry_focus: ['General Business', 'Women-Owned', 'Enterprise'],
      funding_type: 'Grant + Loan',
      requirements: ['Ownership proof', 'Business plan', 'Financial statements', 'Mentorship commitment'],
    },
  },
  {
    id: 'general-003',
    name: 'Youth Entrepreneurship Programme',
    category: 'General',
    industry: ['General Business', 'Youth-Owned', 'Enterprise'],
    fundingType: 'Grant',
    amountRange: { min: 25000, max: 200000 },
    data: {
      funder_name: 'National Youth Development Agency',
      program_name: 'Youth Entrepreneurship Programme',
      description: 'Funding and support for young entrepreneurs (18-35 years) starting or growing their businesses.',
      amount_range_min: 25000,
      amount_range_max: 200000,
      eligibility_criteria: [
        'Business owner aged 18-35',
        'Registered business',
        'Business plan',
        'Entrepreneurship training completed',
      ],
      application_url: 'https://nyda.gov.za/youth-entrepreneurship',
      deadline: getFutureDeadline(4),
      industry_focus: ['General Business', 'Youth-Owned', 'Enterprise'],
      funding_type: 'Grant',
      requirements: ['Age proof', 'Business plan', 'Training certificate', 'Financial projections'],
    },
  },
]

/**
 * Get opportunities by category
 */
export function getOpportunitiesByCategory(category: string): OpportunityTemplate[] {
  return opportunityPool.filter((opp) => opp.category === category)
}

/**
 * Get opportunities by industry
 */
export function getOpportunitiesByIndustry(industry: string): OpportunityTemplate[] {
  return opportunityPool.filter((opp) => opp.industry.includes(industry))
}

/**
 * Get opportunities by funding type
 */
export function getOpportunitiesByFundingType(fundingType: string): OpportunityTemplate[] {
  return opportunityPool.filter((opp) => opp.fundingType === fundingType)
}

/**
 * Search opportunities by keyword
 */
export function searchOpportunities(keyword: string): OpportunityTemplate[] {
  const lowerKeyword = keyword.toLowerCase()
  return opportunityPool.filter(
    (opp) =>
      opp.name.toLowerCase().includes(lowerKeyword) ||
      opp.data.funder_name.toLowerCase().includes(lowerKeyword) ||
      opp.data.program_name.toLowerCase().includes(lowerKeyword) ||
      opp.data.description.toLowerCase().includes(lowerKeyword)
  )
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
  return Array.from(new Set(opportunityPool.map((opp) => opp.category))).sort()
}

/**
 * Get all unique industries
 */
export function getIndustries(): string[] {
  const industries = new Set<string>()
  opportunityPool.forEach((opp) => {
    if (opp.data.industry_focus && Array.isArray(opp.data.industry_focus)) {
      opp.data.industry_focus.forEach((ind) => industries.add(ind))
    }
  })
  return Array.from(industries).sort()
}

/**
 * Get all unique funding types
 */
export function getFundingTypes(): string[] {
  return Array.from(new Set(opportunityPool.map((opp) => opp.fundingType))).sort()
}

