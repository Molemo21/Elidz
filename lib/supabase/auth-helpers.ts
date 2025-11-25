import { createClient } from './server'
import { redirect } from 'next/navigation'
import type { AuthUser } from '@/lib/auth'

export async function getServerSession(): Promise<AuthUser | null> {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('id, email, role, first_name, last_name, approved')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return null
  }

  return {
    id: profile.id,
    email: profile.email,
    role: profile.role,
    name: `${profile.first_name} ${profile.last_name}`,
    approved: profile.approved,
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/login')
  }
  
  return session
}

export async function requireAdmin(): Promise<AuthUser> {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/login')
  }
  
  if (session.role !== 'admin') {
    redirect('/dashboard')
  }
  
  return session
}

