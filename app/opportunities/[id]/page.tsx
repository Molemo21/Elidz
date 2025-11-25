"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Calendar, DollarSign, FileText, CheckCircle2, Sparkles, ArrowLeft, Building } from "lucide-react"
import { mockFundingOpportunities, mockMatches } from "@/lib/mock-data"
import { AIMatchingService } from "@/lib/ai-service"
import type { FundingOpportunity, UserProfile } from "@/lib/db-schema"

export default function OpportunityDetailPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [opportunity, setOpportunity] = useState<FundingOpportunity | null>(null)
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }

    if (params.id) {
      const opp = mockFundingOpportunities.find((o) => o.id === params.id)
      setOpportunity(opp || null)
    }
  }, [user, authLoading, router, params.id])

  if (authLoading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!opportunity) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Opportunity not found</p>
        <Link href="/opportunities">
          <Button className="mt-4">Back to Opportunities</Button>
        </Link>
      </div>
    )
  }

  const match = mockMatches.find((m) => m.opportunity_id === opportunity.id)

  const handleStartApplication = async () => {
    setGenerating(true)
    setProgress(0)

    // Simulate AI generation progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 300)

    try {
      // Mock user profile
      const mockProfile: UserProfile = {
        id: "profile1",
        user_id: user.id,
        company_name: "GreenTech Solutions",
        registration_number: "2020/123456/07",
        industry: "Manufacturing",
        business_description: "Solar panel manufacturing and installation",
        annual_revenue: 2500000,
        employees_count: 25,
        years_in_business: 3,
        location: "East London, Eastern Cape",
        funding_requirements: {
          amount_needed: 350000,
          funding_purpose: "Expand manufacturing capacity",
          business_stage: "growth",
          industry_sector: ["Manufacturing", "Energy"],
          preferred_funding_type: ["Grant", "Loan"],
        },
        documents: [],
        updated_at: new Date(),
      }

      const formData = await AIMatchingService.completeApplication(mockProfile, opportunity)

      setProgress(100)

      toast({
        title: "Application generated!",
        description: "AI has completed your application. Review and edit before submitting.",
      })

      // Store application and redirect
      setTimeout(() => {
        router.push(`/applications/new?opportunityId=${opportunity.id}`)
      }, 500)
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate application. Please try again.",
        variant: "destructive",
      })
    } finally {
      clearInterval(progressInterval)
      setGenerating(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-ZA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="bg-accent/30 min-h-[calc(100vh-80px)]">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link href="/opportunities">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Opportunities
          </Button>
        </Link>

        {generating && (
          <Card className="mb-6 border-primary bg-primary/5">
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">AI is generating your application...</h3>
              </div>
              <Progress value={progress} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                Analyzing your profile and filling in the application form
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6 bg-card">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <CardTitle className="text-2xl">{opportunity.program_name}</CardTitle>
                  {match && (
                    <Badge className="bg-primary/10 text-primary border-primary/20">{match.match_score}% Match</Badge>
                  )}
                </div>
                <CardDescription className="text-base flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {opportunity.funder_name}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-base px-3 py-1">
                {opportunity.funding_type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{opportunity.description}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">Funding Amount</h3>
                </div>
                <p className="text-lg text-muted-foreground">
                  {formatCurrency(opportunity.amount_range_min)} - {formatCurrency(opportunity.amount_range_max)}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">Application Deadline</h3>
                </div>
                <p className="text-lg text-muted-foreground">{formatDate(opportunity.deadline)}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Industry Focus</h3>
              <div className="flex flex-wrap gap-2">
                {opportunity.industry_focus.map((industry) => (
                  <Badge key={industry} variant="secondary">
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">Eligibility Criteria</h3>
              <ul className="space-y-2">
                {opportunity.eligibility_criteria.map((criteria, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <span>{criteria}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">Required Documents</h3>
              <ul className="space-y-2">
                {opportunity.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                    <FileText className="h-5 w-5 text-chart-2 mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {match && (
              <div className="rounded-lg bg-primary/10 border border-primary/20 p-4">
                <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Why this matches you
                </h3>
                <ul className="space-y-1">
                  {match.match_reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button onClick={handleStartApplication} disabled={generating} className="flex-1 gap-2" size="lg">
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Application...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Start AI-Powered Application
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
