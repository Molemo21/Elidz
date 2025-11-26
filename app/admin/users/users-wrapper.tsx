"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import AdminUsersPageClient from "./users-client"
import type { AuthUser } from "@/lib/auth"
import { Loader2 } from "lucide-react"

export default function AdminUsersWrapper() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [cookiesSynced, setCookiesSynced] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync cookies on mount
  useEffect(() => {
    if (!mounted || loading || !user) return

    const syncCookies = async () => {
      if (typeof window !== 'undefined') {
        try {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
          const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || ''
          const storageKey = `sb-${projectRef}-auth-token`
          const stored = localStorage.getItem(storageKey)
          
          if (stored) {
            try {
              const parsed = JSON.parse(stored)
              if (parsed.access_token && parsed.refresh_token) {
                console.log('[AdminUsersWrapper] Syncing cookies...')
                const syncResponse = await fetch('/api/auth/sync-cookies', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    accessToken: parsed.access_token,
                    refreshToken: parsed.refresh_token,
                  }),
                })

                const result = await syncResponse.json()
                if (result.success) {
                  console.log('[AdminUsersWrapper] ✓ Cookies synced')
                  // Wait a bit for cookies to be set
                  await new Promise(resolve => setTimeout(resolve, 500))
                  setCookiesSynced(true)
                } else {
                  console.error('[AdminUsersWrapper] Cookie sync failed:', result.error)
                  setCookiesSynced(true) // Continue anyway
                }
              } else {
                setCookiesSynced(true) // No session to sync
              }
            } catch (e) {
              console.warn('[AdminUsersWrapper] Failed to sync cookies:', e)
              setCookiesSynced(true) // Continue anyway
            }
          } else {
            setCookiesSynced(true) // No session in localStorage
          }
        } catch (error) {
          console.error('[AdminUsersWrapper] Error syncing cookies:', error)
          setCookiesSynced(true) // Continue anyway
        }
      } else {
        setCookiesSynced(true)
      }
    }

    syncCookies()
  }, [mounted, loading, user])

  useEffect(() => {
    if (!mounted || loading || !cookiesSynced) return

    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "admin") {
      router.push("/dashboard")
      return
    }
  }, [user, loading, mounted, router, cookiesSynced])

  if (!mounted || loading || !cookiesSynced) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return <AdminUsersPageClient />
}


