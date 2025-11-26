// Server Actions for NextAuth.js authentication
// These replace Supabase Auth server actions

'use server'

import { signIn, signOut } from '@/lib/auth-nextauth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import type { AuthUser } from '@/lib/auth'
import type { UserRole } from '@/lib/db-schema'

/**
 * Server action to sign in with email and password
 */
export async function loginAction(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      return { success: false, error: result.error }
    }

    if (!result?.ok) {
      return { success: false, error: 'Login failed' }
    }

    return { success: true }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Server action to register a new user
 */
export async function registerAction(data: {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  role: UserRole
}): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return { success: false, error: 'User with this email already exists' }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10)

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
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role as UserRole,
        name: `${user.firstName} ${user.lastName}`,
        approved: user.approved,
      },
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Server action to sign out
 */
export async function logoutAction(): Promise<void> {
  await signOut()
  redirect('/login')
}

