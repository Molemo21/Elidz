"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, FileCheck, TrendingUp, Clock, UserCheck, AlertCircle, BarChart3, Loader2, Building } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getAdminStats } from "@/app/actions/admin-stats"
import type { AuthUser } from "@/lib/auth"
import type { AdminStats } from "@/app/actions/admin-stats"

interface AdminClientProps {
  user: AuthUser
}

export default function AdminClient({ user }: AdminClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const result = await getAdminStats()
        if (result.success && result.data) {
          setStats(result.data)
        } else {
          toast({
            title: "Failed to load stats",
            description: result.error || "Could not load dashboard statistics",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [toast])

  if (loading || !stats) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="bg-accent/30 min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and management tools</p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.totalUsers}</div>
              <p className="text-xs text-success mt-1">+{stats.newUsersThisMonth} this month</p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
              <AlertCircle className="h-5 w-5 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground mt-1">Require your attention</p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Applications</CardTitle>
              <FileCheck className="h-5 w-5 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.activeApplications}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently in progress</p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
              <TrendingUp className="h-5 w-5 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.successRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">Applications approved</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card
            className="bg-card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/admin/users")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                User Management
              </CardTitle>
              <CardDescription>Manage user accounts and approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.pendingApprovals}</p>
                  <p className="text-sm text-muted-foreground">Pending approvals</p>
                </div>
                <Button>Manage Users</Button>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/admin/applications")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-chart-2" />
                Applications
              </CardTitle>
              <CardDescription>Review and manage funding applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.activeApplications}</p>
                  <p className="text-sm text-muted-foreground">Active applications</p>
                </div>
                <Button>Manage Applications</Button>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/admin/opportunities")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Funding Opportunities
              </CardTitle>
              <CardDescription>Manage funding opportunities for SMMEs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalOpportunities || 0}</p>
                  <p className="text-sm text-muted-foreground">Active opportunities</p>
                </div>
                <Button>Manage Opportunities</Button>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push("/admin/analytics")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-chart-2" />
                Analytics & Reports
              </CardTitle>
              <CardDescription>View platform metrics and generate reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.lastWeekLogins}</p>
                  <p className="text-sm text-muted-foreground">Logins this week</p>
                </div>
                <Button>View Analytics</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-chart-4" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest platform activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>Activity tracking coming soon</p>
                <p className="text-xs">View detailed activity in Analytics & Reports</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <Card className="mt-6 bg-card">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Platform performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Application Success Rate</span>
                  <Badge variant="outline" className={stats.successRate >= 70 ? "bg-success/10 text-success" : stats.successRate >= 50 ? "bg-primary/10 text-primary" : "bg-chart-4/10 text-chart-4"}>
                    {stats.successRate >= 70 ? "Excellent" : stats.successRate >= 50 ? "Good" : "Needs Improvement"}
                  </Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${stats.successRate >= 70 ? "bg-success" : stats.successRate >= 50 ? "bg-primary" : "bg-chart-4"}`} style={{ width: `${stats.successRate}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">{stats.successRate}% of applications approved</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">User Growth</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    Active
                  </Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${Math.min(100, (stats.newUsersThisMonth / Math.max(1, stats.totalUsers)) * 100)}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">{stats.newUsersThisMonth} new users this month</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Active Engagement</span>
                  <Badge variant="outline" className={stats.lastWeekLogins > 0 ? "bg-success/10 text-success" : "bg-muted"}>
                    {stats.lastWeekLogins > 0 ? "Active" : "Low"}
                  </Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${stats.lastWeekLogins > 0 ? "bg-success" : "bg-muted"}`} style={{ width: `${Math.min(100, (stats.lastWeekLogins / Math.max(1, stats.totalUsers)) * 100)}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">{stats.lastWeekLogins} logins in last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

