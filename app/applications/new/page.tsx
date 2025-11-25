"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Sparkles, Edit3, Save, Send, FileSignature, AlertCircle } from "lucide-react"
import { mockFundingOpportunities } from "@/lib/mock-data"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function NewApplicationPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [edited, setEdited] = useState(false)
  const [showSignDialog, setShowSignDialog] = useState(false)
  const [signature, setSignature] = useState("")

  const opportunityId = searchParams.get("opportunityId")
  const opportunity = mockFundingOpportunities.find((o) => o.id === opportunityId)

  const [formData, setFormData] = useState({
    company_name: "GreenTech Solutions",
    registration_number: "2020/123456/07",
    contact_person: "John Smith",
    email: "john@greentech.co.za",
    phone: "(+27) 123-456-7890",
    industry_sector: "Manufacturing",
    years_in_operation: "3",
    number_of_employees: "25",
    annual_turnover: "2500000",
    business_location: "East London, Eastern Cape",
    funding_amount_requested: "350000",
    funding_purpose: "Expand manufacturing capacity",
    project_description:
      "Expanding our solar panel manufacturing facility to increase production capacity by 40%. This will enable us to meet growing demand and create new jobs.",
    job_creation_potential: "5",
    economic_impact_description:
      "This funding will enable business expansion, increase production capacity, and create sustainable employment opportunities.",
    business_plan_attached: false,
    financial_statements_attached: false,
    tax_clearance_attached: false,
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  if (authLoading || !user || !opportunity) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (!edited) setEdited(true)
  }

  const handleSaveDraft = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast({
        title: "Draft saved",
        description: "Your application has been saved. You can continue editing later.",
      })
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  const handleSign = () => {
    if (!signature.trim()) {
      toast({
        title: "Signature required",
        description: "Please enter your full name to sign the application.",
        variant: "destructive",
      })
      return
    }

    handleSubmit()
  }

  const handleSubmit = async () => {
    setShowSignDialog(false)
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Application submitted!",
        description: "Your application has been submitted successfully.",
      })
      router.push("/applications")
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-accent/30 min-h-[calc(100vh-80px)]">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Application Form</h1>
          <p className="text-muted-foreground">
            {opportunity.program_name} - {opportunity.funder_name}
          </p>
        </div>

        <Alert className="mb-6 border-primary/50 bg-primary/5">
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm">
            <strong className="text-foreground">AI-Generated Application:</strong> Review all fields carefully and make
            any necessary edits before submitting.
            {edited && <span className="text-primary ml-2">(You've made changes)</span>}
          </AlertDescription>
        </Alert>

        <form className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => handleChange("company_name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registration_number">Registration Number *</Label>
                  <Input
                    id="registration_number"
                    value={formData.registration_number}
                    onChange={(e) => handleChange("registration_number", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="contact_person">Contact Person *</Label>
                  <Input
                    id="contact_person"
                    value={formData.contact_person}
                    onChange={(e) => handleChange("contact_person", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="industry_sector">Industry Sector *</Label>
                  <Input
                    id="industry_sector"
                    value={formData.industry_sector}
                    onChange={(e) => handleChange("industry_sector", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business_location">Business Location *</Label>
                  <Input
                    id="business_location"
                    value={formData.business_location}
                    onChange={(e) => handleChange("business_location", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="years_in_operation">Years in Operation *</Label>
                  <Input
                    id="years_in_operation"
                    type="number"
                    value={formData.years_in_operation}
                    onChange={(e) => handleChange("years_in_operation", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number_of_employees">Number of Employees *</Label>
                  <Input
                    id="number_of_employees"
                    type="number"
                    value={formData.number_of_employees}
                    onChange={(e) => handleChange("number_of_employees", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annual_turnover">Annual Turnover (ZAR) *</Label>
                  <Input
                    id="annual_turnover"
                    type="number"
                    value={formData.annual_turnover}
                    onChange={(e) => handleChange("annual_turnover", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funding Request */}
          <Card>
            <CardHeader>
              <CardTitle>Funding Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="funding_amount_requested">Funding Amount Requested (ZAR) *</Label>
                  <Input
                    id="funding_amount_requested"
                    type="number"
                    value={formData.funding_amount_requested}
                    onChange={(e) => handleChange("funding_amount_requested", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job_creation_potential">Job Creation Potential *</Label>
                  <Input
                    id="job_creation_potential"
                    type="number"
                    value={formData.job_creation_potential}
                    onChange={(e) => handleChange("job_creation_potential", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="funding_purpose">Purpose of Funding *</Label>
                <Textarea
                  id="funding_purpose"
                  rows={3}
                  value={formData.funding_purpose}
                  onChange={(e) => handleChange("funding_purpose", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_description">Project Description *</Label>
                <Textarea
                  id="project_description"
                  rows={4}
                  value={formData.project_description}
                  onChange={(e) => handleChange("project_description", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="economic_impact_description">Economic Impact *</Label>
                <Textarea
                  id="economic_impact_description"
                  rows={3}
                  value={formData.economic_impact_description}
                  onChange={(e) => handleChange("economic_impact_description", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Required Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>Confirm which documents you have attached</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="business_plan_attached"
                  checked={formData.business_plan_attached}
                  onCheckedChange={(checked) => handleChange("business_plan_attached", checked as boolean)}
                />
                <Label htmlFor="business_plan_attached" className="cursor-pointer">
                  Business Plan
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="financial_statements_attached"
                  checked={formData.financial_statements_attached}
                  onCheckedChange={(checked) => handleChange("financial_statements_attached", checked as boolean)}
                />
                <Label htmlFor="financial_statements_attached" className="cursor-pointer">
                  Financial Statements
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tax_clearance_attached"
                  checked={formData.tax_clearance_attached}
                  onCheckedChange={(checked) => handleChange("tax_clearance_attached", checked as boolean)}
                />
                <Label htmlFor="tax_clearance_attached" className="cursor-pointer">
                  Tax Clearance Certificate
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard")} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={loading}
              className="gap-2 bg-transparent"
            >
              <Save className="h-4 w-4" />
              Save as Draft
            </Button>
            <Button type="button" onClick={() => setShowSignDialog(true)} disabled={loading} className="gap-2">
              <FileSignature className="h-4 w-4" />
              Review & Submit
            </Button>
          </div>
        </form>

        {/* Signature Dialog */}
        <Dialog open={showSignDialog} onOpenChange={setShowSignDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileSignature className="h-5 w-5 text-primary" />
                Sign Application
              </DialogTitle>
              <DialogDescription>
                By signing, you confirm that all information provided is accurate and complete.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  This is a legally binding signature. Ensure all information is correct before proceeding.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="signature">Enter Your Full Name *</Label>
                <Input
                  id="signature"
                  placeholder="John Smith"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Your digital signature: {signature || "(not signed)"}</p>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setShowSignDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="button" onClick={handleSign} disabled={loading} className="flex-1 gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Sign & Submit
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
