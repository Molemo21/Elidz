"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AuthService, type AuthUser } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  
  // Use refs to prevent multiple simultaneous calls
  const isLoadingUserRef = useRef(false)
  const lastLoadTimeRef = useRef(0)
  const userRef = useRef<AuthUser | null>(null)
  const LOAD_DEBOUNCE_MS = 3000 // Don't load more than once every 3 seconds

  // Ensure we're mounted before accessing browser APIs
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Initial load with a small delay to prevent blocking initial render
    const loadTimer = setTimeout(() => {
      loadUser()
    }, 100)

    // Set up real-time session listener
    let subscription: { unsubscribe: () => void } | null = null
    
    try {
      const supabase = createClient()
      
      const {
        data: { subscription: sub },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        // Debounce auth state changes
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Only reload if session user ID changed
          const currentUserId = userRef.current?.id
          if (!currentUserId || session?.user?.id !== currentUserId) {
            await loadUser()
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          userRef.current = null
          router.push('/login')
        }
      })

      subscription = sub
    } catch (error: any) {
      // Handle storage initialization errors gracefully
      if (error?.message?.includes('get') || error?.message?.includes('storage')) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Auth state listener initialization warning (storage timing issue):', error.message)
        }
        // Still try to load user even if listener fails
        loadUser()
      } else {
        console.error('Failed to initialize auth state listener:', error)
      }
    }

    return () => {
      clearTimeout(loadTimer)
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [router, mounted]) // Removed 'user' from dependencies to prevent infinite loop

  const loadUser = async () => {
    // Prevent multiple simultaneous calls
    if (isLoadingUserRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log('loadUser already in progress, skipping...')
      }
      return
    }
    
    // Debounce rapid calls
    const now = Date.now()
    if (now - lastLoadTimeRef.current < LOAD_DEBOUNCE_MS) {
      if (process.env.NODE_ENV === 'development') {
        console.log('loadUser called too soon, debouncing...')
      }
      return
    }
    lastLoadTimeRef.current = now
    
    isLoadingUserRef.current = true
    try {
      setLoading(true)
      const currentUser = await AuthService.getCurrentUser()
      
      if (currentUser) {
        // Got user successfully
        setUser(currentUser)
        userRef.current = currentUser
        if (process.env.NODE_ENV === 'development') {
          console.log('User loaded successfully:', currentUser.email, currentUser.role)
        }
      } else {
        // getCurrentUser returned null - check localStorage directly (don't call getSession() which will timeout)
        // This prevents overwriting a successful login when profile query times out
        let hasSession = false
        
        if (typeof window !== 'undefined') {
          try {
            // Check localStorage directly to avoid getSession() timeout
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
            
            if (stored) {
              const parsed = JSON.parse(stored)
              if (parsed && parsed.access_token && parsed.user) {
                hasSession = true
                console.warn('Profile query failed but session exists in localStorage - keeping current user if exists')
                // Only set to null if we don't already have a user
                // This preserves the user state from successful login
                if (!userRef.current) {
                  setUser(null)
                  userRef.current = null
                }
              } else {
                console.log('No valid session in localStorage - clearing user')
                setUser(null)
                userRef.current = null
              }
            } else {
              console.log('No session found in localStorage - clearing user')
              setUser(null)
              userRef.current = null
            }
          } catch (storageError) {
            console.error('Error checking localStorage:', storageError)
            // If we can't check localStorage, clear user as fallback
            setUser(null)
            userRef.current = null
          }
        } else {
          // Not in browser - clear user
          setUser(null)
          userRef.current = null
        }
      }
    } catch (error) {
      console.error('Error loading user:', error)
      // Check localStorage directly instead of calling getSession()
      let hasSession = false
      
      if (typeof window !== 'undefined') {
        try {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
          const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || ''
          const storageKey = `sb-${projectRef}-auth-token`
          
          let stored = localStorage.getItem(storageKey)
          if (!stored) {
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i)
              if (key && key.includes('auth-token')) {
                stored = localStorage.getItem(key)
                break
              }
            }
          }
          
          if (stored) {
            const parsed = JSON.parse(stored)
            if (parsed && parsed.access_token && parsed.user) {
              hasSession = true
              console.warn('Error loading user but session exists in localStorage - keeping current user if exists')
              if (!userRef.current) {
                setUser(null)
                userRef.current = null
              }
            } else {
              setUser(null)
              userRef.current = null
            }
          } else {
            setUser(null)
            userRef.current = null
          }
        } catch (storageError) {
          setUser(null)
          userRef.current = null
        }
      } else {
        setUser(null)
        userRef.current = null
      }
    } finally {
      isLoadingUserRef.current = false
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const user = await AuthService.login(email, password)
    setUser(user)
    return user
  }

  const logout = async () => {
    await AuthService.logout()
    setUser(null)
    userRef.current = null
    router.push('/login')
  }

  const register = async (data: Parameters<typeof AuthService.register>[0]) => {
    const user = await AuthService.register(data)
    // Don't set user here - they need admin approval first
    return user
  }

  return {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isApproved: user?.approved ?? false,
  }
}
