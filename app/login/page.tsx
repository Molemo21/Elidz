"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      // User is already logged in, redirect to appropriate page
      if (user.role === "admin") {
        router.replace("/admin")
      } else if (!user.approved) {
        router.replace("/pending-approval")
      } else {
        router.replace("/dashboard")
      }
    }
  }, [user, authLoading, router])

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

        // Sync session to cookies immediately after login
        // This ensures server-side can read the session
        console.log('Syncing session to cookies...')
        try {
          if (typeof window !== 'undefined') {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
            const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || ''
            const storageKey = `sb-${projectRef}-auth-token`
            const stored = localStorage.getItem(storageKey)
            
            if (stored) {
              try {
                const parsed = JSON.parse(stored)
                if (parsed.access_token && parsed.refresh_token) {
                  // Sync to cookies via API route (more reliable than server action)
                  const syncResponse = await fetch('/api/auth/sync-cookies', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      accessToken: parsed.access_token,
                      refreshToken: parsed.refresh_token,
                    }),
                  })

                  const result = await syncResponse.json()
                  if (result.success) {
                    console.log('✓ Session synced to cookies successfully')
                  } else {
                    console.warn('⚠ Failed to sync session to cookies:', result.error)
                  }
                }
              } catch (e) {
                console.warn('Failed to parse session for cookie sync:', e)
              }
            } else {
              console.warn('⚠ Session not found in localStorage for cookie sync')
            }
          }
        } catch (syncError) {
          console.error('Error syncing session to cookies:', syncError)
          // Continue anyway - middleware might still work
        }

        // Small delay to ensure cookies are set before redirect
        await new Promise(resolve => setTimeout(resolve, 500))

        // Redirect based on role and approval status
        // Use window.location.href for full page reload to ensure middleware reads cookies
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

  // Show loading while checking auth state
  if (authLoading) {
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
  if (user) {
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
        <div className="w-full max-w-md space-y-8">
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

        {/* Login Card */}
        <Card className="border-white/20 bg-white/10 backdrop-blur-lg shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-base text-white/90">
              Sign in to your account to continue
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

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-white">
                    Password
                  </Label>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-white/90 hover:text-white hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-orange-500 text-white hover:bg-orange-600 transition-colors" 
                disabled={loading}
              >
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

            <div className="text-center">
              <p className="text-sm text-white/80">
                Don't have an account?{" "}
                <Link 
                  href="/register" 
                  className="font-medium text-white hover:text-orange-400 hover:underline transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </>
  )
}
