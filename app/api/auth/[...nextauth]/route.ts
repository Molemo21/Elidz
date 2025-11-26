// NextAuth.js v5 API Route Handler

import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth-nextauth'

// NextAuth v5 returns an object with handlers property
const { handlers } = NextAuth(authConfig)

// Export the handlers
export const { GET, POST } = handlers
