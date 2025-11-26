"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Building, Upload, CheckCircle2 } from "lucide-react"
import { upsertUserProfile, getUserProfile } from "@/app/actions/user-profiles"

export default function BusinessProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [saved, setSaved] = useState(false)

  const [formData, setFormData] = useState({
    companyName: "",
    registrationNumber: "",
    industry: "",
    businessDescription: "",
    annualRevenue: "",
    employeesCount: "",
    yearsInBusiness: "",
    location: "",
    fundingAmountNeeded: "",
    fundingPurpose: "",
    businessStage: "growth",
    preferredFundingTypes: [] as string[],
  })

  // Load existing profile data when component mounts
  useEffect(() => {
    let isMounted = true
    
    const loadProfile = async () => {
      if (!user || authLoading) {
        if (isMounted) {
          setLoadingProfile(false)
        }
        return
      }

      try {
        // Don't sync cookies - NextAuth handles this automatically
        const result = await getUserProfile()
        if (!isMounted) return
        
        if (result.success && result.data) {
          const profile = result.data
          setFormData({
            companyName: profile.company_name || "",
            registrationNumber: profile.registration_number || "",
            industry: profile.industry || "",
            businessDescription: profile.business_description || "",
            annualRevenue: profile.annual_revenue?.toString() || "",
            employeesCount: profile.employees_count?.toString() || "",
            yearsInBusiness: profile.years_in_business?.toString() || "",
            location: profile.location || "",
            fundingAmountNeeded: (profile.funding_requirements as any)?.amount_needed?.toString() || "",
            fundingPurpose: (profile.funding_requirements as any)?.funding_purpose || "",
            businessStage: (profile.funding_requirements as any)?.business_stage || "growth",
            preferredFundingTypes: (profile.funding_requirements as any)?.preferred_funding_type || [],
          })
        }
      } catch (error) {
        console.error("Error loading profile:", error)
        // Don't show error to user - just proceed with empty form
      } finally {
        if (isMounted) {
          setLoadingProfile(false)
        }
      }
    }

    loadProfile()
    
    return () => {
      isMounted = false
    }
  }, [user?.id, authLoading]) // Use user?.id instead of entire user object

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  if (authLoading || !user || loadingProfile) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required numeric fields
      const annualRevenue = parseFloat(formData.annualRevenue)
      const employeesCount = parseInt(formData.employeesCount)
      const yearsInBusiness = parseInt(formData.yearsInBusiness)
      const fundingAmountNeeded = parseFloat(formData.fundingAmountNeeded)

      if (isNaN(annualRevenue) || annualRevenue < 0) {
        toast({
          title: "Validation error",
          description: "Please enter a valid annual revenue amount.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      if (isNaN(employeesCount) || employeesCount < 0) {
        toast({
          title: "Validation error",
          description: "Please enter a valid number of employees.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      if (isNaN(yearsInBusiness) || yearsInBusiness < 0) {
        toast({
          title: "Validation error",
          description: "Please enter a valid number of years in business.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      if (isNaN(fundingAmountNeeded) || fundingAmountNeeded < 0) {
        toast({
          title: "Validation error",
          description: "Please enter a valid funding amount.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Transform form data to match database schema
      const profileData = {
        company_name: formData.companyName.trim(),
        registration_number: formData.registrationNumber.trim(),
        industry: formData.industry,
        business_description: formData.businessDescription.trim(),
        annual_revenue: annualRevenue,
        employees_count: employeesCount,
        years_in_business: yearsInBusiness,
        location: formData.location.trim(),
        funding_requirements: {
          amount_needed: fundingAmountNeeded,
          funding_purpose: formData.fundingPurpose.trim(),
          business_stage: formData.businessStage as "startup" | "growth" | "expansion" | "mature",
          industry_sector: formData.industry ? [formData.industry] : [], // Use industry as sector
          preferred_funding_type: formData.preferredFundingTypes.length > 0 
            ? formData.preferredFundingTypes 
            : ["Grant", "Loan"], // Default if empty
        },
      }

      // Sync session to cookies before calling server action
      // This ensures the server can read the session
      const sessionSynced = await syncSessionToCookies()
      if (!sessionSynced) {
        console.warn('Failed to sync session to cookies, but proceeding anyway')
      }

      // Call server action to save profile
      const result = await upsertUserProfile(profileData)

      if (!result.success) {
        // If authentication error, try syncing again and retry once
        if (result.error?.includes('Authentication required')) {
          console.log('Authentication error detected, attempting to sync session and retry...')
          
          // Try syncing again
          const retrySync = await syncSessionToCookies()
          if (retrySync) {
            // Retry the server action once
            const retryResult = await upsertUserProfile(profileData)
            if (retryResult.success) {
              // Success on retry, continue with normal flow
              setSaved(true)
              
              if (user.approved) {
                toast({
                  title: "Profile saved!",
                  description: "Your business profile has been updated. AI is now finding matches...",
                })
                setTimeout(() => {
                  router.push("/dashboard")
                }, 2000)
              } else {
                toast({
                  title: "Profile complete!",
                  description: "Your business profile has been submitted for admin review. You'll be notified once approved.",
                })
                setTimeout(() => {
                  router.push("/pending-approval")
                }, 2000)
              }
              return
            }
          }
          
          // If retry failed, show error and redirect
          toast({
            title: "Session expired",
            description: "Please log in again to continue.",
            variant: "destructive",
          })
          setTimeout(() => {
            router.push("/login")
          }, 1500)
          return
        }
        throw new Error(result.error || "Failed to save profile")
      }

      setSaved(true)
      
      // Determine redirect based on approval status
      if (user.approved) {
        toast({
          title: "Profile saved!",
          description: "Your business profile has been updated. AI is now finding matches...",
        })
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        toast({
          title: "Profile complete!",
          description: "Your business profile has been submitted for admin review. You'll be notified once approved.",
        })
        setTimeout(() => {
          router.push("/pending-approval")
        }, 2000)
      }
    } catch (error: any) {
      console.error("Error saving profile:", error)
      toast({
        title: "Save failed",
        description: error.message || "Failed to save profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (saved) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-accent/30">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">Profile Complete!</h2>
            <p className="text-muted-foreground mb-4">
              Our AI is analyzing your profile and finding the best funding matches for you.
            </p>
            <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="bg-accent/30 min-h-[calc(100vh-80px)]">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground flex items-center gap-3">
            <Building className="h-8 w-8 text-primary" />
            Business Profile
          </h1>
          <p className="text-muted-foreground">Tell us about your business to get personalized funding matches</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Basic details about your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleChange("companyName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number *</Label>
                  <Input
                    id="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={(e) => handleChange("registrationNumber", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select value={formData.industry} onValueChange={(value) => handleChange("industry", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Agriculture">Agriculture</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Energy">Energy & Renewables</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    placeholder="e.g., East London, Eastern Cape"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessDescription">Business Description *</Label>
                <Textarea
                  id="businessDescription"
                  placeholder="Describe what your business does, your products/services, and your target market..."
                  rows={4}
                  value={formData.businessDescription}
                  onChange={(e) => handleChange("businessDescription", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Business Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Business Metrics</CardTitle>
              <CardDescription>Financial and operational details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="annualRevenue">Annual Revenue (ZAR) *</Label>
                  <Input
                    id="annualRevenue"
                    type="number"
                    placeholder="1000000"
                    value={formData.annualRevenue}
                    onChange={(e) => handleChange("annualRevenue", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeesCount">Number of Employees *</Label>
                  <Input
                    id="employeesCount"
                    type="number"
                    placeholder="25"
                    value={formData.employeesCount}
                    onChange={(e) => handleChange("employeesCount", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsInBusiness">Years in Business *</Label>
                  <Input
                    id="yearsInBusiness"
                    type="number"
                    placeholder="5"
                    value={formData.yearsInBusiness}
                    onChange={(e) => handleChange("yearsInBusiness", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessStage">Business Stage *</Label>
                <Select value={formData.businessStage} onValueChange={(value) => handleChange("businessStage", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup (0-2 years)</SelectItem>
                    <SelectItem value="growth">Growth (2-5 years)</SelectItem>
                    <SelectItem value="expansion">Expansion (5+ years)</SelectItem>
                    <SelectItem value="mature">Mature/Established</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Funding Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Funding Requirements</CardTitle>
              <CardDescription>What funding are you looking for?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fundingAmountNeeded">Funding Amount Needed (ZAR) *</Label>
                <Input
                  id="fundingAmountNeeded"
                  type="number"
                  placeholder="500000"
                  value={formData.fundingAmountNeeded}
                  onChange={(e) => handleChange("fundingAmountNeeded", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fundingPurpose">Purpose of Funding *</Label>
                <Textarea
                  id="fundingPurpose"
                  placeholder="Explain how you plan to use the funding..."
                  rows={3}
                  value={formData.fundingPurpose}
                  onChange={(e) => handleChange("fundingPurpose", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Supporting Documents</CardTitle>
              <CardDescription>Upload documents for faster application processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Business Registration</Label>
                  <Button variant="outline" className="w-full gap-2 bg-transparent" type="button">
                    <Upload className="h-4 w-4" />
                    Upload Document
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Financial Statements</Label>
                  <Button variant="outline" className="w-full gap-2 bg-transparent" type="button">
                    <Upload className="h-4 w-4" />
                    Upload Document
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Documents are optional but will speed up your applications
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[150px]">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save & Find Matches"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
