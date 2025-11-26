"use client"

import type React from "react"

import { useState } from "react"
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
import { Loader2, Building2, TrendingUp, MapPin, DollarSign, Target, Briefcase } from "lucide-react"

export default function OnboardingPage() {
  const [formData, setFormData] = useState({
    // Business Information
    company_name: "",
    registration_number: "",
    industry: "",
    business_description: "",
    location: "",
    
    // Business Metrics
    annual_revenue: "",
    employees_count: "",
    years_in_business: "",
    
    // Funding Requirements
    amount_needed: "",
    funding_purpose: "",
    business_stage: "" as "startup" | "growth" | "expansion" | "mature" | "",
    preferred_funding_type: [] as string[],
  })

  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFundingTypeChange = (type: string) => {
    setFormData((prev) => {
      const currentTypes = prev.preferred_funding_type
      const isSelected = currentTypes.includes(type)
      
      return {
        ...prev,
        preferred_funding_type: isSelected
          ? currentTypes.filter((t) => t !== type)
          : [...currentTypes, type],
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.company_name || !formData.industry || !formData.business_description) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required business information.",
        variant: "destructive",
      })
      return
    }

    if (!formData.amount_needed || !formData.funding_purpose || !formData.business_stage) {
      toast({
        title: "Missing funding information",
        description: "Please fill in all funding requirements.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // TODO: Save to backend - user_profiles table
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

  const fundingTypes = [
    "Grant",
    "Loan",
    "Equity Investment",
    "Crowdfunding",
    "Government Funding",
    "Private Investor",
    "Venture Capital",
  ]

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
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-bold text-white">Complete Your Business Profile</CardTitle>
              <CardDescription className="text-base text-white/90">
                Help us understand your business better to match you with the perfect funding opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Business Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/20">
                    <Building2 className="h-5 w-5 text-orange-400" />
                    <h3 className="text-xl font-semibold text-white">Business Information</h3>
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
                        required
                        disabled={loading}
                        className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registration_number" className="text-sm font-medium text-white">
                        Registration Number
                      </Label>
                      <Input
                        id="registration_number"
                        name="registration_number"
                        placeholder="2023/123456/07"
                        value={formData.registration_number}
                        onChange={handleChange}
                        disabled={loading}
                        className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
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
                        required
                        disabled={loading}
                        className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="location" className="text-sm font-medium text-white">
                        Business Location <span className="text-orange-400">*</span>
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="City, Province, South Africa"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="business_description" className="text-sm font-medium text-white">
                        Business Description <span className="text-orange-400">*</span>
                      </Label>
                      <Textarea
                        id="business_description"
                        name="business_description"
                        placeholder="Describe your business, products, services, and target market..."
                        value={formData.business_description}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        rows={4}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Metrics Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/20">
                    <TrendingUp className="h-5 w-5 text-orange-400" />
                    <h3 className="text-xl font-semibold text-white">Business Metrics</h3>
                  </div>

                  <div className="grid gap-5 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="annual_revenue" className="text-sm font-medium text-white">
                        Annual Revenue (ZAR)
                      </Label>
                      <Input
                        id="annual_revenue"
                        name="annual_revenue"
                        type="number"
                        placeholder="0.00"
                        value={formData.annual_revenue}
                        onChange={handleChange}
                        disabled={loading}
                        className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employees_count" className="text-sm font-medium text-white">
                        Number of Employees
                      </Label>
                      <Input
                        id="employees_count"
                        name="employees_count"
                        type="number"
                        placeholder="0"
                        value={formData.employees_count}
                        onChange={handleChange}
                        disabled={loading}
                        className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="years_in_business" className="text-sm font-medium text-white">
                        Years in Business
                      </Label>
                      <Input
                        id="years_in_business"
                        name="years_in_business"
                        type="number"
                        placeholder="0"
                        value={formData.years_in_business}
                        onChange={handleChange}
                        disabled={loading}
                        className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Funding Requirements Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/20">
                    <Target className="h-5 w-5 text-orange-400" />
                    <h3 className="text-xl font-semibold text-white">Funding Requirements</h3>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="amount_needed" className="text-sm font-medium text-white">
                        Funding Amount Needed (ZAR) <span className="text-orange-400">*</span>
                      </Label>
                      <Input
                        id="amount_needed"
                        name="amount_needed"
                        type="number"
                        placeholder="0.00"
                        value={formData.amount_needed}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business_stage" className="text-sm font-medium text-white">
                        Business Stage <span className="text-orange-400">*</span>
                      </Label>
                      <Select
                        value={formData.business_stage}
                        onValueChange={(value) => handleSelectChange("business_stage", value)}
                        disabled={loading}
                      >
                        <SelectTrigger className="h-11 bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select business stage" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-white/20">
                          <SelectItem value="startup" className="text-white focus:bg-orange-500/20">
                            Startup
                          </SelectItem>
                          <SelectItem value="growth" className="text-white focus:bg-orange-500/20">
                            Growth
                          </SelectItem>
                          <SelectItem value="expansion" className="text-white focus:bg-orange-500/20">
                            Expansion
                          </SelectItem>
                          <SelectItem value="mature" className="text-white focus:bg-orange-500/20">
                            Mature
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="funding_purpose" className="text-sm font-medium text-white">
                        Funding Purpose <span className="text-orange-400">*</span>
                      </Label>
                      <Textarea
                        id="funding_purpose"
                        name="funding_purpose"
                        placeholder="Explain what you need the funding for (e.g., expansion, equipment, working capital, etc.)..."
                        value={formData.funding_purpose}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        rows={3}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none"
                      />
                    </div>

                    <div className="space-y-3 md:col-span-2">
                      <Label className="text-sm font-medium text-white">
                        Preferred Funding Types
                      </Label>
                      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {fundingTypes.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => handleFundingTypeChange(type)}
                            disabled={loading}
                            className={`
                              flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition-all
                              ${formData.preferred_funding_type.includes(type)
                                ? "bg-orange-500/20 border-orange-400 text-white"
                                : "bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
                              }
                            `}
                          >
                            <Briefcase className="h-4 w-4" />
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 h-11 bg-orange-500 text-white hover:bg-orange-600 transition-colors" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Complete Onboarding
                        <DollarSign className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                    disabled={loading}
                    className="sm:flex-initial h-11 border-white/20 bg-white/5 text-white hover:bg-white/10"
                  >
                    Skip for Now
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

