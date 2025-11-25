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

  const newMatches = matches.filter((m) => m.status === "new")
  const draftApps = applications.filter((a) => a.status === "draft")
  const submittedApps = applications.filter((a) => a.status === "submitted" || a.status === "in_review")
  const completedApps = applications.filter((a) => a.status === "approved" || a.status === "rejected")

  const getStatusBadge = (status: Application["status"]) => {
    const variants = {
      draft: { label: "Draft", variant: "secondary" as const, icon: FileText },
      in_review: { label: "In Review", variant: "default" as const, icon: Clock },
      submitted: { label: "Submitted", variant: "default" as const, icon: CheckCircle2 },
      approved: { label: "Approved", variant: "default" as const, icon: CheckCircle2 },
      rejected: { label: "Rejected", variant: "destructive" as const, icon: XCircle },
    }

    const config = variants[status] || variants.draft
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="bg-accent/30 min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground">Track your funding applications and discover new opportunities</p>
        </div>

        {/* Profile Completion Alert */}
        {profileComplete < 100 && (
          <Card className="mb-6 border-l-4 border-l-primary bg-primary/5">
            <CardContent className="flex items-start gap-4 pt-6">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">Complete Your Profile</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Complete your business profile to get better funding matches
                </p>
                <div className="flex items-center gap-4">
                  <Progress value={profileComplete} className="flex-1" />
                  <span className="text-sm font-medium text-foreground">{profileComplete}%</span>
                </div>
                <Link href="/dashboard/business-profile">
                  <Button size="sm" className="mt-4">
                    Complete Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">New Matches</CardTitle>
              <Sparkles className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{newMatches.length}</div>
              <p className="text-xs text-muted-foreground mt-1">AI-matched opportunities</p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Draft Applications</CardTitle>
              <FileText className="h-5 w-5 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{draftApps.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Ready to review</p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
              <Clock className="h-5 w-5 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{submittedApps.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Applications submitted</p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
              <TrendingUp className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">78%</div>
              <p className="text-xs text-muted-foreground mt-1">Based on platform average</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* New Matches */}
          <Card className="bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    New Matches
                  </CardTitle>
                  <CardDescription className="mt-1">AI-matched funding opportunities for you</CardDescription>
                </div>
                <Link href="/opportunities">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {newMatches.length > 0 ? (
                newMatches.map((match) => {
                  const opportunity = mockFundingOpportunities.find((o) => o.id === match.opportunity_id)
                  if (!opportunity) return null

                  return (
                    <div key={match.id} className="rounded-lg border border-border bg-background p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{opportunity.program_name}</h4>
                          <p className="text-sm text-muted-foreground">{opportunity.funder_name}</p>
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          {match.match_score}% Match
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{opportunity.description}</p>
                      <Link href={`/opportunities/${opportunity.id}`}>
                        <Button size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    Complete your profile to get matched with opportunities
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card className="bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-chart-2" />
                    Your Applications
                  </CardTitle>
                  <CardDescription className="mt-1">Track the status of your submissions</CardDescription>
                </div>
                <Link href="/applications">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {applications.length > 0 ? (
                applications.slice(0, 3).map((app) => {
                  const opportunity = mockFundingOpportunities.find((o) => o.id === app.opportunity_id)
                  if (!opportunity) return null

                  return (
                    <div key={app.id} className="rounded-lg border border-border bg-background p-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground truncate">{opportunity.program_name}</h4>
                          <p className="text-sm text-muted-foreground">{opportunity.funder_name}</p>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                      {app.ai_completed && !app.user_edited && app.status === "draft" && (
                        <p className="text-xs text-primary mb-2 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          AI-completed - ready for your review
                        </p>
                      )}
                      <Link href={`/applications/${app.id}`}>
                        <Button size="sm" variant="outline" className="w-full bg-transparent">
                          {app.status === "draft" ? "Continue Application" : "View Application"}
                        </Button>
                      </Link>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground mb-4">
                    No applications yet. Start by exploring funding opportunities.
                  </p>
                  <Link href="/opportunities">
                    <Button size="sm">Browse Opportunities</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
