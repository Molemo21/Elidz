// Query Comparison Test
// This file tests Supabase queries vs Prisma queries side-by-side
// Run with: node -r ts-node/register lib/db/test-queries-comparison.ts
// Or import and use in a test page

import { userQueries as supabaseUserQueries } from './queries'
import { userQueries as prismaUserQueries } from './queries-prisma'
import { userProfileQueries as supabaseProfileQueries } from './queries'
import { userProfileQueries as prismaProfileQueries } from './queries-prisma'
import { opportunityQueries as supabaseOppQueries } from './queries'
import { opportunityQueries as prismaOppQueries } from './queries-prisma'

interface ComparisonResult {
  testName: string
  supabaseResult: any
  prismaResult: any
  match: boolean
  differences?: string[]
}

/**
 * Compare two results and return differences
 */
function compareResults(supabase: any, prisma: any): { match: boolean; differences?: string[] } {
  const differences: string[] = []

  // Check if both succeeded
  if (supabase.success !== prisma.success) {
    differences.push(`Success mismatch: Supabase=${supabase.success}, Prisma=${prisma.success}`)
    return { match: false, differences }
  }

  if (!supabase.success || !prisma.success) {
    // Both failed - check error messages
    if (supabase.error !== prisma.error) {
      differences.push(`Error mismatch: Supabase="${supabase.error}", Prisma="${prisma.error}"`)
      return { match: false, differences }
    }
    return { match: true } // Both failed with same error - considered a match
  }

  // Both succeeded - compare data
  const supabaseData = supabase.data
  const prismaData = prisma.data

  if (Array.isArray(supabaseData) && Array.isArray(prismaData)) {
    if (supabaseData.length !== prismaData.length) {
      differences.push(`Array length mismatch: Supabase=${supabaseData.length}, Prisma=${prismaData.length}`)
      return { match: false, differences }
    }

    // Compare each item (simplified - just check IDs)
    supabaseData.forEach((item: any, index: number) => {
      if (item.id !== prismaData[index]?.id) {
        differences.push(`Item ${index} ID mismatch: Supabase=${item.id}, Prisma=${prismaData[index]?.id}`)
      }
    })
  } else if (supabaseData && prismaData) {
    // Compare objects
    if (supabaseData.id !== prismaData.id) {
      differences.push(`ID mismatch: Supabase=${supabaseData.id}, Prisma=${prismaData.id}`)
    }
  } else if (!supabaseData && !prismaData) {
    // Both null - match
    return { match: true }
  } else {
    differences.push(`Data presence mismatch: Supabase has data=${!!supabaseData}, Prisma has data=${!!prismaData}`)
    return { match: false, differences }
  }

  return {
    match: differences.length === 0,
    differences: differences.length > 0 ? differences : undefined,
  }
}

/**
 * Run all query comparison tests
 */
