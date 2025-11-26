"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { 
  Users, 
  FileCheck, 
  TrendingUp, 
  Clock, 
  UserCheck, 
  AlertCircle, 
  BarChart3,
  Search,
  UserX,
  Filter,
  Download,
  Calendar,
  Target
} from "lucide-react"
import type { AuthUser } from "@/lib/auth"
import AdminSidebar, { type AdminTab } from "./admin-sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

interface AdminClientProps {
  user: AuthUser
}

export default function AdminClient({ user }: AdminClientProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard")
  const { toast } = useToast()

  const stats = {
    totalUsers: 247,
    pendingApprovals: 12,
    activeApplications: 89,
    successRate: 78,
    newUsersThisMonth: 34,
    lastWeekLogins: 156,
  }

  return (
    <>
      {/* Background Image - Full Screen (Fixed behind everything) */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: 'url(/land.jpg)',
          }}
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="lg:pl-64 min-h-screen">
        <main className="container mx-auto px-4 py-8 lg:px-8">
          {activeTab === "dashboard" && <DashboardTab stats={stats} onTabChange={setActiveTab} />}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </main>
      </div>
    </>
  )
}

// Dashboard Tab Component
function DashboardTab({ stats, onTabChange }: { stats: any; onTabChange: (tab: AdminTab) => void }) {
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-white/80">System overview and management tools</p>
      </div>

          {/* Quick Stats */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Total Users</CardTitle>
                <Users className="h-5 w-5 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
                <p className="text-xs text-green-400 mt-1">+{stats.newUsersThisMonth} this month</p>
              </CardContent>
            </Card>

            <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Pending Approvals</CardTitle>
                <AlertCircle className="h-5 w-5 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.pendingApprovals}</div>
                <p className="text-xs text-white/60 mt-1">Require your attention</p>
              </CardContent>
            </Card>

            <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Active Applications</CardTitle>
                <FileCheck className="h-5 w-5 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.activeApplications}</div>
                <p className="text-xs text-white/60 mt-1">Currently in progress</p>
              </CardContent>
            </Card>

            <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/80">Success Rate</CardTitle>
                <TrendingUp className="h-5 w-5 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.successRate}%</div>
                <p className="text-xs text-white/60 mt-1">Applications approved</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card
              className="border-white/20 bg-white/10 backdrop-blur-lg shadow-xl hover:bg-white/15 transition-all cursor-pointer"
              onClick={() => onTabChange("users")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="h-5 w-5 text-orange-400" />
                  User Management
                </CardTitle>
                <CardDescription className="text-white/70">Manage user accounts and approvals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.pendingApprovals}</p>
                    <p className="text-sm text-white/60">Pending approvals</p>
                  </div>
                  <Button className="bg-orange-500 text-white hover:bg-orange-600">Manage Users</Button>
                </div>
              </CardContent>
            </Card>

            <Card
              className="border-white/20 bg-white/10 backdrop-blur-lg shadow-xl hover:bg-white/15 transition-all cursor-pointer"
              onClick={() => onTabChange("analytics")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="h-5 w-5 text-orange-400" />
                  Analytics & Reports
                </CardTitle>
                <CardDescription className="text-white/70">View platform metrics and generate reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.lastWeekLogins}</p>
                    <p className="text-sm text-white/60">Logins this week</p>
                  </div>
                  <Button className="bg-orange-500 text-white hover:bg-orange-600">View Analytics</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-xl hover:bg-white/15 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Clock className="h-5 w-5 text-orange-400" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-white/70">Latest platform activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-green-400" />
                    <span className="text-white/70">3 new users registered today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-orange-400" />
                    <span className="text-white/70">5 applications submitted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-white/70">2 applications approved</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <Card className="mt-6 border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">System Health</CardTitle>
              <CardDescription className="text-white/70">Platform performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80">AI Match Accuracy</span>
                    <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400/30">
                      Excellent
                    </Badge>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400" style={{ width: "94%" }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80">User Satisfaction</span>
                    <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400/30">
                      High
                    </Badge>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400" style={{ width: "87%" }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80">Application Completion</span>
                    <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-400/30">
                      Good
                    </Badge>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400" style={{ width: "76%" }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
    </>
  )
}

