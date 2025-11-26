// Authentication service using NextAuth.js
// This replaces Supabase Auth with NextAuth.js JWT authentication

import { signIn, signOut } from 'next-auth/react'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import type { AuthUser } from './auth'
import type { UserRole } from './db-schema'

export class NextAuthService {
  /**
   * Sign in with email and password using NextAuth.js
   */
  static async login(email: string, password: string): Promise<AuthUser> {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      throw new Error(result.error)
    }

    if (!result?.ok) {
      throw new Error('Login failed')
    }

    // Fetch user from database after successful login
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        approved: true,
      },
    })

    if (!user) {
      throw new Error('User not found after login')
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      name: `${user.firstName} ${user.lastName}`,
      approved: user.approved,
    }
  }

  /**
   * Register a new user with NextAuth.js
   */
  static async register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    role: UserRole
  }): Promise<AuthUser> {
    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
        approved: false, // Requires admin approval
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        approved: true,
      },
    })

    return {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      name: `${user.firstName} ${user.lastName}`,
      approved: user.approved,
    }
  }

  /**
   * Sign out current user
   */
  static async logout(): Promise<void> {
    await signOut({ redirect: false })
  }

  /**
   * Get current authenticated user from NextAuth session
   * This is a client-side function - use getServerSession for server-side
   */
  static async getCurrentUser(): Promise<AuthUser | null> {
    // This will be handled by NextAuth's useSession hook on the client
    // For server-side, use getServerSession from next-auth
    const response = await fetch('/api/auth/session')
    const session = await response.json()

    if (!session?.user) {
      return null
    }

    return {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role as UserRole,
      name: session.user.name,
      approved: session.user.approved,
    }
  }
}

