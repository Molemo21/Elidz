// Server-side auth helpers - Now using NextAuth.js
// This file maintains the same interface for backward compatibility
// but uses NextAuth.js instead of Supabase Auth

import { redirect } from 'next/navigation'
import { getServerSession as getNextAuthSession, requireAuth as requireNextAuth, requireAdmin as requireNextAuthAdmin } from '@/lib/auth-nextauth-helpers'
import type { AuthUser } from '@/lib/auth'

/**
 * Get the current session on the server
 * Returns null if not authenticated
 * Now uses NextAuth.js instead of Supabase
 */
export async function getServerSession(): Promise<AuthUser | null> {
  return await getNextAuthSession()
}

/**
 * Require authentication - redirects to login if not authenticated
 * Now uses NextAuth.js instead of Supabase
 */
export async function requireAuth(): Promise<AuthUser> {
  return await requireNextAuth()
}

/**
 * Require admin role - redirects to login if not authenticated, or dashboard if not admin
 * Now uses NextAuth.js instead of Supabase
 */
export async function requireAdmin(): Promise<AuthUser> {
  return await requireNextAuthAdmin()
}
