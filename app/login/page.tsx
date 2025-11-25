"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let timeoutId: NodeJS.Timeout | null = null

    // Add timeout protection
    const loginPromise = (async () => {
      try {
        console.log('Attempting login for:', email)
        const user = await login(email, password)
        
        console.log('Login successful, user:', user)
        console.log('User role:', user.role)
        console.log('User approved:', user.approved)
        
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        })

        // Wait for session to be stored and give middleware time to process
        console.log('Waiting for session to be ready...')
        await new Promise(resolve => setTimeout(resolve, 800))

        // Redirect based on role and approval status
        // Use window.location.href for full page reload
        // The middleware will read the session from localStorage and set cookies
        if (user.role === "admin") {
          console.log('Redirecting admin to /admin')
          window.location.href = "/admin"
        } else if (!user.approved) {
          console.log('User not approved, redirecting to pending approval')
          window.location.href = "/pending-approval"
        } else {
          console.log('Redirecting user to /dashboard')
          window.location.href = "/dashboard"
        }
      } catch (error) {
        console.error('Login error:', error)
        let errorMessage = "Invalid credentials. Please try again."
        
        if (error instanceof Error) {
          errorMessage = error.message
          
          // Provide more helpful error messages
          if (error.message.includes('Supabase is not configured')) {
            errorMessage = "Configuration error: Supabase environment variables are missing. Please check your .env file."
          } else if (error.message.includes('timed out')) {
            errorMessage = "Connection timeout. Please check your internet connection and try again."
          } else if (error.message.includes('User profile not found')) {
            errorMessage = "User account not found. Please contact support or try registering a new account."
          } else if (error.message.includes('pending admin approval')) {
            errorMessage = "Your account is pending admin approval. You will be notified once approved."
          } else if (error.message.includes('Invalid email or password')) {
            errorMessage = "Invalid email or password. Please check your credentials and try again."
          } else if (error.message.includes('RLS policy')) {
            errorMessage = "Access denied. Please contact support if this issue persists."
          }
        }
        
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        })
        throw error // Re-throw to be caught by timeout handler
      }
    })()

    // Timeout handler
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('Login request timed out. Please check your connection and try again.'))
      }, 30000) // 30 second timeout to match auth service
    })

    try {
      await Promise.race([loginPromise, timeoutPromise])
    } catch (error) {
      // Error already handled in loginPromise catch block
      // This catch is mainly for timeout errors
      if (error instanceof Error && error.message.includes('timed out')) {
        toast({
          title: "Login timeout",
          description: "The login request took too long. Please check your connection and try again.",
          variant: "destructive",
        })
      }
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      setLoading(false) // Always reset loading state
    }
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
