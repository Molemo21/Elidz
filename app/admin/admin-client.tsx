"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, FileCheck, TrendingUp, Clock, UserCheck, AlertCircle, BarChart3 } from "lucide-react"
import type { AuthUser } from "@/lib/auth"

interface AdminClientProps {
  user: AuthUser
}

export default function AdminClient({ user }: AdminClientProps) {
  const router = useRouter()

  const stats = {
    totalUsers: 247,
    pendingApprovals: 12,
    activeApplications: 89,
    successRate: 78,
    newUsersThisMonth: 34,
    lastWeekLogins: 156,
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
        <div className="grid gap-6 lg:grid-cols-3">
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
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-success" />
                  <span className="text-muted-foreground">3 new users registered today</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-chart-2" />
                  <span className="text-muted-foreground">5 applications submitted</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">2 applications approved</span>
                </div>
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
                  <span className="text-muted-foreground">AI Match Accuracy</span>
                  <Badge variant="outline" className="bg-success/10 text-success">
                    Excellent
                  </Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-success" style={{ width: "94%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">User Satisfaction</span>
                  <Badge variant="outline" className="bg-success/10 text-success">
                    High
                  </Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-success" style={{ width: "87%" }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Application Completion</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    Good
                  </Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "76%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

