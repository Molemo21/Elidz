// JWT Authentication Service
// This replaces Supabase Auth with standard JWT authentication
// Uses Prisma for database queries and bcryptjs for password hashing

import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface AuthUser {
  id: string
  email: string
  role: 'smme' | 'admin'
  name: string
  approved: boolean
}

export interface JWTPayload {
  userId: string
  email: string
  role: 'smme' | 'admin'
}

export class JWTAuthService {
  /**
   * Register a new user
   */
  static async register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    role?: 'smme' | 'admin'
  }): Promise<{ user: AuthUser; token: string }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role || 'smme',
        approved: false,
      },
    })

    // Generate JWT token
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as 'smme' | 'admin',
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role as 'smme' | 'admin',
        name: `${user.firstName} ${user.lastName}`,
        approved: user.approved,
      },
      token,
    }
  }

  /**
   * Login with email and password
   */
  static async login(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new Error('Invalid email or password')
    }

    // Check if user has a password hash (migrated to JWT auth)
    if (!user.passwordHash) {
      throw new Error(
        'This account still uses Supabase authentication. Please use the login page with Supabase Auth, or contact support to migrate your account.'
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      throw new Error('Invalid email or password')
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    // Generate JWT token
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as 'smme' | 'admin',
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role as 'smme' | 'admin',
        name: `${user.firstName} ${user.lastName}`,
        approved: user.approved,
      },
      token,
    }
  }

  /**
   * Verify JWT token and return user
   */
  static async verifyToken(token: string): Promise<AuthUser> {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as JWTPayload

      // Fetch user from database to ensure they still exist and are approved
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      })

      if (!user) {
        throw new Error('User not found')
      }

      return {
        id: user.id,
        email: user.email,
        role: user.role as 'smme' | 'admin',
        name: `${user.firstName} ${user.lastName}`,
        approved: user.approved,
      }
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token')
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired')
      }
      throw error
    }
  }

  /**
   * Generate JWT token
   */
  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    })
  }

  /**
   * Hash password (utility function)
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  /**
   * Compare password (utility function)
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  /**
   * Update user password
   */
  static async updatePassword(userId: string, newPassword: string): Promise<void> {
    const passwordHash = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    })
  }

  /**
   * Get current user by ID
   */
  static async getCurrentUser(userId: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role as 'smme' | 'admin',
      name: `${user.firstName} ${user.lastName}`,
      approved: user.approved,
    }
  }
}
