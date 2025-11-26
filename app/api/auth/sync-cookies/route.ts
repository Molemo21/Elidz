import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/supabase/database.types'

export async function POST(request: NextRequest) {
  try {
    const { accessToken, refreshToken } = await request.json()

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Missing tokens' },
        { status: 400 }
      )
    }

    // Extract project reference from Supabase URL for cookie names
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || ''
    
    // Track if setAll was called
    let setAllWasCalled = false
    const cookiesToSet: Array<{ name: string; value: string; options: any }> = []

    // Create mutable response that will be updated
    let response = NextResponse.json({ success: true })

    // Create Supabase client with cookie handling
    const supabase = createServerClient<Database>(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookies) {
            setAllWasCalled = true
            // Store cookies to set
            cookies.forEach(cookie => {
              cookiesToSet.push(cookie)
            })
            
            // Create new response with cookies
            response = NextResponse.json({ success: true })
            
            // Set all cookies on the response with proper options
            cookies.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, {
                ...options,
                httpOnly: options?.httpOnly ?? true,
                secure: options?.secure ?? (process.env.NODE_ENV === 'production'),
                sameSite: (options?.sameSite as 'lax' | 'strict' | 'none') ?? 'lax',
                path: options?.path ?? '/',
                ...(options?.maxAge && { maxAge: options.maxAge }),
              })
            })
          },
        },
      }
    )

    // IMPORTANT: setSession in API routes doesn't trigger setAll callback
    // We need to manually set cookies in the exact format Supabase SSR expects
    // First, validate the session by calling setSession
    const { data: sessionData, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    if (error) {
      console.error('[sync-cookies] Failed to set session:', {
        message: error.message,
        status: error.status,
        error,
      })
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    if (!sessionData.session) {
      console.error('[sync-cookies] No session returned after setSession')
      return NextResponse.json(
        { success: false, error: 'Failed to create session' },
        { status: 500 }
      )
    }

    // Check if setAll was called (it usually won't be in API routes)
    let allCookies = response.cookies.getAll()
    
    // Always manually set cookies because setSession in API routes doesn't trigger setAll
    // Supabase SSR expects cookies in a specific format
    const sessionCookieName = `sb-${projectRef}-auth-token`
    
    // Supabase SSR stores the session as a JSON string in the cookie
    // The format matches what's stored in localStorage
    const sessionValue = {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: sessionData.session.expires_at,
      expires_in: sessionData.session.expires_in,
      token_type: sessionData.session.token_type,
      user: sessionData.session.user,
    }
    
    // Calculate maxAge from expires_at (Unix timestamp)
    const expiresAt = sessionData.session.expires_at
    const maxAge = expiresAt 
      ? Math.max(0, expiresAt - Math.floor(Date.now() / 1000))
      : 60 * 60 * 24 * 7 // Default to 7 days if no expires_at
    
    // Set the session cookie - this is what Supabase SSR reads
    response.cookies.set(sessionCookieName, JSON.stringify(sessionValue), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: maxAge,
    })
    
    // Supabase SSR may also look for code verifier cookies, but the main auth token is critical
    // We can optionally set additional cookies if needed, but the auth-token cookie should be sufficient
    
    // Verify cookies were set
    allCookies = response.cookies.getAll()
    console.log('[sync-cookies] After setting cookies, count:', allCookies.length)

    // Log what cookies were set
    const cookieNames = allCookies.map(c => c.name).join(', ')
    console.log('[sync-cookies] setAll was called:', setAllWasCalled)
    console.log('[sync-cookies] Cookies set:', cookieNames || 'None')
    console.log('[sync-cookies] Session user:', sessionData.session.user.email)
    console.log('[sync-cookies] Total cookies in response:', allCookies.length)

    // Debug: Log cookie details
    if (allCookies.length > 0) {
      allCookies.forEach(cookie => {
        const valuePreview = cookie.value.length > 50 
          ? `${cookie.value.substring(0, 50)}...` 
          : cookie.value
        console.log(`[sync-cookies] Cookie: ${cookie.name} (${cookie.value.length} chars)`)
      })
    } else {
      console.error('[sync-cookies] ERROR: No cookies were set in the response!')
    }

    return response
  } catch (error: any) {
    console.error('[sync-cookies] API route error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