// Users Tab Component
function UsersTab() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "pending">("all")
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [actionDialog, setActionDialog] = useState<"approve" | "decline" | null>(null)

  const users = [
    {
      id: "1",
      email: "john.smith@greentech.co.za",
      first_name: "John",
      last_name: "Smith",
      company: "GreenTech Solutions",
      phone: "+27 123 456 7890",
      approved: true,
      created_at: new Date("2025-01-15"),
      last_login: new Date("2025-03-20"),
    },
    {
      id: "2",
      email: "sarah.jones@manufacturing.co.za",
      first_name: "Sarah",
      last_name: "Jones",
      company: "SA Manufacturing",
      phone: "+27 234 567 8901",
      approved: false,
      created_at: new Date("2025-03-18"),
      last_login: null,
    },
    {
      id: "3",
      email: "michael.brown@techstart.co.za",
      first_name: "Michael",
      last_name: "Brown",
      company: "TechStart Innovations",
      phone: "+27 345 678 9012",
      approved: false,
      created_at: new Date("2025-03-19"),
      last_login: null,
    },
  ]

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.company.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "approved" && u.approved) ||
      (filterStatus === "pending" && !u.approved)

    return matchesSearch && matchesFilter
  })

  const handleApprove = async () => {
    if (!selectedUser) return
    await new Promise((resolve) => setTimeout(resolve, 500))
    toast({
      title: "User approved",
      description: `${selectedUser.first_name} ${selectedUser.last_name} can now access the platform.`,
    })
    setActionDialog(null)
    setSelectedUser(null)
  }

  const handleDecline = async () => {
    if (!selectedUser) return
    await new Promise((resolve) => setTimeout(resolve, 500))
    toast({
      title: "User declined",
      description: `${selectedUser.first_name} ${selectedUser.last_name}'s application has been declined.`,
    })
    setActionDialog(null)
    setSelectedUser(null)
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-white/80">Manage user accounts and access approvals</p>
        </div>
        <Button variant="outline" className="gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10">
          <Download className="h-4 w-4" />
          Export Users
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Approved</p>
                <p className="text-2xl font-bold text-white">{users.filter((u) => u.approved).length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Pending Approval</p>
                <p className="text-2xl font-bold text-white">{users.filter((u) => !u.approved).length}</p>
              </div>
              <UserX className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6 border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <Input
                placeholder="Search by name, email, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white/10 border-white/20 text-white">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/20">
                <SelectItem value="all" className="text-white">All Users</SelectItem>
                <SelectItem value="approved" className="text-white">Approved</SelectItem>
                <SelectItem value="pending" className="text-white">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-white">Users ({filteredUsers.length})</CardTitle>
          <CardDescription className="text-white/70">Manage user access and view account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20 hover:bg-white/5">
                  <TableHead className="text-white/80">User</TableHead>
                  <TableHead className="text-white/80">Company</TableHead>
                  <TableHead className="text-white/80">Contact</TableHead>
                  <TableHead className="text-white/80">Status</TableHead>
                  <TableHead className="text-white/80">Joined</TableHead>
                  <TableHead className="text-white/80">Last Login</TableHead>
                  <TableHead className="text-right text-white/80">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id} className="border-white/20 hover:bg-white/5">
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{u.first_name} {u.last_name}</p>
                        <p className="text-sm text-white/60">{u.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-white/70">{u.company}</TableCell>
                    <TableCell className="text-white/70">{u.phone}</TableCell>
                    <TableCell>
                      {u.approved ? (
                        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400/30">
                          Approved
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-400/30">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-white/70">{u.created_at.toLocaleDateString()}</TableCell>
                    <TableCell className="text-white/70">
                      {u.last_login ? u.last_login.toLocaleDateString() : "Never"}
                    </TableCell>
                    <TableCell className="text-right">
                      {u.approved ? (
                        <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                          View Details
                        </Button>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(u)
                              setActionDialog("approve")
                            }}
                            className="border-green-400/30 text-green-400 hover:bg-green-500/20"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(u)
                              setActionDialog("decline")
                            }}
                            className="border-red-400/30 text-red-400 hover:bg-red-500/20"
                          >
                            Decline
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={actionDialog === "approve"} onOpenChange={() => setActionDialog(null)}>
        <DialogContent className="border-white/20 bg-gray-900/95 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <UserCheck className="h-5 w-5 text-green-400" />
              Approve User
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Are you sure you want to approve this user's access to the platform?
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="rounded-lg bg-white/5 p-4 space-y-2 border border-white/10">
              <p className="text-sm text-white">
                <strong>Name:</strong> {selectedUser.first_name} {selectedUser.last_name}
              </p>
              <p className="text-sm text-white">
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p className="text-sm text-white">
                <strong>Company:</strong> {selectedUser.company}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)} className="border-white/20 text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button onClick={handleApprove} className="bg-green-500 hover:bg-green-600 text-white">
              Approve User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decline Dialog */}
      <Dialog open={actionDialog === "decline"} onOpenChange={() => setActionDialog(null)}>
        <DialogContent className="border-white/20 bg-gray-900/95 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <UserX className="h-5 w-5 text-red-400" />
              Decline User
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Are you sure you want to decline this user's application?
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="rounded-lg bg-white/5 p-4 space-y-2 border border-white/10">
              <p className="text-sm text-white">
                <strong>Name:</strong> {selectedUser.first_name} {selectedUser.last_name}
              </p>
              <p className="text-sm text-white">
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p className="text-sm text-white">
                <strong>Company:</strong> {selectedUser.company}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)} className="border-white/20 text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button onClick={handleDecline} className="bg-red-500 hover:bg-red-600 text-white">
              Decline User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Analytics Tab Component
