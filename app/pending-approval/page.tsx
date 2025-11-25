import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/supabase/auth-helpers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default async function PendingApprovalPage() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/login')
  }
  
  if (session.approved) {
    redirect(session.role === 'admin' ? '/admin' : '/dashboard')
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-accent/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-chart-4/10 mx-auto">
            <AlertCircle className="h-8 w-8 text-chart-4" />
          </div>
          <CardTitle className="text-2xl">Account Pending Approval</CardTitle>
          <CardDescription>
            Your account is waiting for admin approval
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Thank you for registering! Your account has been created and is currently pending approval from our admin team.
          </p>
          <p className="text-sm text-muted-foreground text-center">
            You will receive an email notification once your account has been approved. This usually takes 24-48 hours.
          </p>
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              If you have any questions, please contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

