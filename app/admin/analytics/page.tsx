"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Download, Calendar, TrendingUp, Users, FileCheck, Target, ArrowLeft, BarChart3 } from "lucide-react"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function AnalyticsPage() {
  const { user, loading: authLoading, isAdmin } = useAuth()
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("30days")

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login")
      } else if (!isAdmin) {
        router.push("/dashboard")
      }
    }
  }, [user, authLoading, isAdmin, router])

  if (authLoading || !user || !isAdmin) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Mock analytics data
  const userGrowth = [
    { month: "Jan", users: 45 },
    { month: "Feb", users: 67 },
    { month: "Mar", users: 89 },
    { month: "Apr", users: 123 },
    { month: "May", users: 156 },
    { month: "Jun", users: 189 },
  ]

  const applicationStats = [
    { month: "Jan", submitted: 12, approved: 9, rejected: 3 },
    { month: "Feb", submitted: 18, approved: 14, rejected: 4 },
    { month: "Mar", submitted: 25, approved: 19, rejected: 6 },
    { month: "Apr", submitted: 32, approved: 26, rejected: 6 },
    { month: "May", submitted: 28, approved: 22, rejected: 6 },
    { month: "Jun", submitted: 35, approved: 28, rejected: 7 },
  ]

  const industryDistribution = [
    { name: "Manufacturing", value: 35, color: "hsl(var(--chart-1))" },
    { name: "Technology", value: 28, color: "hsl(var(--chart-2))" },
    { name: "Agriculture", value: 15, color: "hsl(var(--chart-3))" },
    { name: "Healthcare", value: 12, color: "hsl(var(--chart-4))" },
    { name: "Other", value: 10, color: "hsl(var(--chart-5))" },
  ]

  const fundingByStage = [
    { stage: "Startup", amount: 2500000 },
    { stage: "Growth", amount: 5800000 },
    { stage: "Expansion", amount: 4200000 },
    { stage: "Mature", amount: 3100000 },
  ]

  const demographics = [
    { province: "Eastern Cape", count: 45 },
    { province: "Gauteng", count: 67 },
    { province: "Western Cape", count: 52 },
    { province: "KZN", count: 38 },
    { province: "Other", count: 45 },
  ]

  const handleExport = () => {
    // Mock export functionality
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Metric,Value\n" +
      "Total Users,247\n" +
      "Applications Submitted,150\n" +
      "Applications Approved,117\n" +
      "Success Rate,78%"

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "analytics_report.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-accent/30 min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Button variant="ghost" className="mb-4 gap-2" onClick={() => router.push("/admin")}>
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
            <p className="text-muted-foreground">Platform metrics and performance insights</p>
          </div>
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="year">This year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold text-foreground">247</p>
                  <p className="text-xs text-success mt-1">+12% from last month</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Applications</p>
                  <p className="text-3xl font-bold text-foreground">150</p>
                  <p className="text-xs text-success mt-1">+8% from last month</p>
                </div>
                <FileCheck className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-3xl font-bold text-foreground">78%</p>
                  <p className="text-xs text-success mt-1">+3% from last month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Funding Matched</p>
                  <p className="text-3xl font-bold text-foreground">R15.6M</p>
                  <p className="text-xs text-success mt-1">+15% from last month</p>
                </div>
                <Target className="h-8 w-8 text-chart-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  users: { label: "Users", color: "hsl(var(--chart-1))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Outcomes</CardTitle>
              <CardDescription>Monthly application statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  submitted: { label: "Submitted", color: "hsl(var(--chart-2))" },
                  approved: { label: "Approved", color: "hsl(var(--chart-3))" },
                  rejected: { label: "Rejected", color: "hsl(var(--chart-5))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={applicationStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="submitted" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="approved" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="rejected" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Industry Distribution</CardTitle>
              <CardDescription>Users by industry sector</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  manufacturing: { label: "Manufacturing", color: "hsl(var(--chart-1))" },
                  technology: { label: "Technology", color: "hsl(var(--chart-2))" },
                  agriculture: { label: "Agriculture", color: "hsl(var(--chart-3))" },
                  healthcare: { label: "Healthcare", color: "hsl(var(--chart-4))" },
                  other: { label: "Other", color: "hsl(var(--chart-5))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={industryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {industryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Funding by Business Stage</CardTitle>
              <CardDescription>Total funding amount (ZAR)</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  amount: { label: "Amount", color: "hsl(var(--chart-1))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fundingByStage} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="stage" type="category" stroke="hsl(var(--muted-foreground))" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="amount" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Geographic Distribution
            </CardTitle>
            <CardDescription>Users by province</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Users", color: "hsl(var(--chart-2))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demographics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="province" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
