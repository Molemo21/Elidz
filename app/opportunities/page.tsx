import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/supabase/auth-helpers'
import OpportunitiesClient from './opportunities-client'

export default async function OpportunitiesPage() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/login')
  }
  
  if (!session.approved) {
    redirect('/pending-approval')
  }

  return <OpportunitiesClient />
}

