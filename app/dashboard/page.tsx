import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/supabase/auth-helpers'
import { isProfileComplete } from '@/app/actions/user-profiles'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/login')
  }
  
  if (session.role === 'admin') {
    redirect('/admin')
  }
  
  // Check profile completion first
  const profileComplete = await isProfileComplete()
  if (!profileComplete) {
    redirect('/onboarding')
  }
  
  // Then check approval status
  if (!session.approved) {
    redirect('/pending-approval')
  }

  return <DashboardClient user={session} />
}
