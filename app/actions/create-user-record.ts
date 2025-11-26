'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Server action to create user record after signup
 * Uses the system function via RPC which bypasses RLS
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
    const supabase = await createClient()

    // Check if user record already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    if (existingUser) {
      return {
        success: true,
        message: 'User record already exists',
        data: existingUser,
      }
    }

    // Use the system function via RPC (bypasses RLS)
    // This function uses SECURITY DEFINER and doesn't require auth check
    const { data, error } = await (supabase as any).rpc('create_user_record_system', {
      user_id: userId,
      user_email: userData.email,
      user_role: userData.role,
      user_first_name: userData.firstName,
      user_last_name: userData.lastName,
      user_phone: userData.phone,
    })

    if (error) {
      // If duplicate key error, record exists (race condition - trigger created it)
      if (error.code === '23505') {
        return {
          success: true,
          message: 'User record already exists (created by trigger)',
        }
      }

      console.error('Failed to create user record via RPC:', {
        code: error.code,
        message: error.message,
        details: error.details,
      })

      return {
        success: false,
        error: error.message || 'Failed to create user record',
      }
    }

    return {
      success: true,
      message: 'User record created successfully',
      data: { id: data || userId },
    }
  } catch (error: any) {
    console.error('Error in createUserRecord:', error)
    return {
      success: false,
      error: error.message || 'Failed to create user record',
    }
  }
}

