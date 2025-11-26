// Prisma Seed Script
// Seeds the database with initial funding opportunities
// Run with: npm run db:seed or pnpm db:seed

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Sample funding opportunities data
const sampleOpportunities = [
  {
    funderName: 'ELIDZ Development Fund',
    programName: 'Green Energy Innovation Grant',
    description:
      'Supporting renewable energy initiatives for small and medium enterprises in the manufacturing sector. This grant aims to accelerate the adoption of sustainable energy solutions and promote environmental responsibility among SMMEs.',
    amountRangeMin: 100000,
    amountRangeMax: 500000,
    eligibilityCriteria: [
      'Registered SMME in South Africa',
      'Focus on renewable energy or sustainability',
      'Annual revenue between R500k - R10m',
      'At least 2 years in operation',
      'Valid tax clearance certificate',
    ],
    applicationUrl: 'https://example.com/apply/green-energy',
    deadline: new Date('2025-06-30'),
    industryFocus: ['Manufacturing', 'Energy', 'Technology'],
    fundingType: 'Grant',
    requirements: [
      'Business plan',
      'Financial statements (last 2 years)',
      'Tax clearance certificate',
      'Environmental impact assessment',
      'Project proposal',
    ],
  },
  {
    funderName: 'Small Enterprise Development Agency',
    programName: 'Technology Startup Accelerator',
    description:
      'Funding for early-stage technology companies with innovative solutions. This program provides both financial support and mentorship to help tech startups scale and succeed in the market.',
    amountRangeMin: 50000,
    amountRangeMax: 250000,
    eligibilityCriteria: [
      'Technology-focused startup',
      'Less than 3 years in operation',
      'Scalable business model',
      'Located in designated zones',
      'Innovative product or service',
    ],
    applicationUrl: 'https://example.com/apply/tech-accelerator',
    deadline: new Date('2025-07-15'),
    industryFocus: ['Technology', 'Software', 'Innovation'],
    fundingType: 'Equity + Grant',
    requirements: [
      'Pitch deck',
      'Product demo or prototype',
      'Team overview',
      'Market analysis',
      'Financial projections',
    ],
  },
  {
    funderName: 'Industrial Development Corporation',
    programName: 'Manufacturing Expansion Loan',
    description:
      'Low-interest loans for manufacturing businesses looking to expand operations. This program supports job creation and economic growth through manufacturing sector development.',
    amountRangeMin: 200000,
    amountRangeMax: 2000000,
    eligibilityCriteria: [
      'Established manufacturing business',
      'Minimum 3 years trading history',
      'Job creation potential (minimum 10 new jobs)',
      'Export potential',
      'B-BBEE compliant',
    ],
    applicationUrl: 'https://example.com/apply/manufacturing-loan',
    deadline: new Date('2025-08-30'),
    industryFocus: ['Manufacturing', 'Automotive', 'Industrial'],
    fundingType: 'Loan',
    requirements: [
      'Audited financial statements (last 3 years)',
      'Business expansion plan',
      'Collateral documentation',
      'Feasibility study',
      'B-BBEE certificate',
    ],
  },
  {
    funderName: 'Department of Small Business Development',
    programName: 'Rural Business Development Grant',
    description:
      'Supporting rural and township businesses with grants to improve infrastructure, purchase equipment, and create employment opportunities in underserved communities.',
    amountRangeMin: 50000,
    amountRangeMax: 300000,
    eligibilityCriteria: [
      'Business located in rural or township area',
      'At least 1 year in operation',
      'Job creation focus',
      'Community impact potential',
      'South African citizen owned',
    ],
    applicationUrl: 'https://example.com/apply/rural-business',
    deadline: new Date('2025-09-30'),
    industryFocus: ['Agriculture', 'Retail', 'Services', 'Manufacturing'],
    fundingType: 'Grant',
    requirements: [
      'Business registration documents',
      'Proof of location (rural/township)',
      'Business plan',
      'Financial statements',
      'Community impact proposal',
    ],
  },
  {
    funderName: 'National Empowerment Fund',
    programName: 'Black Industrialists Programme',
    description:
      'Equity and loan funding for black-owned industrial businesses. This program aims to transform the industrial sector and promote black economic empowerment.',
    amountRangeMin: 500000,
    amountRangeMax: 5000000,
    eligibilityCriteria: [
      '51% black-owned business',
      'Industrial or manufacturing focus',
      'Minimum 2 years in operation',
      'Revenue potential of R5m+',
      'B-BBEE Level 1-4',
    ],
    applicationUrl: 'https://example.com/apply/black-industrialists',
    deadline: new Date('2025-10-15'),
    industryFocus: ['Manufacturing', 'Industrial', 'Technology', 'Energy'],
    fundingType: 'Equity + Loan',
    requirements: [
      'B-BBEE certificate',
      'Shareholding structure',
      'Business plan',
      'Financial statements',
      'Industrial development plan',
    ],
  },
  {
    funderName: 'Technology Innovation Agency',
    programName: 'Innovation Support Programme',
    description:
      'Grants for technology innovation and R&D projects. Supporting businesses that develop new technologies, products, or processes with commercial potential.',
    amountRangeMin: 100000,
    amountRangeMax: 1000000,
    eligibilityCriteria: [
      'Technology innovation focus',
      'R&D component',
      'Commercial viability',
      'IP protection potential',
      'South African registered entity',
    ],
    applicationUrl: 'https://example.com/apply/innovation-support',
    deadline: new Date('2025-11-30'),
    industryFocus: ['Technology', 'Healthcare', 'Energy', 'Agriculture'],
    fundingType: 'Grant',
    requirements: [
      'Innovation proposal',
      'Technical documentation',
      'IP strategy',
      'Market analysis',
      'R&D plan',
    ],
  },
]

async function main() {
  console.log('🌱 Starting database seed...')

  // Test database connection
  try {
    await prisma.$connect()
    console.log('✓ Database connection established')
  } catch (error: any) {
    console.error('❌ Failed to connect to database')
    console.error('   Please ensure DATABASE_URL is set in your .env.local file')
    console.error('   Error:', error.message)
    throw error
  }

  // Check if opportunities already exist
  let existingCount = 0
  try {
    existingCount = await prisma.fundingOpportunity.count()
  } catch (error: any) {
    console.error('❌ Failed to query database')
    console.error('   Error:', error.message)
    throw error
  }
  
  if (existingCount > 0) {
    console.log(`ℹ️  Found ${existingCount} existing opportunities in database.`)
    console.log('   To reseed, please delete existing opportunities first.')
    console.log('   Skipping seed to avoid duplicates.')
    return
  }

  // Seed opportunities
  console.log(`📝 Seeding ${sampleOpportunities.length} funding opportunities...`)
  
  for (const opp of sampleOpportunities) {
    try {
      await prisma.fundingOpportunity.create({
        data: opp,
      })
      console.log(`   ✓ Created: ${opp.programName}`)
    } catch (error: any) {
      console.error(`   ✗ Failed to create ${opp.programName}:`, error.message)
    }
  }

  const finalCount = await prisma.fundingOpportunity.count()
  console.log(`\n✅ Seed completed! Created ${finalCount} funding opportunities.`)
  console.log('   You can now browse opportunities in the application.')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

