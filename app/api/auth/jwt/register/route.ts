// Example: Simple JWT Register API Route
// POST /api/auth/jwt/register

import { NextRequest, NextResponse } from 'next/server'
import { JWTAuthService } from '@/lib/auth-jwt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, phone, role } = body

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone) {
      return NextResponse.json(
        { error: 'Email, password, first name, last name, and phone are required' },
        { status: 400 }
      )
    }

    // Register using JWT auth service
    const { user, token } = await JWTAuthService.register({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: role || 'smme',
    })

    return NextResponse.json({
      user,
      token,
      message: 'Registration successful',
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 400 }
    )
  }
}
