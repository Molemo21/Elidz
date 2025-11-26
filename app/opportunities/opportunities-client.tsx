"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Sparkles, Calendar, DollarSign, Filter, TrendingUp, Building } from "lucide-react"
import { getAllOpportunities } from "@/app/actions/opportunities"
import { getUserMatches } from "@/app/actions/matches"
import { AIMatchingService } from "@/lib/ai-service"
import type { FundingOpportunity, Match } from "@/lib/db-schema"

export default function OpportunitiesClient() {
  const [opportunities, setOpportunities] = useState<FundingOpportunity[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)

  // Load opportunities and matches on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [oppsResult, matchesResult] = await Promise.all([
          getAllOpportunities(),
          getUserMatches(),
        ])

        if (oppsResult.success && oppsResult.data) {
          // Transform Prisma data to match schema format
          const transformedOpps = (oppsResult.data as any[]).map((o: any) => ({
            id: o.id,
            funder_name: o.funderName,
            program_name: o.programName,
            description: o.description,
            amount_range_min: Number(o.amountRangeMin),
            amount_range_max: Number(o.amountRangeMax),
            eligibility_criteria: o.eligibilityCriteria || [],
            application_url: o.applicationUrl,
            deadline: o.deadline ? new Date(o.deadline) : new Date(),
            industry_focus: o.industryFocus || [],
            funding_type: o.fundingType,
            requirements: o.requirements || [],
            created_at: o.createdAt ? new Date(o.createdAt) : new Date(),
          }))
          setOpportunities(transformedOpps)
        }

        if (matchesResult.success && matchesResult.data) {
          // Transform Prisma data to match schema format
          const transformedMatches = (matchesResult.data as any[]).map((m: any) => ({
            id: m.id,
            user_id: m.userId,
            opportunity_id: m.opportunityId,
            match_score: m.matchScore,
            match_reasons: m.matchReasons || [],
            status: m.status,
            created_at: m.createdAt ? new Date(m.createdAt) : new Date(),
            viewed_at: m.viewedAt ? new Date(m.viewedAt) : null,
          }))
          setMatches(transformedMatches)
        }
      } catch (error) {
        console.error('Error loading opportunities:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // Reload all opportunities
      const result = await getAllOpportunities()
      if (result.success && result.data) {
        const transformedOpps = (result.data as any[]).map((o: any) => ({
          id: o.id,
          funder_name: o.funderName,
          program_name: o.programName,
          description: o.description,
          amount_range_min: Number(o.amountRangeMin),
          amount_range_max: Number(o.amountRangeMax),
          eligibility_criteria: o.eligibilityCriteria || [],
          application_url: o.applicationUrl,
          deadline: o.deadline ? new Date(o.deadline) : new Date(),
          industry_focus: o.industryFocus || [],
          funding_type: o.fundingType,
          requirements: o.requirements || [],
          created_at: o.createdAt ? new Date(o.createdAt) : new Date(),
        }))
        setOpportunities(transformedOpps)
      }
      return
    }

    setSearchLoading(true)
    try {
      const results = await AIMatchingService.searchOpportunities(searchQuery, opportunities)
      setOpportunities(results)
    } finally {
      setSearchLoading(false)
    }
  }

  const getMatchScore = (opportunityId: string) => {
    const match = matches.find((m) => m.opportunity_id === opportunityId)
    return match?.match_score
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Funding Opportunities</h1>
          <p className="text-muted-foreground">Discover funding programs matched to your business needs</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 bg-card">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search opportunities by keyword, industry, or funder..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} disabled={searchLoading}>
                {searchLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Search
                  </>
                )}
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Opportunities Grid */}
        <div className="space-y-4">
          {opportunities.length > 0 ? (
            opportunities.map((opportunity) => {
              const matchScore = getMatchScore(opportunity.id)
              const daysUntilDeadline = Math.ceil(
                (opportunity.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
              )

              return (
                <Card key={opportunity.id} className="bg-card hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{opportunity.program_name}</CardTitle>
                          {matchScore && (
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {matchScore}% Match
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-base">{opportunity.funder_name}</CardDescription>
                      </div>
                      <Badge
                        variant={daysUntilDeadline <= 30 ? "destructive" : "secondary"}
                        className="whitespace-nowrap"
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        {daysUntilDeadline} days left
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">{opportunity.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {opportunity.industry_focus.map((industry) => (
                        <Badge key={industry} variant="outline">
                          {industry}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        {opportunity.funding_type}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>
                          {formatCurrency(opportunity.amount_range_min)} -{" "}
                          {formatCurrency(opportunity.amount_range_max)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Deadline: {formatDate(opportunity.deadline)}</span>
                      </div>
                    </div>

                    {matchScore && (
                      <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                        <p className="text-sm font-medium text-primary mb-1 flex items-center gap-1">
                          <Sparkles className="h-4 w-4" />
                          Why this matches you:
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-5 list-disc">
                          {matches
                            .find((m: Match) => m.opportunity_id === opportunity.id)
                            ?.match_reasons.map((reason: string, idx: number) => (
                              <li key={idx}>{reason}</li>
                            ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Link href={`/opportunities/${opportunity.id}`} className="flex-1">
                        <Button className="w-full">View Details & Apply</Button>
                      </Link>
                      <Button variant="outline">Save for Later</Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card className="bg-card">
              <CardContent className="py-12 text-center">
                <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium text-foreground mb-2">
                  {searchQuery.trim() ? 'No opportunities found' : 'No Funding Opportunities Available'}
                </p>
                <p className="text-muted-foreground mb-4">
                  {searchQuery.trim() 
                    ? 'Try adjusting your search terms or check back later for new opportunities.'
                    : 'There are currently no funding opportunities available. Please check back later or contact support for more information.'}
                </p>
                {!searchQuery.trim() && (
                  <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Tip:</strong> Complete your business profile to get notified when new opportunities become available.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
