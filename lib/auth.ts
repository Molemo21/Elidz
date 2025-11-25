// Authentication utilities and session management with Supabase

import { createClient } from '@/lib/supabase/client'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database.types'
import type { UserRole } from './db-schema'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  name: string
  approved: boolean
}

export class AuthService {
  /**
   * Sign in with email and password
   */
  static async login(email: string, password: string): Promise<AuthUser> {
    console.log('AuthService.login called for:', email)
    
    try {
      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase is not configured. Please check your environment variables.')
      }
      
      // Create a fresh client for auth to avoid singleton issues
      // Use the same config as our singleton but create fresh instance for auth
      // This matches the working test-auth approach
      const supabaseAuth = createSupabaseClient<Database>(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        },
      })
      
      console.log('Supabase client created for auth')
      console.log('Attempting authentication...')
      const startTime = Date.now()
      
      // Direct auth call with timeout protection
      console.log('Calling signInWithPassword...')
      
      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Authentication request timed out. Please check your connection and try again.'))
        }, 30000) // 30 second timeout
      })
      
      // Race between auth and timeout
      const authPromise = supabaseAuth.auth.signInWithPassword({
        email,
        password,
      })
      
      const authResult = await Promise.race([authPromise, timeoutPromise])
      const { data, error } = authResult
      
      const elapsed = Date.now() - startTime
      console.log(`Auth call completed in ${elapsed}ms`)
      
      if (error) {
        console.error('Supabase auth error:', error)
        throw new Error(error.message || 'Invalid email or password')
      }

      if (!data.user) {
        throw new Error('Failed to sign in - no user data returned')
      }

      console.log('Auth successful, user ID:', data.user.id)
      console.log('Session token:', data.session?.access_token ? 'Present' : 'Missing')
      
      // Ensure session is set for database queries
      if (!data.session) {
        throw new Error('Authentication succeeded but no session was returned. Please try again.')
      }
      
      // Use the SAME client that was used for auth - it already has the session
      // Don't switch clients - use the one that authenticated
      console.log('Using authenticated client for database query...')
      console.log('User ID to query:', data.user.id)
      
      // Verify session is available on the auth client
      const { data: { session: verifySession }, error: sessionError } = await supabaseAuth.auth.getSession()
      if (sessionError) {
        console.error('Error getting session:', sessionError)
      }
      if (!verifySession) {
        throw new Error('Session not available on auth client. Please try logging in again.')
      }
      console.log('Session verified on auth client')
      console.log('Access token present:', !!verifySession.access_token)
      console.log('Access token length:', verifySession.access_token?.length || 0)
      console.log('User ID from session:', verifySession.user?.id)
      console.log('User ID to query:', data.user.id)
      console.log('IDs match:', verifySession.user?.id === data.user.id)

      // Test database connectivity first with a simple query
      console.log('Testing database connectivity...')
      try {
        const testQuery = await supabaseAuth
          .from('users')
          .select('count')
          .limit(1)
        console.log('Database connectivity test result:', { hasData: !!testQuery.data, hasError: !!testQuery.error })
        if (testQuery.error) {
          console.warn('Database test query error (might be RLS, continuing anyway):', testQuery.error.message)
        }
      } catch (testErr) {
        console.warn('Database connectivity test failed (continuing anyway):', testErr)
      }

      // Add timeout to profile query to prevent hanging
      const profileQueryStartTime = Date.now()
      const profileQueryTimeout = 10000 // 10 seconds
      
      // Create the query promise using the SAME client that authenticated
      // This client already has the session token attached
      console.log('Creating profile query with authenticated client...')
      
      // Try the query with better error handling
      let profile: any = null
      let profileError: any = null
      
      try {
        // Create a promise that will reject on timeout
        const timeoutId = setTimeout(() => {
          const elapsed = Date.now() - profileQueryStartTime
          console.error(`Profile query timeout after ${elapsed}ms`)
          console.error('Check browser Network tab for request to /rest/v1/users')
          throw new Error(`Profile query timed out after ${elapsed}ms. Check browser Network tab for the actual request status.`)
        }, profileQueryTimeout)
        
        // Execute the query
        const queryResult = await supabaseAuth
          .from('users')
          .select('id, email, role, first_name, last_name, approved')
          .eq('id', data.user.id)
          .single()
        
        clearTimeout(timeoutId)
        profile = queryResult.data
        profileError = queryResult.error
        
        console.log('Query completed, checking result...')
      } catch (queryErr: any) {
        const elapsed = Date.now() - profileQueryStartTime
        console.error(`Query failed after ${elapsed}ms:`, queryErr)
        
        // If it's a timeout error, re-throw it
        if (queryErr.message?.includes('timed out')) {
          throw queryErr
        }
        
        // Otherwise, treat it as a profile error
        profileError = queryErr
      }
      
      const profileQueryElapsed = Date.now() - profileQueryStartTime
      console.log(`Profile query completed in ${profileQueryElapsed}ms:`, { hasProfile: !!profile, hasError: !!profileError })

      if (profileError) {
        console.error('Profile fetch error:', profileError)
        console.error('Error code:', profileError.code || 'N/A')
        console.error('Error message:', profileError.message || 'N/A')
        console.error('Error details:', JSON.stringify(profileError, null, 2))
        
        // More specific error message
        if (profileError.code === 'PGRST116') {
          throw new Error('User profile not found in database. The user exists in authentication but not in the users table. Please contact support.')
        }
        
        // Check if it's an RLS policy issue
        if (profileError.message?.includes('permission') || profileError.message?.includes('policy')) {
          throw new Error('Access denied. This might be an RLS policy issue. Please check your database policies.')
        }
        
        throw new Error(`Failed to load user profile: ${profileError.message || 'Unknown error'}`)
      }

      if (!profile) {
        console.error('Profile is null after fetch')
        throw new Error('User profile not found in database. Please contact support.')
      }

      console.log('Profile loaded:', profile)

      // Type assertion to work around TypeScript error types
      const profileData = profile as any

      if (!profileData.approved) {
        console.log('User not approved, signing out...')
        await supabaseAuth.auth.signOut()
        throw new Error('Your account is pending admin approval. You will be notified once approved.')
      }

      // Update last login (don't fail if this errors)
      try {
        await (supabaseAuth as any)
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', profileData.id)
        console.log('Last login updated')
      } catch (updateError) {
        console.warn('Failed to update last login:', updateError)
        // Don't throw - this is not critical
      }

      console.log('Login successful, returning user:', {
        id: profileData.id,
        email: profileData.email,
        role: profileData.role,
      })

      return {
        id: profileData.id,
        email: profileData.email,
        role: profileData.role,
        name: `${profileData.first_name} ${profileData.last_name}`,
        approved: profileData.approved,
      }
    } catch (error) {
      console.error('AuthService.login error:', error)
      throw error
    }
  }

  /**
   * Register new user
   */
  static async register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    role: UserRole
  }): Promise<AuthUser> {
    const supabase = createClient()

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
        },
      },
    })

    if (authError) {
      throw new Error(authError.message)
    }

    if (!authData.user) {
      throw new Error('Failed to create account')
    }

    // Create user record in users table
    const { error: userError } = await (supabase as any)
      .from('users')
      .insert({
        id: authData.user.id,
        email: data.email,
        role: data.role,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        approved: false, // Requires admin approval
      })

    if (userError) {
      // Clean up auth user if profile creation fails
      await supabase.auth.signOut()
      throw new Error('Failed to create user profile')
    }

    return {
      id: authData.user.id,
      email: data.email,
      role: data.role,
      name: `${data.firstName} ${data.lastName}`,
      approved: false,
    }
  }

  /**
   * Sign out current user
   */
  static async logout(): Promise<void> {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  /**
   * Get current authenticated user
   */
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const supabase = createClient()
      
      // First, get the session to ensure it's loaded from storage
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.log('Session error:', sessionError.message)
        return null
      }
      
      if (!session) {
        console.log('No session found')
        return null
      }
      
      // Then get the user to verify the session is valid
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.log('Failed to get user:', error.message)
        return null
      }
      
      if (!user) {
        console.log('No user found')
        return null
      }

      // Get user profile
      const { data: profile, error: profileError } = await (supabase as any)
        .from('users')
        .select('id, email, role, first_name, last_name, approved')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error('Profile fetch error:', profileError)
        if (profileError.code === 'PGRST116') {
          console.error('User profile not found in database')
          return null
        }
        if (profileError.message?.includes('permission') || profileError.message?.includes('policy')) {
          console.error('RLS policy error - user might not have permission')
          return null
        }
        return null
      }

      if (!profile) {
        return null
      }

      // Type guard to ensure profile has required fields
      if (!profile.id || !profile.email || !profile.role || !profile.first_name || !profile.last_name) {
        return null
      }

      return {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        name: `${profile.first_name} ${profile.last_name}`,
        approved: profile.approved ?? false,
      }
    } catch (error) {
      console.error('getCurrentUser error:', error)
      return null
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<void> {
    const supabase = createClient()
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password`,
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, data: Partial<AuthUser>): Promise<AuthUser> {
    const supabase = createClient()
    
    const updateData: {
      first_name?: string
      last_name?: string
      approved?: boolean
    } = {}

    if (data.name) {
      const nameParts = data.name.split(' ')
      updateData.first_name = nameParts[0]
      updateData.last_name = nameParts.slice(1).join(' ') || ''
    }

    if (data.approved !== undefined) {
      updateData.approved = data.approved
    }
    
    const { data: updated, error } = await (supabase as any)
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('id, email, role, first_name, last_name, approved')
      .single()

    if (error || !updated) {
      throw new Error('Failed to update profile')
    }

    // Type guard to ensure updated has required fields
    if (!updated.id || !updated.email || !updated.role || !updated.first_name || !updated.last_name) {
      throw new Error('Invalid profile data returned')
    }

    return {
      id: updated.id,
      email: updated.email,
      role: updated.role,
      name: `${updated.first_name} ${updated.last_name}`,
      approved: updated.approved ?? false,
    }
  }
}
