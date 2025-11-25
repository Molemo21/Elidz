"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Search, UserCheck, UserX, Filter, ArrowLeft, Download } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function AdminUsersPage() {
  const { user, loading: authLoading, isAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "pending">("all")
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [actionDialog, setActionDialog] = useState<"approve" | "decline" | null>(null)

  // Mock users data
  const [users] = useState([
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
  ])

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

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "User approved",
        description: `${selectedUser.first_name} ${selectedUser.last_name} can now access the platform.`,
      })

      setActionDialog(null)
      setSelectedUser(null)
    } catch (error) {
      toast({
        title: "Action failed",
        description: "Failed to approve user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDecline = async () => {
    if (!selectedUser) return

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "User declined",
        description: `${selectedUser.first_name} ${selectedUser.last_name}'s application has been declined.`,
      })

      setActionDialog(null)
      setSelectedUser(null)
    } catch (error) {
      toast({
        title: "Action failed",
        description: "Failed to decline user. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="bg-accent/30 min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Button variant="ghost" className="mb-4 gap-2" onClick={() => router.push("/admin")}>
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground">Manage user accounts and access approvals</p>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export Users
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">{users.length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-foreground">{users.filter((u) => u.approved).length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                  <p className="text-2xl font-bold text-foreground">{users.filter((u) => !u.approved).length}</p>
                </div>
                <UserX className="h-8 w-8 text-chart-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <CardDescription>Manage user access and view account details</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">
                          {u.first_name} {u.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{u.company}</TableCell>
                    <TableCell className="text-muted-foreground">{u.phone}</TableCell>
                    <TableCell>
                      {u.approved ? (
                        <Badge variant="outline" className="bg-success/10 text-success">
                          Approved
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-chart-4/10 text-chart-4">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{u.created_at.toLocaleDateString()}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {u.last_login ? u.last_login.toLocaleDateString() : "Never"}
                    </TableCell>
                    <TableCell className="text-right">
                      {u.approved ? (
                        <Button variant="ghost" size="sm">
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
                            className="text-success hover:bg-success/10"
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
                            className="text-destructive hover:bg-destructive/10"
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
          </CardContent>
        </Card>

        {/* Approve Dialog */}
        <Dialog open={actionDialog === "approve"} onOpenChange={() => setActionDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-success" />
                Approve User
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to approve this user's access to the platform?
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <p className="text-sm">
                  <strong>Name:</strong> {selectedUser.first_name} {selectedUser.last_name}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p className="text-sm">
                  <strong>Company:</strong> {selectedUser.company}
                </p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialog(null)}>
                Cancel
              </Button>
              <Button onClick={handleApprove} className="bg-success hover:bg-success/90">
                Approve User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Decline Dialog */}
        <Dialog open={actionDialog === "decline"} onOpenChange={() => setActionDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserX className="h-5 w-5 text-destructive" />
                Decline User
              </DialogTitle>
              <DialogDescription>Are you sure you want to decline this user's application?</DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <p className="text-sm">
                  <strong>Name:</strong> {selectedUser.first_name} {selectedUser.last_name}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p className="text-sm">
                  <strong>Company:</strong> {selectedUser.company}
                </p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialog(null)}>
                Cancel
              </Button>
              <Button onClick={handleDecline} variant="destructive">
                Decline User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
