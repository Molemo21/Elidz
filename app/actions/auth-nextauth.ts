// Server Actions for NextAuth.js authentication
// These replace Supabase Auth server actions

'use server'

import { signIn, signOut } from '@/lib/auth'
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

/**
 * Server action to request password reset
 * For users without passwordHash, this allows them to set an initial password
 */
export async function requestPasswordResetAction(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal if user exists for security
      return { success: true }
    }

    // For now, we'll return success
    // In production, you'd send an email with a reset token here
    // For development, we can allow direct password reset
    return { success: true }
  } catch (error) {
    console.error('Password reset request error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

/**
 * Server action to reset/set password
 * Works for users with or without existing passwordHash
 */
export async function resetPasswordAction(
  email: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10)

    // Update user's password hash
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    })

    return { success: true }
  } catch (error) {
    console.error('Password reset error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    }
  }
}

