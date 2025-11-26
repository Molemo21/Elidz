'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'
import { isProfileComplete } from '@/app/actions/user-profiles'

export default function PendingApprovalPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  
  useEffect(() => {
    const checkUserStatus = async () => {
      if (!loading) {
        setIsChecking(false)
        
        // If no user, redirect to login
        if (!user) {
          router.replace('/login')
          return
        }
        
        // If user is admin, redirect to admin dashboard
        if (user.role === 'admin') {
          router.replace('/admin')
          return
        }
        
        // Check profile completion first
        try {
          const profileComplete = await isProfileComplete()
          if (!profileComplete) {
            // Redirect to onboarding if profile is incomplete
            router.replace('/onboarding')
            return
          }
        } catch (error) {
          console.error('Error checking profile completion:', error)
          // On error, redirect to onboarding to be safe
          router.replace('/onboarding')
          return
        }
        
        // If user is approved, redirect to dashboard
        if (user.approved) {
          router.replace('/dashboard')
          return
        }
        
        // If we get here, profile is complete but user is not approved
        // This is the correct state for this page
      }
    }
    
    checkUserStatus()
  }, [user, loading, router])
  
  // Show loading while checking auth
  if (loading || isChecking) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mb-4 h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }
  
  // If no user or user is approved, we're redirecting (handled above)
  if (!user || user.approved) {
    return null
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
            Thank you for completing your business profile! Your information has been submitted and is currently pending approval from our admin team.
          </p>
          <p className="text-sm text-muted-foreground text-center">
            Our team will review your profile and documents. You will receive an email notification once your account has been approved. This usually takes 24-48 hours.
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

