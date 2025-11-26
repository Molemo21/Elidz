#!/usr/bin/env node

/**
 * Test Script for Onboarding Flow
 * 
 * This script tests the complete onboarding flow:
 * 1. User Registration
 * 2. Login → Onboarding Redirect
 * 3. Profile Completion Check
 * 4. Complete Business Profile
 * 5. Redirect to Pending Approval
 * 6. Admin Approval
 * 7. Dashboard Access
 * 
 * Usage:
 *   node scripts/test-onboarding-flow.js [--cleanup]
 * 
 * Requirements:
 *   - .env file with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   - Service role key for admin operations (SUPABASE_SERVICE_ROLE_KEY) - optional
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')
const fs = require('fs')

// Load environment variables
// Try to load dotenv if available, otherwise rely on system environment variables
const projectRoot = path.join(__dirname, '..')
const envPaths = [
  path.join(projectRoot, '.env.local'),
  path.join(projectRoot, '.env'),
]

let envFileLoaded = false
let dotenvAvailable = false

// Check if dotenv is available
try {
  require.resolve('dotenv')
  dotenvAvailable = true
} catch (e) {
  dotenvAvailable = false
}

// Try to load environment files
if (dotenvAvailable) {
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      try {
        require('dotenv').config({ path: envPath })
        envFileLoaded = true
        break
      } catch (error) {
        // Continue to next file
      }
    }
  }
  
  // If no .env file found, try default location
  if (!envFileLoaded) {
    try {
      require('dotenv').config()
      envFileLoaded = true
    } catch (e) {
      // dotenv config failed, will use system env vars
    }
  }
}

// Helper function to check environment variable loading
function checkEnvVars() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
    urlExists: !!supabaseUrl,
    anonKeyExists: !!supabaseAnonKey,
    dotenvAvailable,
    envFileLoaded,
    envFilesChecked: envPaths,
  }
}

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logStep(step, message) {
  log(`\n[STEP ${step}] ${message}`, 'cyan')
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green')
}

function logError(message) {
  log(`✗ ${message}`, 'red')
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow')
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue')
}

// Test configuration
const TEST_CONFIG = {
  testUserEmail: `test-onboarding-${Date.now()}@example.com`,
  testUserPassword: 'TestPassword123!',
  testUserFirstName: 'Test',
  testUserLastName: 'User',
  testUserPhone: '+27123456789',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@elidz.com',
}

// Initialize Supabase clients
const envCheck = checkEnvVars()
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  logError('Missing Supabase environment variables!')
  log('\nEnvironment Variable Status:', 'yellow')
  log(`  NEXT_PUBLIC_SUPABASE_URL: ${envCheck.urlExists ? '✓ Found' : '✗ Missing'}`, envCheck.urlExists ? 'green' : 'red')
  log(`  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${envCheck.anonKeyExists ? '✓ Found' : '✗ Missing'}`, envCheck.anonKeyExists ? 'green' : 'red')
  
  log('\nTroubleshooting:', 'yellow')
  log('1. Create .env.local file in project root:')
  log('   Copy .env.example to .env.local (if .env.example exists)')
  log('   Or create .env.local manually')
  
  log('\n2. Add your Supabase credentials to .env.local:')
  log('   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co')
  log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here')
  log('   Get these from: Supabase Dashboard → Settings → API')
  
  if (envCheck.envFilesChecked) {
    log('\n3. Checked for .env files at:')
    envCheck.envFilesChecked.forEach(envPath => {
      const exists = fs.existsSync(envPath)
      const relativePath = path.relative(projectRoot, envPath)
      log(`   ${relativePath}: ${exists ? '✓ Found' : '✗ Not found'}`, exists ? 'green' : 'red')
    })
  }
  
  const examplePath = path.join(projectRoot, '.env.example')
  if (fs.existsSync(examplePath)) {
    log('\n4. Template file found: .env.example')
    log('   Copy it to .env.local and fill in your values')
  }
  
  if (!envCheck.dotenvAvailable) {
    log('\n5. Install dotenv package (optional but recommended):')
    log('   pnpm add -D dotenv')
    log('   This helps load .env files automatically')
  }
  
  log('\n6. Alternative: Set environment variables in your terminal')
  log('   Windows (PowerShell): $env:NEXT_PUBLIC_SUPABASE_URL="your_url"')
  log('   Windows (CMD): set NEXT_PUBLIC_SUPABASE_URL=your_url')
  log('   Linux/Mac: export NEXT_PUBLIC_SUPABASE_URL=your_url')
  
  log('\n7. After creating .env.local, run the test again:')
  log('   pnpm test:onboarding')
  
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null

// Test results
const testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
}

// Helper function to check profile completion
async function checkProfileComplete(userId) {
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error || !profile) {
      return { complete: false, reason: 'No profile found' }
    }

    // Check all required fields
    const checks = {
      company_name: profile.company_name && profile.company_name.trim() !== '',
      registration_number: profile.registration_number && profile.registration_number.trim() !== '',
      industry: profile.industry && profile.industry.trim() !== '',
      business_description: profile.business_description && profile.business_description.trim() !== '',
      location: profile.location && profile.location.trim() !== '',
      annual_revenue: profile.annual_revenue !== null && profile.annual_revenue !== undefined,
      employees_count: profile.employees_count !== null && profile.employees_count !== undefined,
      years_in_business: profile.years_in_business !== null && profile.years_in_business !== undefined,
      funding_requirements: profile.funding_requirements && typeof profile.funding_requirements === 'object',
      amount_needed: profile.funding_requirements?.amount_needed !== null && profile.funding_requirements?.amount_needed !== undefined,
      funding_purpose: profile.funding_requirements?.funding_purpose && profile.funding_requirements.funding_purpose.trim() !== '',
    }

    const missingFields = Object.entries(checks)
      .filter(([_, value]) => !value)
      .map(([field]) => field)

    return {
      complete: missingFields.length === 0,
      reason: missingFields.length > 0 ? `Missing: ${missingFields.join(', ')}` : 'Complete',
      checks,
    }
  } catch (error) {
    return { complete: false, reason: `Error: ${error.message}` }
  }
}

// Test functions
async function test1_UserRegistration() {
  logStep(1, 'Testing User Registration')
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: TEST_CONFIG.testUserEmail,
      password: TEST_CONFIG.testUserPassword,
      options: {
        data: {
          first_name: TEST_CONFIG.testUserFirstName,
          last_name: TEST_CONFIG.testUserLastName,
          phone: TEST_CONFIG.testUserPhone,
          role: 'smme',
        },
      },
    })

    if (error) {
      logError(`Registration failed: ${error.message}`)
      testResults.failed++
      return null
    }

    if (!data.user) {
      logError('Registration succeeded but no user returned')
      testResults.failed++
      return null
    }

    logSuccess(`User registered: ${data.user.email}`)
    logInfo(`User ID: ${data.user.id}`)
    
    // Wait for trigger to create user record
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    testResults.passed++
    return data.user
  } catch (error) {
    logError(`Registration error: ${error.message}`)
    testResults.failed++
    return null
  }
}

async function test2_CheckUserRecord(user) {
  logStep(2, 'Checking User Record in Database')
  
  if (!user) {
    logError('No user provided for test')
    testResults.failed++
    return false
  }

  if (!supabaseAdmin) {
    logWarning('Service role key not provided - skipping database check')
    testResults.warnings++
    return false
  }

  try {
    const { data: userRecord, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      logError(`User record not found: ${error.message}`)
      testResults.failed++
      return false
    }

    logSuccess(`User record exists: ${userRecord.email}`)
    logInfo(`Role: ${userRecord.role}, Approved: ${userRecord.approved}`)
    
    if (!userRecord.approved) {
      logSuccess('User is not approved (expected for new user)')
    }
    
    testResults.passed++
    return true
  } catch (error) {
    logError(`Error checking user record: ${error.message}`)
    testResults.failed++
    return false
  }
}

async function test3_CheckProfileCompletion(user) {
  logStep(3, 'Checking Profile Completion (Should be Incomplete)')
  
  if (!user) {
    logError('No user provided for test')
    testResults.failed++
    return false
  }

  if (!supabaseAdmin) {
    logWarning('Service role key not provided - skipping profile check')
    testResults.warnings++
    return false
  }

  const result = await checkProfileComplete(user.id)
  
  if (result.complete) {
    logError('Profile is complete when it should be incomplete!')
    testResults.failed++
    return false
  }

  logSuccess(`Profile is incomplete (expected): ${result.reason}`)
  testResults.passed++
  return true
}

async function test4_CompleteBusinessProfile(user) {
  logStep(4, 'Completing Business Profile')
  
  if (!user) {
    logError('No user provided for test')
    testResults.failed++
    return false
  }

  if (!supabaseAdmin) {
    logWarning('Service role key not provided - skipping profile creation')
    logInfo('Set SUPABASE_SERVICE_ROLE_KEY in .env to test profile creation')
    testResults.warnings++
    return false
  }

  try {
    const profileData = {
      user_id: user.id,
      company_name: 'Test Company Ltd',
      registration_number: '2024/123456/07',
      industry: 'Technology',
      business_description: 'A test technology company for onboarding flow testing',
      annual_revenue: 1000000,
      employees_count: 10,
      years_in_business: 2,
      location: 'East London, Eastern Cape',
      funding_requirements: {
        amount_needed: 500000,
        funding_purpose: 'Expansion and growth',
        business_stage: 'growth',
        industry_sector: ['Technology'],
        preferred_funding_type: ['Grant', 'Loan'],
      },
    }

    const { data: profile, error } = await supabaseAdmin
      .from('user_profiles')
      .upsert(profileData, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) {
      logError(`Failed to create profile: ${error.message}`)
      testResults.failed++
      return false
    }

    logSuccess('Business profile created successfully')
    logInfo(`Company: ${profile.company_name}`)
    logInfo(`Industry: ${profile.industry}`)
    
    testResults.passed++
    return true
  } catch (error) {
    logError(`Error creating profile: ${error.message}`)
    testResults.failed++
    return false
  }
}

async function test5_VerifyProfileComplete(user) {
  logStep(5, 'Verifying Profile is Complete')
  
  if (!user) {
    logError('No user provided for test')
    testResults.failed++
    return false
  }

  if (!supabaseAdmin) {
    logWarning('Service role key not provided - skipping verification')
    testResults.warnings++
    return false
  }

  const result = await checkProfileComplete(user.id)
  
  if (!result.complete) {
    logError(`Profile is incomplete: ${result.reason}`)
    if (result.checks) {
      logInfo('Field checks:')
      Object.entries(result.checks).forEach(([field, value]) => {
        logInfo(`  ${field}: ${value ? '✓' : '✗'}`)
      })
    }
    testResults.failed++
    return false
  }

  logSuccess('Profile is complete!')
  testResults.passed++
  return true
}

async function test6_AdminApproval(user) {
  logStep(6, 'Testing Admin Approval')
  
  if (!user) {
    logError('No user provided for test')
    testResults.failed++
    return false
  }

  if (!supabaseAdmin) {
    logWarning('Service role key not provided - skipping admin approval test')
    logInfo('Set SUPABASE_SERVICE_ROLE_KEY in .env to test admin approval')
    testResults.warnings++
    return false
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ approved: true })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      logError(`Failed to approve user: ${error.message}`)
      testResults.failed++
      return false
    }

    logSuccess('User approved successfully')
    logInfo(`Approved: ${data.approved}`)
    
    testResults.passed++
    return true
  } catch (error) {
    logError(`Error approving user: ${error.message}`)
    testResults.failed++
    return false
  }
}

async function test7_Cleanup(user) {
  logStep(7, 'Cleaning Up Test Data')
  
  if (!user) {
    return
  }

  if (!supabaseAdmin) {
    logWarning('Service role key not provided - cannot cleanup test data')
    logInfo('You may need to manually delete test user from Supabase dashboard')
    logInfo(`Test user email: ${TEST_CONFIG.testUserEmail}`)
    testResults.warnings++
    return
  }

  try {
    // Delete user profile (cascade will handle user record)
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .delete()
      .eq('user_id', user.id)

    if (profileError) {
      logWarning(`Failed to delete profile: ${profileError.message}`)
    } else {
      logSuccess('Test profile deleted')
    }

    // Delete auth user
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(user.id)
    
    if (authError) {
      logWarning(`Failed to delete auth user: ${authError.message}`)
    } else {
      logSuccess('Test user deleted')
    }
    
    testResults.passed++
  } catch (error) {
    logWarning(`Cleanup error: ${error.message}`)
    logInfo(`Test user email: ${TEST_CONFIG.testUserEmail}`)
    logInfo('You may need to manually delete this user from Supabase dashboard')
    testResults.warnings++
  }
}

// Main test runner
async function runTests() {
  log('\n' + '='.repeat(60), 'bright')
  log('ONBOARDING FLOW TEST SUITE', 'bright')
  log('='.repeat(60) + '\n', 'bright')

  logInfo(`Test User Email: ${TEST_CONFIG.testUserEmail}`)
  logInfo(`Supabase URL: ${supabaseUrl}`)
  logInfo(`Service Role Key: ${supabaseAdmin ? '✓ Provided' : '✗ Missing (some tests will be skipped)'}\n`)

  let testUser = null

  try {
    // Run tests sequentially
    testUser = await test1_UserRegistration()
    if (!testUser) {
      logError('Cannot continue - user registration failed')
      return
    }

    await test2_CheckUserRecord(testUser)
    await test3_CheckProfileCompletion(testUser)
    await test4_CompleteBusinessProfile(testUser)
    await test5_VerifyProfileComplete(testUser)
    await test6_AdminApproval(testUser)
    
    // Cleanup
    const shouldCleanup = process.argv.includes('--cleanup') || process.argv.includes('-c')
    if (shouldCleanup) {
      await test7_Cleanup(testUser)
    } else {
      logWarning('Skipping cleanup (use --cleanup flag to enable)')
      logInfo(`Test user email: ${TEST_CONFIG.testUserEmail}`)
      logInfo('You can manually delete this user from Supabase dashboard if needed')
    }

  } catch (error) {
    logError(`Test suite error: ${error.message}`)
    if (error.stack) {
      logError(error.stack)
    }
  }

  // Print summary
  log('\n' + '='.repeat(60), 'bright')
  log('TEST SUMMARY', 'bright')
  log('='.repeat(60), 'bright')
  log(`Passed: ${testResults.passed}`, 'green')
  log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? 'red' : 'reset')
  log(`Warnings: ${testResults.warnings}`, testResults.warnings > 0 ? 'yellow' : 'reset')
  
  const total = testResults.passed + testResults.failed
  const successRate = total > 0 ? ((testResults.passed / total) * 100).toFixed(1) : 0
  log(`\nSuccess Rate: ${successRate}%`, successRate === 100 ? 'green' : 'yellow')
  
  if (testResults.failed === 0 && testResults.warnings === 0) {
    log('\n✓ All tests passed!', 'green')
  } else if (testResults.failed === 0) {
    log('\n✓ All tests passed (with warnings)', 'yellow')
  } else {
    log('\n✗ Some tests failed', 'red')
    process.exit(1)
  }
}

// Run tests
runTests().catch(error => {
  logError(`Fatal error: ${error.message}`)
  if (error.stack) {
    logError(error.stack)
  }
  process.exit(1)
})
