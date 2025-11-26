// Authentication utilities and session management with Supabase

import { createClient, resetClient } from '@/lib/supabase/client'
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
      
      // Create a fresh client instance for auth to avoid any singleton issues
      console.log('Creating Supabase client for auth...')
      console.log('Supabase URL:', supabaseUrl)
      console.log('Anon key length:', supabaseKey.length)
      
      const supabaseAuth = createSupabaseClient<Database>(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        },
      })
      
      console.log('Supabase client created successfully')
      console.log('Attempting authentication...')
      const startTime = Date.now()
      
      // Direct auth call with timeout protection
      console.log('Calling signInWithPassword...')
      console.log('Email:', email)
      
      // Create timeout promise with more detailed error
      const authTimeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          const elapsed = Date.now() - startTime
          console.error(`Authentication timed out after ${elapsed}ms`)
          console.error('The auth request may not have been sent. Check:')
          console.error('1. Browser Network tab for /auth/v1/token request')
          console.error('2. Browser console for any errors before this timeout')
          console.error('3. Supabase dashboard to verify the project is active')
          reject(new Error(`Authentication request timed out after ${elapsed}ms. The request may not have been sent. Check browser Network tab.`))
        }, 30000) // 30 second timeout
      })
      
      // Race between auth and timeout
      console.log('Creating auth promise...')
      const authPromise = supabaseAuth.auth.signInWithPassword({
        email,
        password,
      }).then(result => {
        const elapsed = Date.now() - startTime
        console.log(`Auth promise resolved after ${elapsed}ms`)
        return result
      }).catch(err => {
        const elapsed = Date.now() - startTime
        console.error(`Auth promise rejected after ${elapsed}ms:`, err)
        throw err
      })
      
      console.log('Racing auth against timeout...')
      const authResult = await Promise.race([authPromise, authTimeoutPromise])
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

      if (!data.session) {
        throw new Error('Authentication succeeded but no session was returned. Please try again.')
      }

      console.log('Auth successful, user ID:', data.user.id)
      console.log('Session token:', data.session?.access_token ? 'Present' : 'Missing')
      console.log('Access token length:', data.session.access_token?.length || 0)
      
      // Verify session is being stored
      if (typeof window !== 'undefined') {
        // Wait a moment for Supabase to persist the session
        await new Promise(resolve => setTimeout(resolve, 200))
        
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
        const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || ''
        const storageKey = `sb-${projectRef}-auth-token`
        const stored = localStorage.getItem(storageKey)
        
        if (stored) {
          console.log('✓ Session stored in localStorage after auth:', storageKey)
          try {
            const parsed = JSON.parse(stored)
            console.log('  - Access token:', parsed.access_token ? 'Present' : 'Missing')
            console.log('  - User ID:', parsed.user?.id || 'Missing')
            console.log('  - Expires at:', parsed.expires_at ? new Date(parsed.expires_at * 1000).toLocaleString() : 'Missing')
          } catch (e) {
            console.warn('  - Could not parse session data')
          }
        } else {
          console.warn('⚠ Session NOT found in localStorage immediately after auth!')
          console.warn('  Expected key:', storageKey)
          // List all localStorage keys for debugging
          console.log('  All localStorage keys:', Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i)))
        }
      }
      
      // Use the same client that authenticated - it already has the session
      console.log('Using authenticated client for database query...')
      console.log('User ID to query:', data.user.id)

      // Add timeout to profile query to prevent hanging
      const profileQueryStartTime = Date.now()
      const profileQueryTimeout = 10000 // 10 seconds
      
      // Use the auth client - it already has the session from signInWithPassword
      console.log('Creating profile query with authenticated client...')
      console.log('Querying user ID:', data.user.id)
      
      // Try the query with better error handling and proper timeout
      let profile: any = null
      let profileError: any = null
      
      try {
        // Create timeout promise that properly rejects
        const profileTimeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
          const elapsed = Date.now() - profileQueryStartTime
          console.error(`Profile query timeout after ${elapsed}ms`)
            console.error('This likely indicates an RLS policy issue or network problem.')
          console.error('Check browser Network tab for request to /rest/v1/users')
            reject(new Error(`Profile query timed out after ${elapsed}ms. This may indicate an RLS policy issue. Check browser Network tab for the actual request status.`))
        }, profileQueryTimeout)
        })
        
        // Create the query promise
        console.log('Executing query...')
        console.log('Query URL will be: /rest/v1/users?select=id,email,role,first_name,last_name,approved&id=eq.' + data.user.id)
        
        const queryPromise = supabaseAuth
          .from('users')
          .select('id, email, role, first_name, last_name, approved')
          .eq('id', data.user.id)
          .single()
          .then(result => {
            console.log('Query promise resolved with result:', { hasData: !!result.data, hasError: !!result.error })
            if (result.error) {
              console.error('Query returned error:', result.error)
              console.error('Error code:', result.error.code)
              console.error('Error message:', result.error.message)
              console.error('Error details:', result.error.details)
            }
            return result
          })
        
        // Race between query and timeout
        console.log('Racing query against timeout...')
        const queryResult = await Promise.race([queryPromise, profileTimeoutPromise])
        
        profile = queryResult.data
        profileError = queryResult.error
        
        const elapsed = Date.now() - profileQueryStartTime
        console.log(`Query completed in ${elapsed}ms, checking result...`)
      } catch (queryErr: any) {
        const elapsed = Date.now() - profileQueryStartTime
        console.error(`Query failed after ${elapsed}ms:`, queryErr)
        console.error('Error details:', {
          message: queryErr.message,
          name: queryErr.name,
          stack: queryErr.stack
        })
        
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

      // Verify session is stored in localStorage
      if (typeof window !== 'undefined') {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
        const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || ''
        const storageKey = `sb-${projectRef}-auth-token`
        const stored = localStorage.getItem(storageKey)
        
        if (stored) {
          console.log('✓ Session stored in localStorage:', storageKey)
          console.log('Session data length:', stored.length, 'chars')
        } else {
          console.warn('⚠ Session NOT found in localStorage after login!')
          console.warn('Expected key:', storageKey)
          // Try to find any auth-token key
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && key.includes('auth-token')) {
              console.warn('Found alternative key:', key)
            }
          }
        }
      }

      // Small delay to ensure session is fully persisted
      await new Promise(resolve => setTimeout(resolve, 100))

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
      let supabase = createClient()
      
      // Try to get session with timeout - getSession() can hang
      let session: any = null
      let sessionError: any = null
      let useFreshClient = false
      
      try {
        // Add timeout to getSession() call since it can hang
        // Reduced timeout to 3 seconds for faster response
        const sessionTimeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error('getSession() timed out'))
          }, 3000) // 3 second timeout for session retrieval
        })
        
        const sessionPromise = supabase.auth.getSession()
        const sessionResult = await Promise.race([sessionPromise, sessionTimeoutPromise])
        session = (sessionResult as any).data?.session
        sessionError = (sessionResult as any).error
      } catch (timeoutError: any) {
        // getSession() timed out - try reading directly from localStorage as fallback
        // Only log warning in development to reduce noise
        if (process.env.NODE_ENV === 'development') {
          console.warn('getSession() timed out, trying localStorage fallback...')
        }
        resetClient() // Reset the stuck client
        
        // Create a fresh client for the fallback
        supabase = createClient()
        useFreshClient = true
        
        if (typeof window !== 'undefined') {
          try {
            // Find the Supabase auth token key in localStorage
            // Format: sb-{project-ref}-auth-token
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
            const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || ''
            const storageKey = `sb-${projectRef}-auth-token`
            
            // Also try to find any key that matches the pattern
            let stored = localStorage.getItem(storageKey)
            if (!stored) {
              // Fallback: search for any key containing 'auth-token'
              for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i)
                if (key && key.includes('auth-token')) {
                  stored = localStorage.getItem(key)
                  console.log(`Found session in localStorage key: ${key}`)
                  break
                }
              }
            }
            
            if (stored) {
              const parsed = JSON.parse(stored)
              if (parsed && parsed.access_token && parsed.user) {
                // Create a minimal session object from localStorage
                session = {
                  access_token: parsed.access_token,
                  refresh_token: parsed.refresh_token,
                  expires_at: parsed.expires_at,
                  expires_in: parsed.expires_in,
                  token_type: parsed.token_type,
                  user: parsed.user,
                }
                console.log('Session recovered from localStorage fallback')
                
                // Try to set the session on the fresh client so it can be used for queries
                // Add timeout since setSession() might also hang
                try {
                  const setSessionTimeoutPromise = new Promise<never>((_, reject) => {
                    setTimeout(() => {
                      reject(new Error('setSession() timed out'))
                    }, 5000)
                  })
                  
                  const setSessionPromise = supabase.auth.setSession({
                    access_token: parsed.access_token,
                    refresh_token: parsed.refresh_token,
                  })
                  
                  await Promise.race([setSessionPromise, setSessionTimeoutPromise])
                  console.log('Session set on fresh client from localStorage')
                  // Small delay to ensure session is fully initialized
                  await new Promise(resolve => setTimeout(resolve, 100))
                } catch (setSessionError: any) {
                  console.warn('Failed to set session on client (continuing anyway):', setSessionError.message)
                  // Continue anyway - we have the session data and can use it directly
                }
              }
            }
          } catch (storageError) {
            console.error('Failed to read session from localStorage:', storageError)
          }
        }
        
        // If we still don't have a session, return null (user is not logged in)
        if (!session) {
          // This is a normal scenario - user is simply not logged in
          // Only log in development mode to reduce production noise
          if (useFreshClient && process.env.NODE_ENV === 'development') {
            console.warn('getSession() timed out and localStorage fallback found no session - user is not logged in')
          }
          return null
        }
      }
      
      if (sessionError) {
        console.log('Session error:', sessionError.message)
        return null
      }
      
      if (!session) {
        console.log('No session found')
        return null
      }
      
      // Use user from session if available (from localStorage fallback)
      // Otherwise try getUser() with timeout
      let user = session.user
      
      if (!user) {
        // Try getUser() with timeout since it can also hang
        try {
          const getUserTimeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => {
              reject(new Error('getUser() timed out'))
            }, 5000)
          })
          
          const getUserPromise = supabase.auth.getUser()
          const getUserResult = await Promise.race([getUserPromise, getUserTimeoutPromise])
          user = (getUserResult as any).data?.user
          const error = (getUserResult as any).error
      
      if (error) {
        console.log('Failed to get user:', error.message)
        return null
          }
        } catch (getUserError: any) {
          console.warn('getUser() timed out, using user from session:', getUserError.message)
          // Use user from session if available
          if (!session.user) {
            return null
          }
          user = session.user
        }
      }
      
      if (!user) {
        console.log('No user found')
        return null
      }

      // Get user profile with timeout protection and better error handling
      const profileQueryStartTime = Date.now()
      const profileQueryTimeout = 5000 // Reduced to 5 seconds for faster failure
      
      console.log('Getting user profile for:', user.id)
      
      let profile: any = null
      let profileError: any = null
      
      try {
        // Create timeout promise that rejects after timeout
        const profileTimeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            const elapsed = Date.now() - profileQueryStartTime
            reject(new Error(`Profile query timed out after ${elapsed}ms`))
          }, profileQueryTimeout)
        })
        
        // Create the query promise
        // Use maybeSingle() instead of single() to prevent 406 errors when no row found
        const queryPromise = supabase
          .from('users')
          .select('id, email, role, first_name, last_name, approved')
          .eq('id', user.id)
          .maybeSingle()
        
        // Race between query and timeout - timeout will win if query takes too long
        const queryResult = await Promise.race([queryPromise, profileTimeoutPromise])
        
        profile = queryResult.data
        profileError = queryResult.error
        
        const elapsed = Date.now() - profileQueryStartTime
        if (profileError) {
          console.warn(`Profile query completed with error in ${elapsed}ms:`, profileError.message)
        } else {
          console.log(`Profile query completed successfully in getCurrentUser in ${elapsed}ms`)
        }
      } catch (queryErr: any) {
        const elapsed = Date.now() - profileQueryStartTime
        
        // Check if it's a timeout error
        if (queryErr.message?.includes('timed out')) {
          console.warn(`Profile query timed out after ${elapsed}ms - returning minimal user from session`)
          console.warn('Possible causes: RLS policy issues, network problems, or session token issues')
          console.warn('Returning minimal user to allow app to function while profile loads in background')
          
          // Return minimal user immediately on timeout - don't wait
          if (user && user.email) {
            const minimalUser = {
              id: user.id,
              email: user.email,
              role: 'smme' as UserRole, // Default role - will be updated when profile loads
              name: user.email.split('@')[0], // Use email prefix as fallback name
              approved: false, // Default to false for safety
            }
            console.warn('Returning minimal user:', minimalUser.email)
            return minimalUser
          }
          console.error('Cannot return minimal user - no user email available')
          return null
        }
        
        console.error(`Profile query failed in getCurrentUser after ${elapsed}ms:`, queryErr)
        // Otherwise, treat it as a profile error
        profileError = queryErr
      }

      if (profileError) {
        console.error('Profile fetch error:', profileError)
        if (profileError.code === 'PGRST116') {
          console.error('User profile not found in database')
          // Return minimal user from session if profile not found
          if (user && user.email) {
            console.warn('Returning minimal user from session since profile not found')
            return {
              id: user.id,
              email: user.email,
              role: 'smme' as UserRole,
              name: user.email.split('@')[0],
              approved: false,
            }
          }
          return null
        }
        if (profileError.message?.includes('permission') || profileError.message?.includes('policy')) {
          console.error('RLS policy error - user might not have permission')
          // Return minimal user from session if RLS blocks
          if (user && user.email) {
            console.warn('Returning minimal user from session since RLS blocked profile query')
            return {
              id: user.id,
              email: user.email,
              role: 'smme' as UserRole,
              name: user.email.split('@')[0],
              approved: false,
            }
          }
          return null
        }
        // For other errors, try to return minimal user
        if (user && user.email) {
          console.warn('Returning minimal user from session due to profile error')
          return {
            id: user.id,
            email: user.email,
            role: 'smme' as UserRole,
            name: user.email.split('@')[0],
            approved: false,
          }
        }
        return null
      }

      if (!profile) {
        // No profile but we have session user - return minimal user
        if (user && user.email) {
          console.warn('No profile found but session exists - returning minimal user')
          return {
            id: user.id,
            email: user.email,
            role: 'smme' as UserRole,
            name: user.email.split('@')[0],
            approved: false,
          }
        }
        return null
      }

      // Type guard to ensure profile has required fields
      if (!profile.id || !profile.email || !profile.role) {
        // If profile is missing required fields, return minimal user from session
        if (user && user.email) {
          console.warn('Profile missing required fields - returning minimal user from session')
          return {
            id: user.id,
            email: user.email,
            role: (profile.role || 'smme') as UserRole,
            name: profile.first_name && profile.last_name 
              ? `${profile.first_name} ${profile.last_name}` 
              : user.email.split('@')[0],
            approved: profile.approved ?? false,
          }
        }
        return null
      }

      return {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        name: profile.first_name && profile.last_name 
          ? `${profile.first_name} ${profile.last_name}` 
          : profile.email.split('@')[0],
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
