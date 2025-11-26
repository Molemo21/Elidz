// Example: Simple JWT Login API Route
// This shows how to use the JWTAuthService directly (without NextAuth.js)
// POST /api/auth/jwt/login

import { NextRequest, NextResponse } from 'next/server'
import { JWTAuthService } from '@/lib/auth-jwt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Login using JWT auth service
    const { user, token } = await JWTAuthService.login(email, password)

    // Return user and token
    // In a real app, you'd set this as an HTTP-only cookie
    return NextResponse.json({
      user,
      token,
      message: 'Login successful',
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 401 }
    )
  }
}