export async function runQueryComparisonTests(): Promise<ComparisonResult[]> {
  const results: ComparisonResult[] = []

  console.log('🧪 Starting Query Comparison Tests...\n')

  // Test 1: Get All Users
  try {
    console.log('Test 1: Getting all users...')
    const supabaseResult = await supabaseUserQueries.getAll()
    const prismaResult = await prismaUserQueries.getAll()
    const comparison = compareResults(supabaseResult, prismaResult)

    results.push({
      testName: 'Get All Users',
      supabaseResult,
      prismaResult,
      ...comparison,
    })

    console.log(`  ✅ Supabase: ${supabaseResult.success ? 'Success' : 'Failed'}`)
    if (!supabaseResult.success) {
      console.log(`    Error: ${supabaseResult.error || 'Unknown error'}`)
    } else {
      const supabaseCount = Array.isArray(supabaseResult.data) ? supabaseResult.data.length : supabaseResult.data ? 1 : 0
      console.log(`    Returned: ${supabaseCount} record(s)`)
    }
    console.log(`  ✅ Prisma: ${prismaResult.success ? 'Success' : 'Failed'}`)
    if (!prismaResult.success) {
      console.log(`    Error: ${prismaResult.error || 'Unknown error'}`)
    } else {
      const prismaCount = Array.isArray(prismaResult.data) ? prismaResult.data.length : prismaResult.data ? 1 : 0
      console.log(`    Returned: ${prismaCount} record(s)`)
    }
    console.log(`  ${comparison.match ? '✅' : '❌'} Results match: ${comparison.match}\n`)
  } catch (error: any) {
    console.error('  ❌ Test 1 failed:', error.message)
    results.push({
      testName: 'Get All Users',
      supabaseResult: { success: false, error: error.message },
      prismaResult: { success: false, error: error.message },
      match: false,
      differences: [error.message],
    })
  }

  // Test 2: Get User by ID (using first user from Test 1)
  try {
    const allUsersResult = await prismaUserQueries.getAll()
    if (allUsersResult.success && allUsersResult.data && allUsersResult.data.length > 0) {
      const testUserId = allUsersResult.data[0].id
      console.log(`Test 2: Getting user by ID (${testUserId})...`)

      const supabaseResult = await supabaseUserQueries.getById(testUserId)
      const prismaResult = await prismaUserQueries.getById(testUserId)
      const comparison = compareResults(supabaseResult, prismaResult)

      results.push({
        testName: 'Get User by ID',
        supabaseResult,
        prismaResult,
        ...comparison,
      })

      console.log(`  ✅ Supabase: ${supabaseResult.success ? 'Success' : 'Failed'}`)
      console.log(`  ✅ Prisma: ${prismaResult.success ? 'Success' : 'Failed'}`)
      console.log(`  ${comparison.match ? '✅' : '❌'} Results match: ${comparison.match}\n`)
    } else {
      console.log('  ⚠️  Skipped: No users found for testing\n')
    }
  } catch (error: any) {
    console.error('  ❌ Test 2 failed:', error.message)
  }

  // Test 3: Get User by Email
  try {
    const allUsersResult = await prismaUserQueries.getAll()
    if (allUsersResult.success && allUsersResult.data && allUsersResult.data.length > 0) {
      const testEmail = allUsersResult.data[0].email
      console.log(`Test 3: Getting user by email (${testEmail})...`)

      const supabaseResult = await supabaseUserQueries.getByEmail(testEmail)
      const prismaResult = await prismaUserQueries.getByEmail(testEmail)
      const comparison = compareResults(supabaseResult, prismaResult)

      results.push({
        testName: 'Get User by Email',
        supabaseResult,
        prismaResult,
        ...comparison,
      })

      console.log(`  ✅ Supabase: ${supabaseResult.success ? 'Success' : 'Failed'}`)
      console.log(`  ✅ Prisma: ${prismaResult.success ? 'Success' : 'Failed'}`)
      console.log(`  ${comparison.match ? '✅' : '❌'} Results match: ${comparison.match}\n`)
    } else {
      console.log('  ⚠️  Skipped: No users found for testing\n')
    }
  } catch (error: any) {
    console.error('  ❌ Test 3 failed:', error.message)
  }

  // Test 4: Get All Opportunities
  try {
    console.log('Test 4: Getting all opportunities...')
    const supabaseResult = await supabaseOppQueries.getAll()
    const prismaResult = await prismaOppQueries.getAll()
    const comparison = compareResults(supabaseResult, prismaResult)

    results.push({
      testName: 'Get All Opportunities',
      supabaseResult,
      prismaResult,
      ...comparison,
    })

    console.log(`  ✅ Supabase: ${supabaseResult.success ? 'Success' : 'Failed'}`)
    if (!supabaseResult.success) {
      console.log(`    Error: ${supabaseResult.error || 'Unknown error'}`)
    } else {
      const supabaseCount = Array.isArray(supabaseResult.data) ? supabaseResult.data.length : supabaseResult.data ? 1 : 0
      console.log(`    Returned: ${supabaseCount} record(s)`)
    }
    console.log(`  ✅ Prisma: ${prismaResult.success ? 'Success' : 'Failed'}`)
    if (!prismaResult.success) {
      console.log(`    Error: ${prismaResult.error || 'Unknown error'}`)
    } else {
      const prismaCount = Array.isArray(prismaResult.data) ? prismaResult.data.length : prismaResult.data ? 1 : 0
      console.log(`    Returned: ${prismaCount} record(s)`)
    }
    console.log(`  ${comparison.match ? '✅' : '❌'} Results match: ${comparison.match}\n`)
  } catch (error: any) {
    console.error('  ❌ Test 4 failed:', error.message)
  }

  // Test 5: Get Active Opportunities
  try {
    console.log('Test 5: Getting active opportunities...')
    const supabaseResult = await supabaseOppQueries.getActive()
    const prismaResult = await prismaOppQueries.getActive()
    const comparison = compareResults(supabaseResult, prismaResult)

    results.push({
      testName: 'Get Active Opportunities',
      supabaseResult,
      prismaResult,
      ...comparison,
    })

    console.log(`  ✅ Supabase: ${supabaseResult.success ? 'Success' : 'Failed'}`)
    if (!supabaseResult.success) {
      console.log(`    Error: ${supabaseResult.error || 'Unknown error'}`)
    } else {
      const supabaseCount = Array.isArray(supabaseResult.data) ? supabaseResult.data.length : supabaseResult.data ? 1 : 0
      console.log(`    Returned: ${supabaseCount} record(s)`)
    }
    console.log(`  ✅ Prisma: ${prismaResult.success ? 'Success' : 'Failed'}`)
    if (!prismaResult.success) {
      console.log(`    Error: ${prismaResult.error || 'Unknown error'}`)
    } else {
      const prismaCount = Array.isArray(prismaResult.data) ? prismaResult.data.length : prismaResult.data ? 1 : 0
      console.log(`    Returned: ${prismaCount} record(s)`)
    }
    console.log(`  ${comparison.match ? '✅' : '❌'} Results match: ${comparison.match}\n`)
  } catch (error: any) {
    console.error('  ❌ Test 5 failed:', error.message)
  }

  // Test 6: Get User Profile (if user exists)
  try {
    const allUsersResult = await prismaUserQueries.getAll()
    if (allUsersResult.success && allUsersResult.data && allUsersResult.data.length > 0) {
      const testUserId = allUsersResult.data[0].id
      console.log(`Test 6: Getting user profile for user ${testUserId}...`)

      const supabaseResult = await supabaseProfileQueries.getByUserId(testUserId)
      const prismaResult = await prismaProfileQueries.getByUserId(testUserId)
      const comparison = compareResults(supabaseResult, prismaResult)

      results.push({
        testName: 'Get User Profile',
        supabaseResult,
        prismaResult,
        ...comparison,
      })

      console.log(`  ✅ Supabase: ${supabaseResult.success ? 'Success' : 'Failed'}`)
      console.log(`  ✅ Prisma: ${prismaResult.success ? 'Success' : 'Failed'}`)
      console.log(`  ${comparison.match ? '✅' : '❌'} Results match: ${comparison.match}\n`)
    } else {
      console.log('  ⚠️  Skipped: No users found for testing\n')
    }
  } catch (error: any) {
    console.error('  ❌ Test 6 failed:', error.message)
  }

  return results
}

/**
 * Print summary of all test results
 */
export function printTestSummary(results: ComparisonResult[]) {
  console.log('\n' + '='.repeat(60))
  console.log('📊 TEST SUMMARY')
  console.log('='.repeat(60) + '\n')

  const passed = results.filter(r => r.match).length
  const failed = results.filter(r => !r.match).length
  const total = results.length

  console.log(`Total Tests: ${total}`)
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%\n`)

  if (failed > 0) {
    console.log('❌ FAILED TESTS:')
    console.log('-'.repeat(60))
    results
      .filter(r => !r.match)
      .forEach(result => {
        console.log(`\n${result.testName}:`)
        if (result.differences) {
          result.differences.forEach(diff => console.log(`  - ${diff}`))
        }
      })
    console.log('\n')
  }

  console.log('='.repeat(60) + '\n')
}

