/**
 * Utility to sync Supabase session from localStorage to server cookies
 * This ensures server actions can read the session
 */
export async function syncSessionToCookies(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    // Get session from localStorage
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || ''
    const storageKey = `sb-${projectRef}-auth-token`
    
    let stored = localStorage.getItem(storageKey)
    if (!stored) {
      // Fallback: search for any key containing 'auth-token'
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.includes('auth-token')) {
          stored = localStorage.getItem(key)
          break
        }
      }
    }

    if (!stored) {
      console.warn('[syncSessionToCookies] No session found in localStorage')
      return false
    }

    const parsed = JSON.parse(stored)
    if (!parsed.access_token || !parsed.refresh_token) {
      console.warn('[syncSessionToCookies] Invalid session data in localStorage')
      return false
    }

    // Sync to cookies via API route
    const response = await fetch('/api/auth/sync-cookies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important: include cookies in request
      body: JSON.stringify({
        accessToken: parsed.access_token,
        refreshToken: parsed.refresh_token,
      }),
    })

    if (!response.ok) {
      console.error('[syncSessionToCookies] Sync request failed:', response.status, response.statusText)
      return false
    }

    const result = await response.json()
    
    if (result.success) {
      console.log('[syncSessionToCookies] Session synced to cookies successfully')
      
      // Verify cookies were actually set by checking document.cookie
      // Wait a bit for cookies to be set
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Check if cookies are now available (they should be)
      const cookiesSet = document.cookie.includes(`sb-${projectRef}`)
      if (cookiesSet) {
        console.log('[syncSessionToCookies] ✓ Cookies verified in browser')
      } else {
        console.warn('[syncSessionToCookies] ⚠ Cookies may not be set (HttpOnly cookies not visible in document.cookie)')
      }
      
      return true
    } else {
      console.warn('[syncSessionToCookies] Failed to sync session:', result.error)
      return false
    }
  } catch (error) {
    console.error('[syncSessionToCookies] Error syncing session:', error)
    return false
  }
}

