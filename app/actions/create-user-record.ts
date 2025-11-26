'use server'

import { prisma } from '@/lib/prisma'

/**
 * Server action to create user record after signup
 * Now uses Prisma instead of Supabase client
 * This is a reliable backup in case the trigger doesn't fire immediately
 */
export async function createUserRecord(userId: string, userData: {
  email: string
  role: 'smme' | 'admin'
  firstName: string
  lastName: string
  phone: string
}) {
  try {
    // Check if user record already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    })

    if (existingUser) {
      return {
        success: true,
        message: 'User record already exists',
        data: existingUser,
      }
    }

    // Create user record using Prisma
    try {
      const user = await prisma.user.create({
        data: {
          id: userId,
          email: userData.email,
          role: userData.role,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          approved: false, // Requires admin approval
        },
        select: {
          id: true,
        },
      })

      return {
        success: true,
        message: 'User record created successfully',
        data: user,
      }
    } catch (error: any) {
      // If duplicate key error, record exists (race condition - trigger created it)
      if (error.code === 'P2002') {
        return {
          success: true,
          message: 'User record already exists (created by trigger)',
        }
      }

      throw error
    }
  } catch (error: any) {
    console.error('Error in createUserRecord:', error)
    return {
      success: false,
      error: error.message || 'Failed to create user record',
    }
  }
}

