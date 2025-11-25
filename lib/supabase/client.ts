import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Singleton client instance to avoid multiple GoTrueClient instances
let clientInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null

export function createClient() {
  // Return singleton instance if it exists
  if (clientInstance) {
    return clientInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    const errorMsg = `Missing Supabase environment variables. Please check your .env file:
NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✓ Set' : '✗ Missing'}
NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✓ Set' : '✗ Missing'}

Make sure:
1. Your .env file exists in the project root
2. The variables are prefixed with NEXT_PUBLIC_
3. You've restarted your dev server after creating/editing .env
4. There are no line breaks in the anon key`
    
    console.error(errorMsg)
    throw new Error(errorMsg)
  }

  // Ensure we're in browser environment
  if (typeof window === 'undefined') {
    throw new Error('createClient() should only be called in browser environment. Use createServerClient() for server-side.')
  }

  // Use standard Supabase client for browser operations
  // This works reliably with localStorage and doesn't have the storage adapter issues
  try {
    clientInstance = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
    })
    return clientInstance
  } catch (error: any) {
    console.error('Failed to create Supabase client:', error)
    throw error
  }
}

