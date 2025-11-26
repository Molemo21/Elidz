'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Plus, Edit, Trash2, Calendar, DollarSign, Building, ArrowLeft, Database, Search, Filter, Download } from 'lucide-react'
import Link from 'next/link'
import {
  getAllOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} from '@/app/actions/opportunities'
import type { FundingOpportunityInput } from '@/lib/validations/schemas'
import {
  opportunityPool,
  getCategories,
  getIndustries,
  getFundingTypes,
  searchOpportunities,
  getOpportunitiesByCategory,
  getOpportunitiesByIndustry,
  getOpportunitiesByFundingType,
  type OpportunityTemplate,
} from '@/lib/opportunity-pool'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Opportunity {
  id: string
  funderName: string
  programName: string
  description: string
  amountRangeMin: number
  amountRangeMax: number
  eligibilityCriteria: string[]
  applicationUrl: string
  deadline: string
  industryFocus: string[]
  fundingType: string
  requirements: string[]
  createdAt: string
}

export default function AdminOpportunitiesPage() {
  const { user, loading: authLoading, isAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null)
  const [deletingOpportunity, setDeletingOpportunity] = useState<Opportunity | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState<Partial<FundingOpportunityInput>>({
    funder_name: '',
    program_name: '',
    description: '',
    amount_range_min: 0,
    amount_range_max: 0,
    eligibility_criteria: [],
    application_url: '',
    deadline: '',
    industry_focus: [],
    funding_type: '',
    requirements: [],
  })

  const [eligibilityInput, setEligibilityInput] = useState('')
  const [industryInput, setIndustryInput] = useState('')
  const [requirementsInput, setRequirementsInput] = useState('')

  // Opportunity Pool state
  const [activeTab, setActiveTab] = useState<'opportunities' | 'pool'>('opportunities')
  const [poolSearch, setPoolSearch] = useState('')
  const [poolCategory, setPoolCategory] = useState<string>('all')
  const [poolIndustry, setPoolIndustry] = useState<string>('all')
  const [poolFundingType, setPoolFundingType] = useState<string>('all')
  const [filteredPool, setFilteredPool] = useState<OpportunityTemplate[]>(opportunityPool)
  const [importingPool, setImportingPool] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login')
      } else if (!isAdmin) {
        router.push('/dashboard')
      }
    }
  }, [user, authLoading, isAdmin, router])

  useEffect(() => {
    if (isAdmin) {
      loadOpportunities()
    }
  }, [isAdmin])

  // Filter opportunity pool
  useEffect(() => {
    let filtered = opportunityPool

    // Apply search
    if (poolSearch.trim()) {
      filtered = searchOpportunities(poolSearch)
    }

    // Apply category filter
    if (poolCategory !== 'all') {
      filtered = filtered.filter((opp) => opp.category === poolCategory)
    }

    // Apply industry filter
    if (poolIndustry !== 'all') {
      filtered = filtered.filter((opp) => 
        opp.data.industry_focus && opp.data.industry_focus.includes(poolIndustry)
      )
    }

    // Apply funding type filter
    if (poolFundingType !== 'all') {
      filtered = filtered.filter((opp) => opp.fundingType === poolFundingType)
    }

    setFilteredPool(filtered)
  }, [poolSearch, poolCategory, poolIndustry, poolFundingType])

  const loadOpportunities = async () => {
    setLoading(true)
    try {
      const result = await getAllOpportunities()
      if (result.success && result.data) {
        // Transform Prisma data to component format
        const transformed = (result.data as any[]).map((o: any) => ({
          id: o.id,
          funderName: o.funderName,
          programName: o.programName,
          description: o.description,
          amountRangeMin: Number(o.amountRangeMin),
          amountRangeMax: Number(o.amountRangeMax),
          eligibilityCriteria: o.eligibilityCriteria || [],
          applicationUrl: o.applicationUrl,
          deadline: o.deadline ? new Date(o.deadline).toISOString().split('T')[0] : '',
          industryFocus: o.industryFocus || [],
          fundingType: o.fundingType,
          requirements: o.requirements || [],
          createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString(),
        }))
        setOpportunities(transformed)
      } else {
        toast({
          title: 'Failed to load opportunities',
          description: result.error || 'Could not fetch opportunities',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      console.error('Error loading opportunities:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to load opportunities',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (opportunity?: Opportunity) => {
    if (opportunity) {
      setEditingOpportunity(opportunity)
      setFormData({
        funder_name: opportunity.funderName,
        program_name: opportunity.programName,
        description: opportunity.description,
        amount_range_min: opportunity.amountRangeMin,
        amount_range_max: opportunity.amountRangeMax,
        eligibility_criteria: opportunity.eligibilityCriteria,
        application_url: opportunity.applicationUrl,
        deadline: opportunity.deadline,
        industry_focus: opportunity.industryFocus,
        funding_type: opportunity.fundingType,
        requirements: opportunity.requirements,
      })
      setEligibilityInput(opportunity.eligibilityCriteria.join(', '))
      setIndustryInput(opportunity.industryFocus.join(', '))
      setRequirementsInput(opportunity.requirements.join(', '))
    } else {
      setEditingOpportunity(null)
      setFormData({
        funder_name: '',
        program_name: '',
        description: '',
        amount_range_min: 0,
        amount_range_max: 0,
        eligibility_criteria: [],
        application_url: '',
        deadline: '',
        industry_focus: [],
        funding_type: '',
        requirements: [],
      })
      setEligibilityInput('')
      setIndustryInput('')
      setRequirementsInput('')
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingOpportunity(null)
    setFormData({})
    setEligibilityInput('')
    setIndustryInput('')
    setRequirementsInput('')
  }

  const handleSave = async () => {
    // Parse arrays from comma-separated strings
    const eligibilityCriteria = eligibilityInput
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
    const industryFocus = industryInput
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
    const requirements = requirementsInput
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    // Format deadline: convert YYYY-MM-DD to ISO 8601 datetime
    let deadlineISO = ''
    if (formData.deadline) {
      // If it's just a date (YYYY-MM-DD), convert to ISO datetime (end of day)
      const deadlineDate = new Date(formData.deadline)
      deadlineDate.setHours(23, 59, 59, 999) // Set to end of day
      deadlineISO = deadlineDate.toISOString()
    } else {
      // Default to 1 year from now if not provided
      const defaultDate = new Date()
      defaultDate.setFullYear(defaultDate.getFullYear() + 1)
      defaultDate.setHours(23, 59, 59, 999)
      deadlineISO = defaultDate.toISOString()
    }

    // Format application URL: ensure it has http:// or https://
    let applicationUrl = formData.application_url || ''
    if (applicationUrl && !applicationUrl.match(/^https?:\/\//i)) {
      applicationUrl = `https://${applicationUrl}`
    }

    const data: FundingOpportunityInput = {
      funder_name: formData.funder_name || '',
      program_name: formData.program_name || '',
      description: formData.description || '',
      amount_range_min: formData.amount_range_min || 0,
      amount_range_max: formData.amount_range_max || 0,
      eligibility_criteria: eligibilityCriteria,
      application_url: applicationUrl,
      deadline: deadlineISO,
      industry_focus: industryFocus,
      funding_type: formData.funding_type || '',
      requirements: requirements,
    }

    setSaving(true)
    try {
      let result
      if (editingOpportunity) {
        result = await updateOpportunity(editingOpportunity.id, data)
      } else {
        result = await createOpportunity(data)
      }

      if (result.success) {
        toast({
          title: editingOpportunity ? 'Opportunity updated' : 'Opportunity created',
          description: `Successfully ${editingOpportunity ? 'updated' : 'created'} ${data.program_name}`,
        })
        handleCloseDialog()
        loadOpportunities()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to save opportunity',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      console.error('Error saving opportunity:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to save opportunity',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingOpportunity) return

    setSaving(true)
    try {
      const result = await deleteOpportunity(deletingOpportunity.id)
      if (result.success) {
        toast({
          title: 'Opportunity deleted',
          description: `Successfully deleted ${deletingOpportunity.programName}`,
        })
        setIsDeleteDialogOpen(false)
        setDeletingOpportunity(null)
        loadOpportunities()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete opportunity',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      console.error('Error deleting opportunity:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete opportunity',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  const handleImportFromPool = async (template: OpportunityTemplate) => {
    setImportingPool(template.id)
    try {
      // Validate the template data before sending
      if (!template.data || !template.data.program_name || !template.data.funder_name) {
        toast({
          title: 'Invalid template',
          description: 'Template data is incomplete',
          variant: 'destructive',
        })
        setImportingPool(null)
        return
      }

      const result = await createOpportunity(template.data)
      
      if (result && typeof result === 'object' && 'success' in result) {
        if (result.success) {
          toast({
            title: 'Opportunity imported',
            description: `Successfully imported ${template.data.program_name}`,
          })
          loadOpportunities()
        } else {
          toast({
            title: 'Import failed',
            description: result.error || 'Failed to import opportunity',
            variant: 'destructive',
          })
        }
      } else {
        // Unexpected response format
        console.error('Unexpected response format:', result)
        toast({
          title: 'Import failed',
          description: 'Received an unexpected response from the server',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      console.error('Error importing opportunity:', error)
      const errorMessage = error?.message || error?.toString() || 'Failed to import opportunity'
      toast({
        title: 'Error',
        description: typeof errorMessage === 'string' ? errorMessage : 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setImportingPool(null)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="bg-accent/30 min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/admin">
              <Button variant="ghost" className="mb-4 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Admin Dashboard
              </Button>
            </Link>
            <h1 className="mb-2 text-3xl font-bold text-foreground">Funding Opportunities</h1>
            <p className="text-muted-foreground">Manage funding opportunities available to SMMEs</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'pool' ? 'default' : 'outline'}
              onClick={() => setActiveTab('pool')}
              className="gap-2"
            >
              <Database className="h-4 w-4" />
              Opportunity Pool ({opportunityPool.length})
            </Button>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Opportunity
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex gap-2 border-b">
          <Button
            variant={activeTab === 'opportunities' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('opportunities')}
            className="rounded-b-none"
          >
            Current Opportunities ({opportunities.length})
          </Button>
          <Button
            variant={activeTab === 'pool' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('pool')}
            className="rounded-b-none"
          >
            <Database className="h-4 w-4 mr-2" />
            Opportunity Pool ({opportunityPool.length})
          </Button>
        </div>

        {/* Opportunity Pool Browser */}
        {activeTab === 'pool' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Browse Opportunity Pool</CardTitle>
                <CardDescription>
                  Import pre-configured funding opportunities from our curated pool. These opportunities are ready to use and can be customized after import.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search opportunities..."
                      value={poolSearch}
                      onChange={(e) => setPoolSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={poolCategory} onValueChange={setPoolCategory}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {getCategories().map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={poolIndustry} onValueChange={setPoolIndustry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      {getIndustries().map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={poolFundingType} onValueChange={setPoolFundingType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Funding Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Funding Types</SelectItem>
                      {getFundingTypes().map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Results */}
                <div className="space-y-4">
                  {filteredPool.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-muted-foreground">No opportunities found matching your filters.</p>
                    </div>
                  ) : (
                    filteredPool.map((template) => (
                      <Card key={template.id} className="relative">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-lg">{template.data.program_name}</CardTitle>
                                <Badge variant="secondary">{template.category}</Badge>
                                <Badge variant="outline">{template.fundingType}</Badge>
                              </div>
                              <CardDescription className="text-base font-medium">
                                {template.data.funder_name}
                              </CardDescription>
                            </div>
                            <Button
                              onClick={() => handleImportFromPool(template)}
                              disabled={importingPool === template.id}
                              className="gap-2"
                            >
                              {importingPool === template.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Importing...
                                </>
                              ) : (
                                <>
                                  <Download className="h-4 w-4" />
                                  Import
                                </>
                              )}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">{template.data.description}</p>
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Amount Range</p>
                              <p className="text-sm font-medium">
                                {formatCurrency(template.data.amount_range_min)} - {formatCurrency(template.data.amount_range_max)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Deadline</p>
                              <p className="text-sm font-medium">{formatDate(template.data.deadline)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Industries</p>
                              <div className="flex flex-wrap gap-1">
                                {template.data.industry_focus.slice(0, 2).map((ind) => (
                                  <Badge key={ind} variant="outline" className="text-xs">
                                    {ind}
                                  </Badge>
                                ))}
                                {template.data.industry_focus.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{template.data.industry_focus.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Eligibility</p>
                              <p className="text-sm font-medium">{template.data.eligibility_criteria.length} criteria</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Current Opportunities */}
        {activeTab === 'opportunities' && (
          <>
            {opportunities.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
              <CardTitle className="mb-2">No Opportunities Yet</CardTitle>
              <CardDescription className="mb-4 text-center">
                Get started by creating your first funding opportunity. This will allow SMMEs to discover and apply for funding.
              </CardDescription>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                Create First Opportunity
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Opportunities ({opportunities.length})</CardTitle>
              <CardDescription>Manage and update funding opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Program Name</TableHead>
                      <TableHead>Funder</TableHead>
                      <TableHead>Amount Range</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {opportunities.map((opp) => (
                      <TableRow key={opp.id}>
                        <TableCell className="font-medium">{opp.programName}</TableCell>
                        <TableCell>{opp.funderName}</TableCell>
                        <TableCell>
                          {formatCurrency(opp.amountRangeMin)} - {formatCurrency(opp.amountRangeMax)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {formatDate(opp.deadline)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {opp.industryFocus.slice(0, 2).map((industry, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {industry}
                              </Badge>
                            ))}
                            {opp.industryFocus.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{opp.industryFocus.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{opp.fundingType}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(opp)}
                              className="gap-1"
                            >
                              <Edit className="h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDeletingOpportunity(opp)
                                setIsDeleteDialogOpen(true)
                              }}
                              className="gap-1 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
            )}
          </>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingOpportunity ? 'Edit Opportunity' : 'Create New Opportunity'}</DialogTitle>
              <DialogDescription>
                {editingOpportunity
                  ? 'Update the funding opportunity details'
                  : 'Add a new funding opportunity for SMMEs to discover and apply'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="funder_name">Funder Name *</Label>
                  <Input
                    id="funder_name"
                    value={formData.funder_name || ''}
                    onChange={(e) => setFormData({ ...formData, funder_name: e.target.value })}
                    placeholder="e.g., ELIDZ Development Fund"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="program_name">Program Name *</Label>
                  <Input
                    id="program_name"
                    value={formData.program_name || ''}
                    onChange={(e) => setFormData({ ...formData, program_name: e.target.value })}
                    placeholder="e.g., Green Energy Innovation Grant"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the funding opportunity..."
                  rows={4}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="amount_range_min">Min Amount (ZAR) *</Label>
                  <Input
                    id="amount_range_min"
                    type="number"
                    value={formData.amount_range_min || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, amount_range_min: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount_range_max">Max Amount (ZAR) *</Label>
                  <Input
                    id="amount_range_max"
                    type="number"
                    value={formData.amount_range_max || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, amount_range_max: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="funding_type">Funding Type *</Label>
                  <Input
                    id="funding_type"
                    value={formData.funding_type || ''}
                    onChange={(e) => setFormData({ ...formData, funding_type: e.target.value })}
                    placeholder="e.g., Grant, Loan, Equity"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline || ''}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="application_url">Application URL *</Label>
                  <Input
                    id="application_url"
                    type="url"
                    value={formData.application_url || ''}
                    onChange={(e) => setFormData({ ...formData, application_url: e.target.value })}
                    placeholder="https://example.com/apply"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry_focus">Industry Focus * (comma-separated)</Label>
                <Input
                  id="industry_focus"
                  value={industryInput}
                  onChange={(e) => setIndustryInput(e.target.value)}
                  placeholder="e.g., Manufacturing, Technology, Energy"
                />
                <p className="text-xs text-muted-foreground">Separate multiple industries with commas</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eligibility_criteria">Eligibility Criteria * (comma-separated)</Label>
                <Textarea
                  id="eligibility_criteria"
                  value={eligibilityInput}
                  onChange={(e) => setEligibilityInput(e.target.value)}
                  placeholder="e.g., Registered SMME, At least 2 years in operation, Annual revenue between R500k - R10m"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">Separate criteria with commas</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements * (comma-separated)</Label>
                <Textarea
                  id="requirements"
                  value={requirementsInput}
                  onChange={(e) => setRequirementsInput(e.target.value)}
                  placeholder="e.g., Business plan, Financial statements, Tax clearance certificate"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">Separate requirements with commas</p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingOpportunity ? (
                  'Update Opportunity'
                ) : (
                  'Create Opportunity'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the opportunity &quot;{deletingOpportunity?.programName}&quot;. This action
                cannot be undone and will remove all associated matches and applications.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={saving} className="bg-destructive text-destructive-foreground">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

