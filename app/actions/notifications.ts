'use server'

import { getServerSession } from '@/lib/supabase/auth-helpers'
import { notificationQueries } from '@/lib/db/queries'
import type { ActionResponse } from './types'

/**
 * Get notifications for current user
 */
export async function getUserNotifications(filters?: { read?: boolean }): Promise<ActionResponse> {
  try {
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    const result = await notificationQueries.getByUserId(user.id, filters)
    return result
  } catch (error: any) {
    console.error('Error fetching notifications:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch notifications',
    }
  }
}

/**
 * Get unread notification count for current user
 */
export async function getUnreadCount(): Promise<ActionResponse<number>> {
  try {
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    const result = await notificationQueries.getUnreadCount(user.id)
    return result
  } catch (error: any) {
    console.error('Error fetching unread count:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch unread count',
    }
  }
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string): Promise<ActionResponse> {
  try {
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(notificationId)) {
      return { success: false, error: 'Invalid notification ID format' }
    }

    // Verify notification belongs to user
    const notificationsResult = await notificationQueries.getByUserId(user.id)
    if (!notificationsResult.success || !notificationsResult.data) {
      return { success: false, error: 'Notification not found' }
    }

    const notification = notificationsResult.data.find((n: any) => n.id === notificationId)
    if (!notification) {
      return { success: false, error: 'Notification not found or unauthorized' }
    }

    const result = await notificationQueries.markAsRead(notificationId)
    return result
  } catch (error: any) {
    console.error('Error marking notification as read:', error)
    return {
      success: false,
      error: error.message || 'Failed to mark notification as read',
    }
  }
}

/**
 * Mark all notifications as read for current user
 */
export async function markAllAsRead(): Promise<ActionResponse> {
  try {
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    const result = await notificationQueries.markAllAsRead(user.id)
    return result
  } catch (error: any) {
    console.error('Error marking all notifications as read:', error)
    return {
      success: false,
      error: error.message || 'Failed to mark all notifications as read',
    }
  }
}

