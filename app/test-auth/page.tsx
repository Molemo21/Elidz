"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export default function TestAuthPage() {
  const [email, setEmail] = useState("admin@elidz.com")
  const [password, setPassword] = useState("")
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testAuth = async () => {
    setLoading(true)
    setResult("Testing...\n")
    
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        setResult("❌ Missing environment variables")
        setLoading(false)
        return
      }
      
      setResult(prev => prev + `✓ Environment variables found\n`)
      setResult(prev => prev + `URL: ${supabaseUrl}\n`)
      setResult(prev => prev + `Key length: ${supabaseKey.length}\n\n`)
      
      // Test 1: Direct fetch to auth endpoint
      setResult(prev => prev + "Test 1: Direct fetch to auth endpoint...\n")
      try {
        const startTime = Date.now()
        const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })
        const elapsed = Date.now() - startTime
        
        setResult(prev => prev + `  Status: ${response.status}\n`)
        setResult(prev => prev + `  Time: ${elapsed}ms\n`)
        
        const data = await response.json().catch(() => ({}))
        if (response.ok) {
          setResult(prev => prev + `  ✓ Direct fetch successful!\n`)
          setResult(prev => prev + `  User ID: ${data.user?.id || 'N/A'}\n\n`)
        } else {
          setResult(prev => prev + `  ✗ Direct fetch failed: ${data.error || data.error_description || 'Unknown error'}\n\n`)
        }
      } catch (error: any) {
        setResult(prev => prev + `  ✗ Direct fetch error: ${error.message}\n\n`)
      }
      
      // Test 2: Supabase client
      setResult(prev => prev + "Test 2: Supabase JS client...\n")
      try {
        const client = createSupabaseClient(supabaseUrl, supabaseKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        })
        
        const startTime = Date.now()
        const { data, error } = await client.auth.signInWithPassword({
          email,
          password,
        })
        const elapsed = Date.now() - startTime
        
        setResult(prev => prev + `  Time: ${elapsed}ms\n`)
        
        if (error) {
          setResult(prev => prev + `  ✗ Client auth failed: ${error.message}\n`)
        } else if (data.user) {
          setResult(prev => prev + `  ✓ Client auth successful!\n`)
          setResult(prev => prev + `  User ID: ${data.user.id}\n`)
          setResult(prev => prev + `  Email: ${data.user.email}\n`)
        } else {
          setResult(prev => prev + `  ✗ No user data returned\n`)
        }
      } catch (error: any) {
        setResult(prev => prev + `  ✗ Client auth error: ${error.message}\n`)
      }
      
    } catch (error: any) {
      setResult(prev => prev + `\n❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Auth Diagnostic Test</CardTitle>
          <CardDescription>
            Test Supabase authentication to identify timeout issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@elidz.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <Button onClick={testAuth} disabled={loading || !email || !password}>
            {loading ? "Testing..." : "Run Auth Test"}
          </Button>
          {result && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <pre className="text-sm whitespace-pre-wrap font-mono">{result}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

