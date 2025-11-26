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
import { Loader2, Search, Filter, ArrowLeft, RefreshCw, FileText, Eye } from "lucide-react"
import { getAllApplications, updateApplicationStatus } from "@/app/actions/applications"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Application {
  id: string
  userId: string
  opportunityId: string
  status: string
  formData: Record<string, any>
  submittedAt: string | null
  reviewedAt: string | null
  outcome: string | null
  signature: string | null
  createdAt: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
  }
  opportunity: {
    id: string
    programName: string
    funderName: string
  }
}

export default function AdminApplicationsPage() {
  const { user, loading: authLoading, isAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "submitted" | "approved" | "rejected" | "draft">("all")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [viewDialog, setViewDialog] = useState(false)
  const [applications, setApplications] = useState<Application[]>([])
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

  // Fetch applications from database
  const fetchApplicationsRef = useRef<(() => Promise<void>) | null>(null)

  fetchApplicationsRef.current = async () => {
    if (isFetchingRef.current || !mountedRef.current) {
      return
    }

    try {
      isFetchingRef.current = true
      setLoading(true)
      console.log('[AdminApplicationsPage] Starting to fetch applications...')

      const response = await getAllApplications()

      if (!mountedRef.current) {
        return
      }

      const applicationsData = response.data
      const applicationsArray: Application[] = Array.isArray(applicationsData)
        ? applicationsData
        : applicationsData
          ? [applicationsData]
          : []

      console.log('[AdminApplicationsPage] getAllApplications response:', {
        success: response.success,
        dataLength: applicationsArray.length,
        error: response.error,
      })

      if (response.success) {
        console.log(`[AdminApplicationsPage] Successfully loaded ${applicationsArray.length} applications`)
        setApplications(applicationsArray)
      } else {
        console.error('[AdminApplicationsPage] Failed to load applications:', response.error)
        if (mountedRef.current) {
          toast({
            title: "Failed to load applications",
            description: response.error || "An error occurred while fetching applications.",
            variant: "destructive",
          })
        }
      }
    } catch (error: any) {
      console.error("[AdminApplicationsPage] Unexpected error:", error)
      if (mountedRef.current) {
        toast({
          title: "Error",
          description: error.message || "Failed to load applications.",
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
  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push("/login")
      return
    }

    if (!isAdmin) {
      router.push("/dashboard")
      return
    }

    if (hasInitialFetchRef.current) {
      return
    }

    hasInitialFetchRef.current = true
    console.log('[AdminApplicationsPage] Initial fetch - admin authenticated')
    if (fetchApplicationsRef.current) {
      fetchApplicationsRef.current()
    }
  }, [authLoading, user, isAdmin, router])

  if (authLoading || !user || !isAdmin) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const filteredApplications = applications.filter((app) => {
    const userEmail = (app.user?.email || "").toLowerCase()
    const userName = `${app.user?.firstName || ""} ${app.user?.lastName || ""}`.toLowerCase()
    const programName = (app.opportunity?.programName || "").toLowerCase()
    const funderName = (app.opportunity?.funderName || "").toLowerCase()

    const matchesSearch =
      userEmail.includes(searchQuery.toLowerCase()) ||
      userName.includes(searchQuery.toLowerCase()) ||
      programName.includes(searchQuery.toLowerCase()) ||
      funderName.includes(searchQuery.toLowerCase())

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "submitted" && app.status === "submitted") ||
      (filterStatus === "approved" && app.status === "approved") ||
      (filterStatus === "rejected" && app.status === "rejected") ||
      (filterStatus === "draft" && app.status === "draft")

    return matchesSearch && matchesFilter
  })

  const handleStatusUpdate = async (applicationId: string, newStatus: 'approved' | 'rejected') => {
    try {
      setActionLoading(true)
      const response = await updateApplicationStatus(applicationId, newStatus)

      if (response.success) {
        toast({
          title: `Application ${newStatus}`,
          description: `Application has been ${newStatus}.`,
        })

        // Refresh applications list
        if (fetchApplicationsRef.current) {
          await fetchApplicationsRef.current()
        }
        setViewDialog(false)
        setSelectedApplication(null)
      } else {
        toast({
          title: "Action failed",
          description: response.error || `Failed to ${newStatus} application.`,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error(`Error ${newStatus} application:`, error)
      toast({
        title: "Action failed",
        description: error.message || `Failed to ${newStatus} application.`,
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
      draft: { variant: "outline", className: "bg-muted" },
      submitted: { variant: "default", className: "bg-primary/10 text-primary" },
      in_review: { variant: "default", className: "bg-chart-2/10 text-chart-2" },
      approved: { variant: "default", className: "bg-success/10 text-success" },
      rejected: { variant: "destructive", className: "bg-destructive/10 text-destructive" },
    }

    const config = variants[status] || { variant: "outline" as const, className: "" }

    return (
      <Badge variant={config.variant} className={config.className}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    )
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
            <h1 className="text-3xl font-bold text-foreground">Application Management</h1>
            <p className="text-muted-foreground">Review and manage funding applications</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2 bg-transparent"
              onClick={() => fetchApplicationsRef.current?.()}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                  <p className="text-2xl font-bold text-foreground">{applications.length}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                  <p className="text-2xl font-bold text-foreground">
                    {applications.filter((a) => a.status === "submitted").length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-foreground">
                    {applications.filter((a) => a.status === "approved").length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-foreground">
                    {applications.filter((a) => a.status === "rejected").length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-destructive" />
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
                  placeholder="Search by user, program, or funder..."
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
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications ({filteredApplications.length})</CardTitle>
            <CardDescription>Review and manage funding applications</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Funding Program</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Reviewed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
                      <p className="text-sm text-muted-foreground mt-2">Loading applications...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">
                        {searchQuery || filterStatus !== "all"
                          ? "No applications match your filters"
                          : "No applications found"}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">
                            {app.user?.firstName || ""} {app.user?.lastName || ""}
                          </p>
                          <p className="text-sm text-muted-foreground">{app.user?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{app.opportunity?.programName}</p>
                          <p className="text-sm text-muted-foreground">{app.opportunity?.funderName}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : "Not submitted"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {app.reviewedAt ? new Date(app.reviewedAt).toLocaleDateString() : "Not reviewed"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedApplication(app)
                            setViewDialog(true)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* View Application Dialog */}
        <Dialog open={viewDialog} onOpenChange={setViewDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                Review application from {selectedApplication?.user?.firstName}{" "}
                {selectedApplication?.user?.lastName}
              </DialogDescription>
            </DialogHeader>
            {selectedApplication && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Applicant</p>
                    <p className="text-foreground">
                      {selectedApplication.user?.firstName} {selectedApplication.user?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{selectedApplication.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Funding Program</p>
                    <p className="text-foreground">{selectedApplication.opportunity?.programName}</p>
                    <p className="text-sm text-muted-foreground">{selectedApplication.opportunity?.funderName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    {getStatusBadge(selectedApplication.status)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                    <p className="text-foreground">
                      {selectedApplication.submittedAt
                        ? new Date(selectedApplication.submittedAt).toLocaleString()
                        : "Not submitted"}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Application Form Data</p>
                  <div className="rounded-lg bg-muted p-4 space-y-3">
                    {Object.entries(selectedApplication.formData || {}).map(([key, value]) => (
                      <div key={key} className="border-b pb-2 last:border-0">
                        <p className="text-sm font-medium text-foreground capitalize">
                          {key.replace(/_/g, " ")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedApplication.signature && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Signature</p>
                    <p className="text-foreground">{selectedApplication.signature}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialog(false)} disabled={actionLoading}>
                Close
              </Button>
              {selectedApplication?.status === "submitted" && (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => handleStatusUpdate(selectedApplication.id, "rejected")}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Reject"
                    )}
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(selectedApplication.id, "approved")}
                    className="bg-success hover:bg-success/90"
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Approve"
                    )}
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

