"use client"

import type React from "react"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { 
  Loader2, 
  Building2, 
  DollarSign, 
  Upload, 
  FileText,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  X,
  File
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

type Step = 1 | 2 | 3 | 4

interface DocumentFile {
  name: string
  file: File | null
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    // Step 1: Business Details
    company_name: "",
    cipc_registration_number: "",
    location: "",
    industry: "",
    business_age: "",
    compliance_status: "" as "compliant" | "non_compliant" | "pending" | "",
    business_description: "",
    
    // Step 2: Funding Needs
    amount_needed: "",
    funding_purpose: "",
    urgency: "" as "low" | "medium" | "high" | "critical" | "",
    funding_type: "" as "grant" | "loan" | "equity" | "mixed" | "",
    
    // Step 3: Documents (will be handled separately)
    
    // Step 4: Additional Information
    revenue_range: "",
    employees_count: "",
    financial_health: "" as "excellent" | "good" | "fair" | "poor" | "",
  })

  const [documents, setDocuments] = useState<Record<string, DocumentFile>>({
    cipc_docs: { name: "CIPC Documents", file: null },
    coida: { name: "COIDA Certificate", file: null },
    tax_clearance: { name: "Tax Clearance Certificate", file: null },
    bank_statements: { name: "Bank Statements", file: null },
    id: { name: "ID Document", file: null },
    business_plan: { name: "Business Plan", file: null },
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  // Check if current step is valid - memoized to prevent unnecessary re-renders
  const isStepValid = useMemo(() => {
    switch (currentStep) {
      case 1:
        return !!(
          formData.company_name?.trim() &&
          formData.cipc_registration_number?.trim() &&
          formData.location?.trim() &&
          formData.industry?.trim() &&
          formData.business_age &&
          parseInt(formData.business_age) >= 0 &&
          formData.compliance_status
        )
      case 2:
        return !!(
          formData.amount_needed &&
          parseFloat(formData.amount_needed) > 0 &&
          formData.funding_purpose &&
          formData.urgency &&
          formData.funding_type
        )
      case 3:
        return Object.values(documents).every((doc) => doc.file !== null)
      case 4:
        return !!(
          formData.revenue_range &&
          formData.employees_count &&
          parseInt(formData.employees_count) >= 0 &&
          formData.financial_health
        )
      default:
        return false
    }
  }, [currentStep, formData, documents])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error immediately when user selects (value is guaranteed to be valid)
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
    // Mark as touched
    setTouched((prev) => ({ ...prev, [name]: true }))
  }, [])

  const validateField = useCallback((name: string, value?: string): boolean => {
    // Use provided value or fall back to formData
    const fieldValue = value !== undefined ? value : formData[name as keyof typeof formData]
    let isValid = true
    let errorMessage = ""

    switch (name) {
      case "company_name":
        if (!String(fieldValue || "").trim()) {
          isValid = false
          errorMessage = "Company name is required"
        }
        break
      case "cipc_registration_number":
        if (!String(fieldValue || "").trim()) {
          isValid = false
          errorMessage = "CIPC registration number is required"
        }
        break
      case "location":
        if (!String(fieldValue || "").trim()) {
          isValid = false
          errorMessage = "Location is required"
        }
        break
      case "industry":
        if (!String(fieldValue || "").trim()) {
          isValid = false
          errorMessage = "Industry is required"
        }
        break
      case "business_age":
        if (!fieldValue || parseInt(String(fieldValue)) < 0) {
          isValid = false
          errorMessage = "Business age is required"
        }
        break
      case "compliance_status":
        if (!fieldValue || String(fieldValue) === "") {
          isValid = false
          errorMessage = "Compliance status is required"
        }
        break
      case "amount_needed":
        if (!fieldValue || parseFloat(String(fieldValue)) <= 0) {
          isValid = false
          errorMessage = "Amount needed is required"
        }
        break
      case "funding_purpose":
        if (!fieldValue || String(fieldValue) === "") {
          isValid = false
          errorMessage = "Funding purpose is required"
        }
        break
      case "urgency":
        if (!fieldValue || String(fieldValue) === "") {
          isValid = false
          errorMessage = "Urgency level is required"
        }
        break
      case "funding_type":
        if (!fieldValue || String(fieldValue) === "") {
          isValid = false
          errorMessage = "Funding type is required"
        }
        break
      case "revenue_range":
        if (!fieldValue || String(fieldValue) === "") {
          isValid = false
          errorMessage = "Revenue range is required"
        }
        break
      case "employees_count":
        if (!fieldValue || parseInt(String(fieldValue)) < 0) {
          isValid = false
          errorMessage = "Number of employees is required"
        }
        break
      case "financial_health":
        if (!fieldValue || String(fieldValue) === "") {
          isValid = false
          errorMessage = "Financial health indicator is required"
        }
        break
    }

    if (!isValid) {
      setErrors((prev) => ({ ...prev, [name]: errorMessage }))
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    return isValid
  }, [])

  const handleBlur = useCallback((name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    validateField(name)
  }, [validateField])

  const handleFileChange = (docKey: string, file: File | null) => {
    setDocuments((prev) => ({
      ...prev,
      [docKey]: {
        ...prev[docKey],
        file,
      },
    }))
    // Clear error when file is uploaded
    if (file && errors[docKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[docKey]
        return newErrors
      })
    }
  }

  const validateStep = (step: Step): boolean => {
    let isValid = true
    const stepErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.company_name.trim()) {
          stepErrors.company_name = "Company name is required"
          isValid = false
        }
        if (!formData.cipc_registration_number.trim()) {
          stepErrors.cipc_registration_number = "CIPC registration number is required"
          isValid = false
        }
        if (!formData.location.trim()) {
          stepErrors.location = "Location is required"
          isValid = false
        }
        if (!formData.industry.trim()) {
          stepErrors.industry = "Industry is required"
          isValid = false
        }
        if (!formData.business_age || parseInt(formData.business_age) < 0) {
          stepErrors.business_age = "Business age is required"
          isValid = false
        }
        if (!formData.compliance_status || formData.compliance_status === "") {
          stepErrors.compliance_status = "Compliance status is required"
          isValid = false
        }
        break
      case 2:
        if (!formData.amount_needed || parseFloat(formData.amount_needed) <= 0) {
          stepErrors.amount_needed = "Amount needed is required"
          isValid = false
        }
        if (!formData.funding_purpose || formData.funding_purpose === "") {
          stepErrors.funding_purpose = "Funding purpose is required"
          isValid = false
        }
        if (!formData.urgency || formData.urgency === "") {
          stepErrors.urgency = "Urgency level is required"
          isValid = false
        }
        if (!formData.funding_type || formData.funding_type === "") {
          stepErrors.funding_type = "Funding type is required"
          isValid = false
        }
        break
      case 3:
        const stepErrors: Record<string, string> = {}
        Object.entries(documents).forEach(([key, doc]) => {
          if (!doc.file) {
            stepErrors[key] = `${doc.name} is required`
            isValid = false
          }
        })
        if (!isValid) {
          setErrors((prev) => ({ ...prev, ...stepErrors }))
        }
        break
      case 4:
        if (!formData.revenue_range || formData.revenue_range === "") {
          stepErrors.revenue_range = "Revenue range is required"
          isValid = false
        }
        if (!formData.employees_count || parseInt(formData.employees_count) < 0) {
          stepErrors.employees_count = "Number of employees is required"
          isValid = false
        }
        if (!formData.financial_health || formData.financial_health === "") {
          stepErrors.financial_health = "Financial health indicator is required"
          isValid = false
        }
        break
    }

    if (!isValid) {
      setErrors((prev) => ({ ...prev, ...stepErrors }))
      // Mark all fields as touched
      const touchedFields: Record<string, boolean> = {}
      Object.keys(stepErrors).forEach((key) => {
        touchedFields[key] = true
      })
      setTouched((prev) => ({ ...prev, ...touchedFields }))
    }

    return isValid
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => (prev + 1) as Step)
        // Clear errors when moving to next step
        setErrors({})
      } else {
        handleSubmit()
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      // TODO: Save to backend - user_profiles table and upload documents
      // For now, just show success message
      
      toast({
        title: "Onboarding completed!",
        description: "Your business information has been saved successfully.",
      })

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BusinessDetailsStep
            formData={formData}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            handleBlur={handleBlur}
            errors={errors}
            touched={touched}
          />
        )
      case 2:
        return (
          <FundingNeedsStep
            formData={formData}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            handleBlur={handleBlur}
            errors={errors}
            touched={touched}
          />
        )
      case 3:
        return <DocumentsStep documents={documents} handleFileChange={handleFileChange} errors={errors} />
      case 4:
        return (
          <AdditionalInfoStep
            formData={formData}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            handleBlur={handleBlur}
            errors={errors}
            touched={touched}
          />
        )
      default:
        return null
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Business Details"
      case 2:
        return "Funding Needs"
      case 3:
        return "Upload Documents"
      case 4:
        return "Additional Information"
      default:
        return ""
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Tell us about your business and compliance status"
      case 2:
        return "What funding do you need and how urgent is it?"
      case 3:
        return "Upload required documents for verification"
      case 4:
        return "Help us understand your financial position"
      default:
        return ""
    }
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
      
      {/* Content */}
      <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/home.png"
              alt="ELIDZ-STP"
              width={240}
              height={80}
              className="h-16 md:h-20 w-auto object-contain"
              priority
            />
          </div>

          {/* Onboarding Card */}
          <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-2xl">
            <CardHeader className="space-y-4">
              <div className="text-center">
                <CardTitle className="text-3xl font-bold text-white">Complete Your Business Profile</CardTitle>
                <CardDescription className="text-base text-white/90 mt-2">
                  {getStepDescription()}
                </CardDescription>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-white/80">
                  <span>Step {currentStep} of {totalSteps}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2 bg-white/10" />
              </div>

              {/* Step Indicators */}
              <div className="flex items-center justify-between pt-4">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                          ${step < currentStep
                            ? "bg-green-500 border-green-400 text-white"
                            : step === currentStep
                            ? "bg-orange-500 border-orange-400 text-white"
                            : "bg-white/10 border-white/30 text-white/50"
                          }
                        `}
                      >
                        {step < currentStep ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-semibold">{step}</span>
                        )}
                      </div>
                      <span className={`text-xs mt-2 text-center ${step === currentStep ? "text-white font-medium" : "text-white/60"}`}>
                        {step === 1 ? "Business" : step === 2 ? "Funding" : step === 3 ? "Documents" : "Additional"}
                      </span>
                    </div>
                    {step < totalSteps && (
                      <div
                        className={`h-0.5 flex-1 mx-2 ${
                          step < currentStep ? "bg-green-400" : "bg-white/20"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="min-h-[400px]">
                {renderStepContent()}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-white/20">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1 || loading}
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={loading || !isStepValid}
                  className="bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : currentStep === totalSteps ? (
                    <>
                      Complete Onboarding
                      <CheckCircle2 className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Next Step
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

// Step 1: Business Details
function BusinessDetailsStep({
  formData,
  handleChange,
  handleSelectChange,
  handleBlur,
  errors,
  touched,
}: {
  formData: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSelectChange: (name: string, value: string) => void
  handleBlur: (name: string) => void
  errors: Record<string, string>
  touched: Record<string, boolean>
}) {
  const hasError = (name: string) => touched[name] && errors[name]
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-white/20">
        <Building2 className="h-5 w-5 text-orange-400" />
        <h3 className="text-xl font-semibold text-white">Business Details</h3>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="company_name" className="text-sm font-medium text-white">
            Company Name <span className="text-orange-400">*</span>
          </Label>
          <Input
            id="company_name"
            name="company_name"
            placeholder="ABC Enterprises (Pty) Ltd"
            value={formData.company_name}
            onChange={handleChange}
            onBlur={() => handleBlur("company_name")}
            required
            className={`h-11 bg-white/10 text-white placeholder:text-white/50 ${
              hasError("company_name") ? "border-red-500 focus:border-red-500" : "border-white/20"
            }`}
          />
          {hasError("company_name") && (
            <p className="text-sm text-red-400">{errors.company_name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cipc_registration_number" className="text-sm font-medium text-white">
            CIPC Registration Number <span className="text-orange-400">*</span>
          </Label>
          <Input
            id="cipc_registration_number"
            name="cipc_registration_number"
            placeholder="2023/123456/07"
            value={formData.cipc_registration_number}
            onChange={handleChange}
            onBlur={() => handleBlur("cipc_registration_number")}
            required
            className={`h-11 bg-white/10 text-white placeholder:text-white/50 ${
              hasError("cipc_registration_number") ? "border-red-500 focus:border-red-500" : "border-white/20"
            }`}
          />
          {hasError("cipc_registration_number") && (
            <p className="text-sm text-red-400">{errors.cipc_registration_number}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium text-white">
            Location <span className="text-orange-400">*</span>
          </Label>
          <Input
            id="location"
            name="location"
            placeholder="City, Province, South Africa"
            value={formData.location}
            onChange={handleChange}
            onBlur={() => handleBlur("location")}
            required
            className={`h-11 bg-white/10 text-white placeholder:text-white/50 ${
              hasError("location") ? "border-red-500 focus:border-red-500" : "border-white/20"
            }`}
          />
          {hasError("location") && (
            <p className="text-sm text-red-400">{errors.location}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry" className="text-sm font-medium text-white">
            Industry <span className="text-orange-400">*</span>
          </Label>
          <Input
            id="industry"
            name="industry"
            placeholder="e.g., Technology, Agriculture, Manufacturing"
            value={formData.industry}
            onChange={handleChange}
            onBlur={() => handleBlur("industry")}
            required
            className={`h-11 bg-white/10 text-white placeholder:text-white/50 ${
              hasError("industry") ? "border-red-500 focus:border-red-500" : "border-white/20"
            }`}
          />
          {hasError("industry") && (
            <p className="text-sm text-red-400">{errors.industry}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_age" className="text-sm font-medium text-white">
            Business Age (Years) <span className="text-orange-400">*</span>
          </Label>
          <Input
            id="business_age"
            name="business_age"
            type="number"
            placeholder="0"
            value={formData.business_age}
            onChange={handleChange}
            onBlur={() => handleBlur("business_age")}
            required
            className={`h-11 bg-white/10 text-white placeholder:text-white/50 ${
              hasError("business_age") ? "border-red-500 focus:border-red-500" : "border-white/20"
            }`}
          />
          {hasError("business_age") && (
            <p className="text-sm text-red-400">{errors.business_age}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="compliance_status" className="text-sm font-medium text-white">
            Compliance Status <span className="text-orange-400">*</span>
          </Label>
          <Select
            value={formData.compliance_status}
            onValueChange={(value) => handleSelectChange("compliance_status", value)}
          >
            <SelectTrigger className={`h-11 bg-white/10 text-white ${
              hasError("compliance_status") ? "border-red-500 focus:border-red-500" : "border-white/20"
            }`}>
              <SelectValue placeholder="Select compliance status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/20">
              <SelectItem value="compliant" className="text-white focus:bg-orange-500/20">
                Compliant
              </SelectItem>
              <SelectItem value="non_compliant" className="text-white focus:bg-orange-500/20">
                Non-Compliant
              </SelectItem>
              <SelectItem value="pending" className="text-white focus:bg-orange-500/20">
                Pending
              </SelectItem>
            </SelectContent>
          </Select>
          {hasError("compliance_status") && (
            <p className="text-sm text-red-400">{errors.compliance_status}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="business_description" className="text-sm font-medium text-white">
            Business Description
          </Label>
          <Textarea
            id="business_description"
            name="business_description"
            placeholder="Describe your business, products, services, and target market..."
            value={formData.business_description}
            onChange={handleChange}
            rows={4}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none"
          />
        </div>
      </div>
    </div>
  )
}

// Step 2: Funding Needs
function FundingNeedsStep({
  formData,
  handleChange,
  handleSelectChange,
  handleBlur,
  errors,
  touched,
}: {
  formData: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSelectChange: (name: string, value: string) => void
  handleBlur: (name: string) => void
  errors: Record<string, string>
  touched: Record<string, boolean>
}) {
  const hasError = (name: string) => touched[name] && errors[name]
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-white/20">
        <DollarSign className="h-5 w-5 text-orange-400" />
        <h3 className="text-xl font-semibold text-white">Funding Needs</h3>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="amount_needed" className="text-sm font-medium text-white">
            Amount Needed (ZAR) <span className="text-orange-400">*</span>
          </Label>
          <Input
            id="amount_needed"
            name="amount_needed"
            type="number"
            placeholder="0.00"
            value={formData.amount_needed}
            onChange={handleChange}
            onBlur={() => handleBlur("amount_needed")}
            required
            className={`h-11 bg-white/10 text-white placeholder:text-white/50 ${
              hasError("amount_needed") ? "border-red-500 focus:border-red-500" : "border-white/20"
            }`}
          />
          {hasError("amount_needed") && (
            <p className="text-sm text-red-400">{errors.amount_needed}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="funding_type" className="text-sm font-medium text-white">
            Funding Type <span className="text-orange-400">*</span>
          </Label>
          <Select
            value={formData.funding_type}
            onValueChange={(value) => handleSelectChange("funding_type", value)}
          >
            <SelectTrigger className={`h-11 bg-white/10 text-white ${
              hasError("funding_type") ? "border-red-500 focus:border-red-500" : "border-white/20"
            }`}>
              <SelectValue placeholder="Select funding type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/20">
              <SelectItem value="grant" className="text-white focus:bg-orange-500/20">Grant</SelectItem>
              <SelectItem value="loan" className="text-white focus:bg-orange-500/20">Loan</SelectItem>
              <SelectItem value="equity" className="text-white focus:bg-orange-500/20">Equity</SelectItem>
              <SelectItem value="mixed" className="text-white focus:bg-orange-500/20">Mixed</SelectItem>
            </SelectContent>
          </Select>
          {hasError("funding_type") && (
            <p className="text-sm text-red-400">{errors.funding_type}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="urgency" className="text-sm font-medium text-white">
            Urgency <span className="text-orange-400">*</span>
          </Label>
          <Select
            value={formData.urgency}
            onValueChange={(value) => handleSelectChange("urgency", value)}
          >
            <SelectTrigger className={`h-11 bg-white/10 text-white ${
              hasError("urgency") ? "border-red-500 focus:border-red-500" : "border-white/20"
            }`}>
              <SelectValue placeholder="Select urgency level" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/20">
              <SelectItem value="low" className="text-white focus:bg-orange-500/20">Low</SelectItem>
              <SelectItem value="medium" className="text-white focus:bg-orange-500/20">Medium</SelectItem>
              <SelectItem value="high" className="text-white focus:bg-orange-500/20">High</SelectItem>
              <SelectItem value="critical" className="text-white focus:bg-orange-500/20">Critical</SelectItem>
            </SelectContent>
          </Select>
          {hasError("urgency") && (
            <p className="text-sm text-red-400">{errors.urgency}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="funding_purpose" className="text-sm font-medium text-white">
            Funding Purpose <span className="text-orange-400">*</span>
          </Label>
          <Select
            value={formData.funding_purpose}
            onValueChange={(value) => handleSelectChange("funding_purpose", value)}
          >
            <SelectTrigger className={`h-11 bg-white/10 text-white ${
              hasError("funding_purpose") ? "border-red-500 focus:border-red-500" : "border-white/20"
            }`}>
              <SelectValue placeholder="Select funding purpose" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/20">
              <SelectItem value="equipment" className="text-white focus:bg-orange-500/20">Equipment</SelectItem>
              <SelectItem value="salary_support" className="text-white focus:bg-orange-500/20">Salary Support</SelectItem>
              <SelectItem value="expansion" className="text-white focus:bg-orange-500/20">Expansion</SelectItem>
              <SelectItem value="working_capital" className="text-white focus:bg-orange-500/20">Working Capital</SelectItem>
              <SelectItem value="marketing" className="text-white focus:bg-orange-500/20">Marketing</SelectItem>
              <SelectItem value="research_development" className="text-white focus:bg-orange-500/20">Research & Development</SelectItem>
              <SelectItem value="other" className="text-white focus:bg-orange-500/20">Other</SelectItem>
            </SelectContent>
          </Select>
          {hasError("funding_purpose") && (
            <p className="text-sm text-red-400">{errors.funding_purpose}</p>
          )}
        </div>
      </div>
    </div>
  )
}

// Step 3: Documents
function DocumentsStep({
  documents,
  handleFileChange,
  errors,
}: {
  documents: Record<string, DocumentFile>
  handleFileChange: (docKey: string, file: File | null) => void
  errors?: Record<string, string>
}) {
  const handleFileInput = (docKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    handleFileChange(docKey, file)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-white/20">
        <Upload className="h-5 w-5 text-orange-400" />
        <h3 className="text-xl font-semibold text-white">Upload Required Documents</h3>
      </div>

      <p className="text-sm text-white/70">
        Please upload the following documents. All documents are required for verification.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(documents).map(([key, doc]) => (
          <div key={key} className="space-y-2">
            <Label className="text-sm font-medium text-white">
              {doc.name} <span className="text-orange-400">*</span>
            </Label>
            <div className="relative">
              <input
                type="file"
                id={key}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => handleFileInput(key, e)}
                className="hidden"
              />
              <label
                htmlFor={key}
                className={`flex items-center gap-3 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors bg-white/5 ${
                  !doc.file && errors?.[key]
                    ? "border-red-500 hover:border-red-400"
                    : "border-white/30 hover:border-orange-400/50"
                }`}
              >
                {doc.file ? (
                  <div className="flex items-center gap-3 flex-1">
                    <File className="h-5 w-5 text-green-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{doc.file.name}</p>
                      <p className="text-xs text-white/60">
                        {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFileChange(key, null)
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 flex-1">
                    <Upload className="h-5 w-5 text-white/50" />
                    <span className="text-sm text-white/70">Click to upload</span>
                  </div>
                )}
              </label>
              {!doc.file && errors?.[key] && (
                <p className="text-sm text-red-400 mt-1">{errors[key]}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Step 4: Additional Information
function AdditionalInfoStep({
  formData,
  handleChange,
  handleSelectChange,
  handleBlur,
  errors,
  touched,
}: {
  formData: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSelectChange: (name: string, value: string) => void
  handleBlur: (name: string) => void
  errors: Record<string, string>
  touched: Record<string, boolean>
}) {
  const hasError = (name: string) => touched[name] && errors[name]
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-white/20">
        <FileText className="h-5 w-5 text-orange-400" />
        <h3 className="text-xl font-semibold text-white">Additional Information</h3>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="revenue_range" className="text-sm font-medium text-white">
            Revenue Range (ZAR) <span className="text-orange-400">*</span>
          </Label>
          <Select
            value={formData.revenue_range}
            onValueChange={(value) => handleSelectChange("revenue_range", value)}
          >
            <SelectTrigger className={`h-11 bg-white/10 text-white ${
              hasError("revenue_range") ? "border-red-500 focus:border-red-500" : "border-white/20"
            }`}>
              <SelectValue placeholder="Select revenue range" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/20">
              <SelectItem value="0-500k" className="text-white focus:bg-orange-500/20">R0 - R500,000</SelectItem>
              <SelectItem value="500k-1m" className="text-white focus:bg-orange-500/20">R500,000 - R1,000,000</SelectItem>
              <SelectItem value="1m-5m" className="text-white focus:bg-orange-500/20">R1,000,000 - R5,000,000</SelectItem>
              <SelectItem value="5m-10m" className="text-white focus:bg-orange-500/20">R5,000,000 - R10,000,000</SelectItem>
              <SelectItem value="10m+" className="text-white focus:bg-orange-500/20">R10,000,000+</SelectItem>
            </SelectContent>
          </Select>
          {hasError("revenue_range") && (
            <p className="text-sm text-red-400">{errors.revenue_range}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="employees_count" className="text-sm font-medium text-white">
            Number of Employees <span className="text-orange-400">*</span>
          </Label>
          <Input
            id="employees_count"
            name="employees_count"
            type="number"
            placeholder="0"
            value={formData.employees_count}
            onChange={handleChange}
            onBlur={() => handleBlur("employees_count")}
            required
            className={`h-11 bg-white/10 text-white placeholder:text-white/50 ${
              hasError("employees_count") ? "border-red-500 focus:border-red-500" : "border-white/20"
            }`}
          />
          {hasError("employees_count") && (
            <p className="text-sm text-red-400">{errors.employees_count}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="financial_health" className="text-sm font-medium text-white">
            Financial Health Indicators <span className="text-orange-400">*</span>
          </Label>
          <Select
            value={formData.financial_health}
            onValueChange={(value) => handleSelectChange("financial_health", value)}
          >
            <SelectTrigger className={`h-11 bg-white/10 text-white ${
              hasError("financial_health") ? "border-red-500 focus:border-red-500" : "border-white/20"
            }`}>
              <SelectValue placeholder="Select financial health status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/20">
              <SelectItem value="excellent" className="text-white focus:bg-orange-500/20">Excellent</SelectItem>
              <SelectItem value="good" className="text-white focus:bg-orange-500/20">Good</SelectItem>
              <SelectItem value="fair" className="text-white focus:bg-orange-500/20">Fair</SelectItem>
              <SelectItem value="poor" className="text-white focus:bg-orange-500/20">Poor</SelectItem>
            </SelectContent>
          </Select>
          {hasError("financial_health") && (
            <p className="text-sm text-red-400">{errors.financial_health}</p>
          )}
        </div>
      </div>
    </div>
  )
}