function AnalyticsTab() {
  const [timeRange, setTimeRange] = useState("30days")

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
    { name: "Manufacturing", value: 35, color: "#f97316" },
    { name: "Technology", value: 28, color: "#22c55e" },
    { name: "Agriculture", value: 15, color: "#3b82f6" },
    { name: "Healthcare", value: 12, color: "#a855f7" },
    { name: "Other", value: 10, color: "#ec4899" },
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
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics & Reports</h1>
          <p className="text-white/80">Platform metrics and performance insights</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/20">
              <SelectItem value="7days" className="text-white">Last 7 days</SelectItem>
              <SelectItem value="30days" className="text-white">Last 30 days</SelectItem>
              <SelectItem value="90days" className="text-white">Last 90 days</SelectItem>
              <SelectItem value="year" className="text-white">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} className="gap-2 bg-orange-500 text-white hover:bg-orange-600">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Total Users</p>
                <p className="text-3xl font-bold text-white">247</p>
                <p className="text-xs text-green-400 mt-1">+12% from last month</p>
              </div>
              <Users className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Applications</p>
                <p className="text-3xl font-bold text-white">150</p>
                <p className="text-xs text-green-400 mt-1">+8% from last month</p>
              </div>
              <FileCheck className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Success Rate</p>
                <p className="text-3xl font-bold text-white">78%</p>
                <p className="text-xs text-green-400 mt-1">+3% from last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Funding Matched</p>
                <p className="text-3xl font-bold text-white">R15.6M</p>
                <p className="text-xs text-green-400 mt-1">+15% from last month</p>
              </div>
              <Target className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">User Growth</CardTitle>
            <CardDescription className="text-white/70">Monthly registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                users: { label: "Users", color: "#f97316" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ fill: "#f97316", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Application Outcomes</CardTitle>
            <CardDescription className="text-white/70">Monthly application statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                submitted: { label: "Submitted", color: "#f97316" },
                approved: { label: "Approved", color: "#22c55e" },
                rejected: { label: "Rejected", color: "#ef4444" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicationStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="submitted" fill="#f97316" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="approved" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Industry Distribution</CardTitle>
            <CardDescription className="text-white/70">Users by industry sector</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                manufacturing: { label: "Manufacturing", color: "#f97316" },
                technology: { label: "Technology", color: "#22c55e" },
                agriculture: { label: "Agriculture", color: "#3b82f6" },
                healthcare: { label: "Healthcare", color: "#a855f7" },
                other: { label: "Other", color: "#ec4899" },
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

        <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Funding by Business Stage</CardTitle>
            <CardDescription className="text-white/70">Total funding amount (ZAR)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                amount: { label: "Amount", color: "#f97316" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fundingByStage} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="rgba(255,255,255,0.7)" />
                  <YAxis dataKey="stage" type="category" stroke="rgba(255,255,255,0.7)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="amount" fill="#f97316" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BarChart3 className="h-5 w-5" />
            Geographic Distribution
          </CardTitle>
          <CardDescription className="text-white/70">Users by province</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: { label: "Users", color: "#f97316" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demographics}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="province" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  )
}

// Settings Tab Component
function SettingsTab() {
  return (
    <>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">Settings</h1>
        <p className="text-white/80">Platform configuration and preferences</p>
      </div>

      <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-white">Settings</CardTitle>
          <CardDescription className="text-white/70">Configure platform settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">Settings panel coming soon...</p>
        </CardContent>
      </Card>
    </>
  )
}

