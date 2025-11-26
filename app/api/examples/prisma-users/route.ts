// Example: Prisma Query API Route
// This shows how to use Prisma to query the database
// GET /api/examples/prisma-users

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Debug: Check if DATABASE_URL is loaded
    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'DATABASE_URL environment variable is not set',
        },
        { status: 500 }
      )
    }
    
    // Log connection info (without password)
    const dbUrlMasked = dbUrl.replace(/:([^:@]+)@/, ':****@')
    console.log('Database URL (masked):', dbUrlMasked)
    
    // Example 1: Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        approved: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // Limit to 10 users
    })

    return NextResponse.json({
      success: true,
      count: users.length,
      users,
    })
  } catch (error: any) {
    console.error('Prisma query error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch users',
      },
      { status: 500 }
    )
  }
}
