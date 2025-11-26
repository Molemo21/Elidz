// API Route to test query comparison
// GET /api/test/query-comparison
// This runs Supabase vs Prisma query comparisons

import { NextResponse } from 'next/server'
import { runQueryComparisonTests, printTestSummary } from '@/lib/db/test-queries-comparison'

export async function GET() {
  try {
    console.log('Starting query comparison tests...')
    
    const results = await runQueryComparisonTests()
    printTestSummary(results)

    const passed = results.filter(r => r.match).length
    const failed = results.filter(r => !r.match).length
    const total = results.length

    return NextResponse.json({
      success: true,
      summary: {
        total,
        passed,
        failed,
        successRate: ((passed / total) * 100).toFixed(1) + '%',
      },
      results: results.map(r => ({
        testName: r.testName,
        match: r.match,
        differences: r.differences,
        supabaseSuccess: r.supabaseResult.success,
        prismaSuccess: r.prismaResult.success,
        supabaseError: r.supabaseResult.error,
        prismaError: r.prismaResult.error,
      })),
    })
  } catch (error: any) {
    console.error('Query comparison test failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to run comparison tests',
      },
      { status: 500 }
    )
  }
}

