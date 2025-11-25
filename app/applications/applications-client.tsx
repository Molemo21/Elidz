"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Clock, CheckCircle2, XCircle, Calendar } from "lucide-react"
import { mockApplications, mockFundingOpportunities } from "@/lib/mock-data"
import type { Application } from "@/lib/db-schema"

export default function ApplicationsClient() {
  const [applications] = useState<Application[]>(mockApplications)

  const draftApps = applications.filter((a) => a.status === "draft")
  const submittedApps = applications.filter((a) => a.status === "submitted" || a.status === "in_review")
  const completedApps = applications.filter((a) => a.status === "approved" || a.status === "rejected")

  const getStatusConfig = (status: Application["status"]) => {
    const configs = {
      draft: { label: "Draft", variant: "secondary" as const, icon: FileText, color: "text-muted-foreground" },
      in_review: { label: "In Review", variant: "default" as const, icon: Clock, color: "text-chart-4" },
      submitted: { label: "Submitted", variant: "default" as const, icon: CheckCircle2, color: "text-chart-2" },
      approved: { label: "Approved", variant: "default" as const, icon: CheckCircle2, color: "text-success" },
      rejected: { label: "Rejected", variant: "destructive" as const, icon: XCircle, color: "text-destructive" },
    }
    return configs[status] || configs.draft
  }

  const ApplicationCard = ({ app }: { app: Application }) => {
    const opportunity = mockFundingOpportunities.find((o) => o.id === app.opportunity_id)
    if (!opportunity) return null

    const config = getStatusConfig(app.status)
    const Icon = config.icon

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg">{opportunity.program_name}</CardTitle>
              <CardDescription>{opportunity.funder_name}</CardDescription>
            </div>
            <Badge variant={config.variant} className="gap-1">
              <Icon className="h-3 w-3" />
              {config.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {app.status === "draft" ? "Created" : "Submitted"} {new Date(app.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {app.outcome && (
            <div
              className={`rounded-lg border p-3 ${
                app.outcome === "approved" ? "bg-success/5 border-success/20" : "bg-destructive/5 border-destructive/20"
              }`}
            >
              <p className={`text-sm font-medium ${app.outcome === "approved" ? "text-success" : "text-destructive"}`}>
                {app.outcome === "approved" ? "Application Approved" : "Application Rejected"}
              </p>
              {app.outcome_reason && <p className="text-sm text-muted-foreground mt-1">{app.outcome_reason}</p>}
            </div>
          )}

          <Link href={`/applications/${app.id}`}>
            <Button variant="outline" className="w-full bg-transparent">
              {app.status === "draft" ? "Continue Application" : "View Details"}
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="bg-accent/30 min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">My Applications</h1>
          <p className="text-muted-foreground">Track and manage your funding applications</p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
            <TabsTrigger value="draft">Drafts ({draftApps.length})</TabsTrigger>
            <TabsTrigger value="submitted">In Progress ({submittedApps.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedApps.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {applications.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {applications.map((app) => (
                  <ApplicationCard key={app.id} app={app} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium text-foreground mb-2">No applications yet</p>
                  <p className="text-muted-foreground mb-4">Start by exploring funding opportunities</p>
                  <Link href="/opportunities">
                    <Button>Browse Opportunities</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {draftApps.map((app) => (
                <ApplicationCard key={app.id} app={app} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="submitted" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {submittedApps.map((app) => (
                <ApplicationCard key={app.id} app={app} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {completedApps.map((app) => (
                <ApplicationCard key={app.id} app={app} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
