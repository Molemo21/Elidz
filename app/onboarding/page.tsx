"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Building, ArrowRight, CheckCircle2 } from "lucide-react"
import { isProfileComplete } from "@/app/actions/user-profiles"
import Link from "next/link"

export default function OnboardingPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [checkingProfile, setCheckingProfile] = useState(true)
  const [profileComplete, setProfileComplete] = useState(false)

  useEffect(() => {
    const checkProfile = async () => {
      if (!authLoading && user) {
        try {
          // Check if profile is already complete
          const complete = await isProfileComplete()
          setProfileComplete(complete)
          
          if (complete) {
            // If profile is complete, redirect based on approval status
            if (user.approved) {
              router.replace("/dashboard")
            } else {
              router.replace("/pending-approval")
            }
            return
          }
        } catch (error) {
          console.error("Error checking profile:", error)
        } finally {
          setCheckingProfile(false)
        }
      } else if (!authLoading && !user) {
        // No user, redirect to login
        router.replace("/login")
      }
    }

    checkProfile()
  }, [user, authLoading, router])

  // Show loading while checking auth or profile
  if (authLoading || checkingProfile || !user) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mb-4 h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If profile is complete, we're redirecting (handled above)
  if (profileComplete) {
    return null
  }

  return (
    <div className="bg-accent/30 min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Building className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">Complete Your Business Profile</h1>
            <p className="text-muted-foreground text-lg">
              Let's set up your business profile to get matched with the best funding opportunities
            </p>
          </div>

          {/* Onboarding Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What You'll Need</CardTitle>
              <CardDescription>Gather this information before you start</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Business Information</p>
                    <p className="text-sm text-muted-foreground">
                      Company name, registration number, industry, and location
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Business Metrics</p>
                    <p className="text-sm text-muted-foreground">
                      Annual revenue, number of employees, and years in business
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Funding Requirements</p>
                    <p className="text-sm text-muted-foreground">
                      Amount needed, purpose, and preferred funding types
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  Ready to Get Started?
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Complete your business profile to unlock personalized funding matches powered by AI
                </p>
                <Link href="/dashboard/business-profile">
                  <Button size="lg" className="gap-2">
                    Start Onboarding
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <p className="mt-4 text-xs text-muted-foreground">
                  This will take approximately 5-10 minutes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

