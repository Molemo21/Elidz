import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/supabase/auth-helpers'
import ApplicationsClient from './applications-client'

export default async function ApplicationsPage() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/login')
  }
  
  if (!session.approved) {
    redirect('/pending-approval')
  }

  return <ApplicationsClient />
}

