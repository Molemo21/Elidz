"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { isProfileComplete } from "@/app/actions/user-profiles"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    const checkAndRedirect = async () => {
      if (status === "loading" || loading || isRedirecting) return

      if (session?.user) {
        const user = session.user
        setIsRedirecting(true)

        // Check profile completion for non-admin users
        if (user.role !== "admin") {
          try {
            const profileComplete = await isProfileComplete()
            if (!profileComplete) {
              router.push("/onboarding")
              return
            }
          } catch (error) {
            console.error("Error checking profile completion:", error)
            router.push("/onboarding")
            return
          }
        }

        // Redirect based on role and approval status
        if (user.role === "admin") {
          router.push("/admin")
        } else if (!user.approved) {
          router.push("/pending-approval")
        } else {
          router.push("/dashboard")
        }
      }
    }

    checkAndRedirect()
  }, [session, status, loading, isRedirecting, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        let errorMessage = "Invalid email or password. Please try again."
        
        if (result.error.includes("needs to set a password") || result.error.includes("password hash")) {
          errorMessage = "This account needs to set a password. Please use the 'Forgot Password' link below to set your password."
        } else if (result.error.includes("Invalid")) {
          errorMessage = result.error
        }

        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        })
        return
      }

      if (!result?.ok) {
        toast({
          title: "Login failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Login successful - session will be updated automatically by NextAuth
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      })

      // Wait a moment for session to update
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Refresh to get updated session
      router.refresh()
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Show loading while checking auth state
  if (status === "loading") {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mb-4 h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't show login form if user is already logged in (redirecting)
  if (session?.user || isRedirecting) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mb-4 h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-accent/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Demo Credentials</span>
              </div>
            </div>

            <div className="space-y-2 rounded-lg bg-muted/50 p-4 text-xs">
              <p className="font-medium text-foreground">SMME User:</p>
              <p className="text-muted-foreground">Email: user@smme.com</p>
              <p className="text-muted-foreground">Password: demo123</p>

              <p className="mt-3 font-medium text-foreground">Admin:</p>
              <p className="text-muted-foreground">Email: admin@elidz.com</p>
              <p className="text-muted-foreground">Password: demo123</p>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
