"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import AdminClient from "./admin-client"
import type { AuthUser } from "@/lib/auth"

export default function AdminWrapper() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || loading) return

    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "admin") {
      router.push("/dashboard")
      return
    }
  }, [user, loading, mounted, router])

  if (!mounted || loading) {
    return (
      <>
        {/* Background Image - Full Screen (Fixed behind everything) */}
        <div className="fixed inset-0 -z-10">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
            style={{
              backgroundImage: 'url(/land.jpg)',
            }}
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-400 border-r-transparent"></div>
            <p className="text-white/80">Loading...</p>
          </div>
        </div>
      </>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return <AdminClient user={user} />
}

