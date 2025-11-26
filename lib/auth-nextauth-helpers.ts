// Server-side NextAuth.js helpers
// These replace Supabase auth helpers for server components

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { AuthUser } from '@/lib/auth'

/**
 * Get the current session on the server
 * Returns null if not authenticated
 */
export async function getServerSession(): Promise<AuthUser | null> {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  return {
    id: session.user.id,
    email: session.user.email,
    role: session.user.role,
    name: session.user.name,
    approved: session.user.approved,
  }
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
  const session = await getServerSession()

  if (!session) {
    redirect('/login')
  }

  return session
}

/**
 * Require admin role - redirects to login if not authenticated, or dashboard if not admin
 */
export async function requireAdmin(): Promise<AuthUser> {
  const session = await getServerSession()

  if (!session) {
    redirect('/login')
  }

  if (session.role !== 'admin') {
    redirect('/dashboard')
  }

  return session
}
