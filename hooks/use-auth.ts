"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AuthService, type AuthUser } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Ensure we're mounted before accessing browser APIs
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Initial load
    loadUser()

    // Set up real-time session listener
    let subscription: { unsubscribe: () => void } | null = null
    
    try {
      const supabase = createClient()
      
      const {
        data: { subscription: sub },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await loadUser()
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          router.push('/login')
        }
      })

      subscription = sub
    } catch (error: any) {
      // Handle storage initialization errors gracefully
      if (error?.message?.includes('get') || error?.message?.includes('storage')) {
        console.warn('Auth state listener initialization warning (storage timing issue):', error.message)
        // Still try to load user even if listener fails
        loadUser()
      } else {
        console.error('Failed to initialize auth state listener:', error)
      }
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [router, mounted])

  const loadUser = async () => {
    try {
      setLoading(true)
      const currentUser = await AuthService.getCurrentUser()
      setUser(currentUser)
      
      if (!currentUser) {
        console.log('No user found - user may not be logged in')
      } else {
        console.log('User loaded successfully:', currentUser.email, currentUser.role)
      }
    } catch (error) {
      console.error('Error loading user:', error)
      setUser(null)
    } finally {
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
