"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Search, UserCheck, UserX, Filter, ArrowLeft, Download, RefreshCw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getAllUsers, approveUser, declineUser } from "@/app/actions/users"

interface User {
  id: string
  email: string
  role: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  approved: boolean
  created_at: string
  last_login: string | null
  password_hash?: string | null // Optional - added to check if user needs password migration
}

export default function AdminUsersPage() {
  const { user, loading: authLoading, isAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "pending">("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [actionDialog, setActionDialog] = useState<"approve" | "decline" | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const isFetchingRef = useRef(false)
  const hasInitialFetchRef = useRef(false)
  const mountedRef = useRef(true)
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])
  
  // Fetch users from database - use ref to store function to avoid dependency issues
  const fetchUsersRef = useRef<(() => Promise<void>) | null>(null)
  
  fetchUsersRef.current = async () => {
    // Prevent multiple simultaneous fetches
    if (isFetchingRef.current) {
      console.log('[AdminUsersPage] Already fetching users, skipping...')
      return
    }
    
    // Don't fetch if component is unmounted
    if (!mountedRef.current) {
      console.log('[AdminUsersPage] Component unmounted, skipping fetch...')
      return
    }
    
    try {
      isFetchingRef.current = true
      setLoading(true)
      console.log('[AdminUsersPage] Starting to fetch users...')
      
      // Call server action
      const response = await getAllUsers()
      
      // Check if component is still mounted before updating state
      if (!mountedRef.current) {
        console.log('[AdminUsersPage] Component unmounted during fetch, aborting state update')
        return
      }
      
      // Normalize data to always be an array for getAllUsers
      const usersData = response.data
      const usersArray: User[] = Array.isArray(usersData) 
        ? usersData 
        : usersData 
          ? [usersData] 
          : []
      
      console.log('[AdminUsersPage] getAllUsers response:', {
        success: response.success,
        dataLength: usersArray.length,
        error: response.error,
        errorCode: (response as any).errorCode,
      })
      
      if (response.success) {
        console.log(`[AdminUsersPage] Successfully loaded ${usersArray.length} users`)
        setUsers(usersArray)
      } else {
        console.error('[AdminUsersPage] Failed to load users:', response.error)
        
        // Show error message - don't auto-refresh to avoid loops
        if (mountedRef.current) {
          toast({
            title: "Failed to load users",
            description: response.error || "An error occurred while fetching users. Please refresh the page manually.",
            variant: "destructive",
          })
        }
      }
    } catch (error: any) {
      console.error("[AdminUsersPage] Unexpected error fetching users:", {
        message: error.message,
        stack: error.stack,
        error,
      })
      if (mountedRef.current) {
        toast({
          title: "Error",
          description: error.message || "Failed to load users. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
      isFetchingRef.current = false
    }
  }

  // Single effect for auth check, redirect, and initial fetch
  // Stable dependency array - always the same size
  useEffect(() => {
    // Wait for auth to load
    if (authLoading) {
      console.log('[AdminUsersPage] Waiting for auth to load...')
      return
    }
    
    // Handle redirects
    if (!user) {
      console.log('[AdminUsersPage] No user, redirecting to login')
      router.push("/login")
      return
    }
    
    if (!isAdmin) {
      console.log('[AdminUsersPage] User is not admin, redirecting to dashboard')
      router.push("/dashboard")
      return
    }
    
    // Only fetch once when all conditions are met
    // Use a strict check to prevent any re-fetches
    if (hasInitialFetchRef.current) {
      console.log('[AdminUsersPage] Already fetched, skipping...')
      return
    }
    
    hasInitialFetchRef.current = true
    console.log('[AdminUsersPage] Initial fetch - admin authenticated', { userId: user.id, email: user.email })
    
    // Use ref to call function - avoids dependency issues
    if (fetchUsersRef.current) {
      fetchUsersRef.current()
    } else {
      console.error('[AdminUsersPage] fetchUsersRef.current is null!')
    }
  }, [authLoading, user, isAdmin, router]) // Stable dependency array

  if (authLoading || !user || !isAdmin) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const filteredUsers = users.filter((u) => {
    const firstName = (u.first_name || "").toLowerCase()
    const lastName = (u.last_name || "").toLowerCase()
    const email = (u.email || "").toLowerCase()
    
    const matchesSearch =
      firstName.includes(searchQuery.toLowerCase()) ||
      lastName.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase())

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "approved" && u.approved) ||
      (filterStatus === "pending" && !u.approved)

    return matchesSearch && matchesFilter
  })

  const handleApprove = async () => {
    if (!selectedUser) return

    try {
      setActionLoading(true)
      const response = await approveUser(selectedUser.id)

      if (response.success) {
        toast({
          title: "User approved",
          description: `${selectedUser.first_name || ""} ${selectedUser.last_name || ""} can now access the platform.`,
        })
        
        // Refresh users list
        if (fetchUsersRef.current) {
          await fetchUsersRef.current()
        }
        setActionDialog(null)
        setSelectedUser(null)
      } else {
        toast({
          title: "Action failed",
          description: response.error || "Failed to approve user. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error approving user:", error)
      toast({
        title: "Action failed",
        description: error.message || "Failed to approve user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDecline = async () => {
    if (!selectedUser) return

    try {
      setActionLoading(true)
      const response = await declineUser(selectedUser.id)

      if (response.success) {
        toast({
          title: "User declined",
          description: `${selectedUser.first_name || ""} ${selectedUser.last_name || ""}'s application has been declined.`,
        })
        
        // Refresh users list
        if (fetchUsersRef.current) {
          await fetchUsersRef.current()
        }
        setActionDialog(null)
        setSelectedUser(null)
      } else {
        toast({
          title: "Action failed",
          description: response.error || "Failed to decline user. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error declining user:", error)
      toast({
        title: "Action failed",
        description: error.message || "Failed to decline user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
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
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-2 bg-transparent" 
              onClick={() => fetchUsersRef.current?.()}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Users
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Need Password</p>
                  <p className="text-2xl font-bold text-foreground">{users.filter((u) => !u.password_hash).length}</p>
                </div>
                <UserX className="h-8 w-8 text-chart-3" />
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
                  placeholder="Search by name or email..."
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
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
                      <p className="text-sm text-muted-foreground mt-2">Loading users...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-muted-foreground">
                        {searchQuery || filterStatus !== "all" 
                          ? "No users match your filters" 
                          : "No users found"}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">
                            {u.first_name || ""} {u.last_name || ""}
                          </p>
                          <p className="text-sm text-muted-foreground">{u.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{u.phone || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {u.role || "smme"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {u.approved ? (
                            <Badge variant="outline" className="bg-success/10 text-success w-fit">
                              Approved
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-chart-4/10 text-chart-4 w-fit">
                              Pending
                            </Badge>
                          )}
                          {!u.password_hash && (
                            <Badge variant="outline" className="bg-chart-3/10 text-chart-3 w-fit text-xs">
                              Needs Password
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {u.last_login ? new Date(u.last_login).toLocaleDateString() : "Never"}
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
                  ))
                )}
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
                  <strong>Name:</strong> {selectedUser.first_name || ""} {selectedUser.last_name || ""}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p className="text-sm">
                  <strong>Role:</strong> {selectedUser.role || "smme"}
                </p>
                {selectedUser.phone && (
                  <p className="text-sm">
                    <strong>Phone:</strong> {selectedUser.phone}
                  </p>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialog(null)} disabled={actionLoading}>
                Cancel
              </Button>
              <Button 
                onClick={handleApprove} 
                className="bg-success hover:bg-success/90"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  "Approve User"
                )}
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
                  <strong>Name:</strong> {selectedUser.first_name || ""} {selectedUser.last_name || ""}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p className="text-sm">
                  <strong>Role:</strong> {selectedUser.role || "smme"}
                </p>
                {selectedUser.phone && (
                  <p className="text-sm">
                    <strong>Phone:</strong> {selectedUser.phone}
                  </p>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setActionDialog(null)} disabled={actionLoading}>
                Cancel
              </Button>
              <Button 
                onClick={handleDecline} 
                variant="destructive"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Declining...
                  </>
                ) : (
                  "Decline User"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
