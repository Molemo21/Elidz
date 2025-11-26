// Example: Get current user from JWT token
// GET /api/auth/jwt/me
// Requires Authorization header: Bearer <token>

import { NextRequest, NextResponse } from 'next/server'
import { JWTAuthService } from '@/lib/auth-jwt'

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify token and get user
    const user = await JWTAuthService.verifyToken(token)

    return NextResponse.json({ user })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Invalid token' },
      { status: 401 }
    )
  }
}
