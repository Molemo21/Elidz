import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/supabase/auth-helpers'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/login')
  }
  
  if (session.role === 'admin') {
    redirect('/admin')
  }
  
  if (!session.approved) {
    redirect('/pending-approval')
  }

  return <DashboardClient user={session} />
}
