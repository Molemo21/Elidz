// NextAuth.js v5 exports and shared auth types
// This file provides both NextAuth functions and the AuthUser type used throughout the app

import NextAuth from 'next-auth'
import { authConfig } from './auth-nextauth'
import type { UserRole } from './db-schema'

// Create NextAuth instance for server-side use
const nextAuth = NextAuth(authConfig)

// Export NextAuth functions for server-side use
export const { auth, signIn, signOut } = nextAuth

// Export AuthUser type used throughout the application
export interface AuthUser {
  id: string
  email: string
  role: UserRole
  name: string
  approved: boolean
}
