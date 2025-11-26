'use server'

import { getServerSession } from '@/lib/supabase/auth-helpers'
import { documentQueries } from '@/lib/db/queries'
import type { ActionResponse } from './types'

/**
 * Get documents for current user
 */
export async function getUserDocuments(): Promise<ActionResponse> {
  try {
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    const result = await documentQueries.getByUserId(user.id)
    return result
  } catch (error: any) {
    console.error('Error fetching documents:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch documents',
    }
  }
}

/**
 * Get document by ID
 */
export async function getDocumentById(documentId: string): Promise<ActionResponse> {
  try {
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(documentId)) {
      return { success: false, error: 'Invalid document ID format' }
    }

    const result = await documentQueries.getById(documentId)
    
    // Verify document belongs to user
    if (result.success && result.data && (result.data as any).userId !== user.id) {
      return { success: false, error: 'Document not found or unauthorized' }
    }

    return result
  } catch (error: any) {
    console.error('Error fetching document:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch document',
    }
  }
}

/**
 * Get documents by type for current user
 */
export async function getDocumentsByType(type: string): Promise<ActionResponse> {
  try {
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    if (!type || type.trim().length === 0) {
      return { success: false, error: 'Document type is required' }
    }

    const result = await documentQueries.getByType(user.id, type.trim())
    return result
  } catch (error: any) {
    console.error('Error fetching documents by type:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch documents',
    }
  }
}

/**
 * Delete document
 */
export async function deleteDocument(documentId: string): Promise<ActionResponse> {
  try {
    const user = await getServerSession()
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in' }
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(documentId)) {
      return { success: false, error: 'Invalid document ID format' }
    }

    // Verify document belongs to user
    const documentResult = await documentQueries.getById(documentId)
    if (!documentResult.success || !documentResult.data) {
      return { success: false, error: 'Document not found' }
    }

    if ((documentResult.data as any).userId !== user.id) {
      return { success: false, error: 'Document not found or unauthorized' }
    }

    const result = await documentQueries.delete(documentId)
    return result
  } catch (error: any) {
    console.error('Error deleting document:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete document',
    }
  }
}

