import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from './database.types'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Update request cookies first
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          
          // Create new response with updated cookies
          supabaseResponse = NextResponse.next({
            request,
          })
          
          // Set all cookies on the response with proper options
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, {
              ...options,
              httpOnly: options?.httpOnly ?? true,
              secure: options?.secure ?? (process.env.NODE_ENV === 'production'),
              sameSite: (options?.sameSite as 'lax' | 'strict' | 'none') ?? 'lax',
              path: options?.path ?? '/',
            })
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  // This will read from cookies and refresh if needed
  // It will also trigger setAll if cookies need to be updated
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error && error.message !== 'Auth session missing!') {
      console.warn('[Middleware] getUser() error:', {
        message: error.message,
        status: error.status,
      })
    }
    
    // If we have a user, the session is valid
    if (user) {
      // Session is valid, cookies are set
      return supabaseResponse
    }
  } catch (error: any) {
    // If getUser fails, the session might not be in cookies yet
    // This is okay - the client-side session will be synced on next request
    if (error?.message !== 'Auth session missing!') {
      console.warn('[Middleware] Could not get user from cookies:', error?.message || error)
    }
  }

  return supabaseResponse
}

