'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function setSessionCookies(accessToken: string, refreshToken: string) {
  try {
    const cookieStore = await cookies()
    const supabase = await createClient()
    
    // Set session via Supabase client (this will set cookies properly)
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
    
    if (error) {
      console.error('Failed to set session in server action:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true }
  } catch (error: any) {
    console.error('Server action error:', error)
    return { success: false, error: error.message }
  }
}

