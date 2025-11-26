"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { AuthService } from "@/lib/auth"
import { Loader2, CheckCircle2, ArrowLeft, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await AuthService.resetPassword(email)
      setSuccess(true)
      toast({
        title: "Reset email sent",
        description: "Check your inbox for password reset instructions.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <>
        {/* Background Image - Full Screen (Fixed behind everything) */}
        <div className="fixed inset-0 -z-10">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
            style={{
              backgroundImage: 'url(/shocked.jpg)',
            }}
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        
        {/* Content */}
        <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            {/* Success Card */}
            <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-2xl">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <CheckCircle2 className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="mb-2 text-2xl font-bold text-white">Check Your Email</h2>
                  <p className="mb-6 text-white/90">
                    We've sent password reset instructions to <strong className="text-white">{email}</strong>. Please check your inbox and follow
                    the link to reset your password.
                  </p>
                  <Link href="/login">
                    <Button className="w-full h-11 bg-orange-500 text-white hover:bg-orange-600 transition-colors">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Background Image - Full Screen (Fixed behind everything) */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: 'url(/shocked.jpg)',
          }}
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      
      {/* Content */}
      <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Reset Password Card */}
          <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-2xl">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-bold text-white">Reset Password</CardTitle>
              <CardDescription className="text-base text-white/90">
                Enter your email address and we'll send you instructions to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-white">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="h-11"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-orange-500 text-white hover:bg-orange-600 transition-colors" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Reset Instructions
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center">
                <Link 
                  href="/login" 
                  className="inline-flex items-center text-sm text-white/90 hover:text-white hover:underline transition-colors"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
