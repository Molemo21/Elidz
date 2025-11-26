"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import type { AuthUser } from "@/lib/auth"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Map NextAuth session to AuthUser format
  const user: AuthUser | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        name: session.user.name,
        approved: session.user.approved,
      }
    : null

  const loading = status === "loading"

  // Note: Login is handled directly via NextAuth signIn in the login page
  // This maintains the same interface for compatibility
  const login = async (email: string, password: string) => {
    // This will be called from the login page using NextAuth signIn
    // Return user from current session
    return user
  }

  const logout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  // Note: Register is handled via server action in register page
  // This maintains the same interface for compatibility
  const register = async (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    role: "smme" | "admin"
  }) => {
    // This will be called from the register page using server action
    // Return user if needed
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
