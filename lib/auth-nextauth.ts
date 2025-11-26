// NextAuth.js v5 Configuration
// Complete JWT authentication solution using NextAuth.js v5
// NextAuth.js handles sessions, token refresh, and security automatically

import type { NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        // Find user
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          throw new Error('Invalid email or password')
        }

        // Check if user has a password hash (migrated to JWT auth)
        if (!user.passwordHash) {
          throw new Error(
            'This account still uses Supabase authentication. Please contact support to migrate your account.'
          )
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )
        if (!isValidPassword) {
          throw new Error('Invalid email or password')
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        })

        // Return user object (will be encoded in JWT)
        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role as 'smme' | 'admin',
          approved: user.approved,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in - user object is available
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.approved = (user as any).approved
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'smme' | 'admin'
        session.user.approved = token.approved as boolean
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig

// Type augmentation for NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: 'smme' | 'admin'
      approved: boolean
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: 'smme' | 'admin'
    approved: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'smme' | 'admin'
    approved: boolean
  }
}
