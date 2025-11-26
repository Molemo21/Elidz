'use server'

import { getServerSession } from '@/lib/supabase/auth-helpers'
import { prisma } from '@/lib/prisma'

export interface AdminStats {
  totalUsers: number
  pendingApprovals: number
  activeApplications: number
  successRate: number
  newUsersThisMonth: number
  lastWeekLogins: number
  totalOpportunities: number
}

/**
 * Get admin dashboard statistics
 */
export async function getAdminStats(): Promise<{ success: boolean; data?: AdminStats; error?: string }> {
  try {
    // Check authentication and admin status
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    if (user.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }

    // Calculate date ranges
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Get all stats in parallel
    const [
      totalUsers,
      pendingApprovals,
      activeApplications,
      approvedApplications,
      totalApplications,
      newUsersThisMonth,
      lastWeekLogins,
      totalOpportunities,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Pending approvals
      prisma.user.count({ where: { approved: false } }),
      
      // Active applications (in_review or submitted)
      prisma.application.count({
        where: {
          status: {
            in: ['in_review', 'submitted'],
          },
        },
      }),
      
      // Approved applications
      prisma.application.count({
        where: { status: 'approved' },
      }),
      
      // Total applications
      prisma.application.count(),
      
      // New users this month
      prisma.user.count({
        where: {
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
      
      // Logins in last week (users with lastLogin in last 7 days)
      prisma.user.count({
        where: {
          lastLogin: {
            gte: oneWeekAgo,
          },
        },
      }),
      
      // Total opportunities (active - deadline in future)
      prisma.fundingOpportunity.count({
        where: {
          deadline: {
            gt: now,
          },
        },
      }),
    ])

    // Calculate success rate
    const successRate = totalApplications > 0 
      ? Math.round((approvedApplications / totalApplications) * 100)
      : 0

    const stats: AdminStats = {
      totalUsers,
      pendingApprovals,
      activeApplications,
      successRate,
      newUsersThisMonth,
      lastWeekLogins,
      totalOpportunities,
    }

    return { success: true, data: stats }
  } catch (error: any) {
    console.error('Error fetching admin stats:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch admin statistics',
    }
  }
}

