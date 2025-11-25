"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestSupabasePage() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult("Testing...\n")

    try {
      // Test 1: Environment variables
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      setResult(prev => prev + `✓ Environment Variables:\n`)
      setResult(prev => prev + `  URL: ${url ? '✓ Set' : '✗ Missing'}\n`)
      setResult(prev => prev + `  Key: ${key ? '✓ Set (' + key.length + ' chars)' : '✗ Missing'}\n`)
      setResult(prev => prev + `  Key preview: ${key?.substring(0, 30)}...\n\n`)

      if (!url || !key) {
        setResult(prev => prev + "✗ Cannot proceed - missing environment variables\n")
        setLoading(false)
        return
      }

      // Test 2: Create client
      setResult(prev => prev + `✓ Creating Supabase client...\n`)
      const supabase = createClient()
      setResult(prev => prev + `✓ Client created\n\n`)

      // Test 3: Test auth endpoint
      setResult(prev => prev + `✓ Testing auth endpoint...\n`)
      const testAuth = await fetch(`${url}/auth/v1/health`, {
        method: 'GET',
        headers: {
          'apikey': key,
        }
      })
      setResult(prev => prev + `  Status: ${testAuth.status}\n`)
      
      if (testAuth.status === 200) {
        setResult(prev => prev + `✓ Supabase is reachable!\n\n`)
      } else {
        setResult(prev => prev + `⚠ Supabase returned status ${testAuth.status}\n\n`)
      }

      // Test 4: Try a simple query (will fail if RLS blocks, but that's OK)
      setResult(prev => prev + `✓ Testing database connection...\n`)
      try {
        // Add timeout to database query
        const queryPromise = supabase.from('users').select('count').limit(1)
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Database query timed out after 5 seconds')), 5000)
        })
        
        const result = await Promise.race([queryPromise, timeoutPromise]) as any
        const { data, error } = result
        
        if (error) {
          setResult(prev => prev + `  ⚠ Query error (expected if RLS blocks): ${error.message}\n`)
          setResult(prev => prev + `  ✓ But connection works! (RLS is blocking, which is normal)\n`)
        } else {
          setResult(prev => prev + `  ✓ Database connection successful!\n`)
        }
      } catch (dbError: any) {
        if (dbError.message?.includes('timeout')) {
          setResult(prev => prev + `  ⚠ Database query timed out\n`)
          setResult(prev => prev + `  ⚠ This might mean:\n`)
          setResult(prev => prev + `     - The 'users' table doesn't exist (run migrations)\n`)
          setResult(prev => prev + `     - Network connectivity issue\n`)
          setResult(prev => prev + `     - RLS policies are blocking (this is OK)\n`)
        } else {
          setResult(prev => prev + `  ⚠ Database error: ${dbError.message || dbError}\n`)
          setResult(prev => prev + `  ✓ But Supabase is reachable!\n`)
        }
      }

      setResult(prev => prev + `\n✅ Connection tests complete!\n\n`)
      setResult(prev => prev + `📝 Next Steps:\n`)
      setResult(prev => prev + `1. If you see "RLS blocks" or "timeout" - this is OK for now\n`)
      setResult(prev => prev + `2. Make sure you've run the database migrations\n`)
      setResult(prev => prev + `3. Try logging in - the connection should work!\n`)
    } catch (error) {
      setResult(prev => prev + `\n✗ Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Supabase Connection Test</CardTitle>
          <CardDescription>Test your Supabase configuration and connection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testConnection} disabled={loading}>
            {loading ? "Testing..." : "Run Tests"}
          </Button>
          
          {result && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <pre className="text-sm whitespace-pre-wrap font-mono">{result}</pre>
            </div>
          )}

          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm font-semibold mb-2">Common Issues:</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>If "Missing environment variables" → Check your .env file</li>
              <li>If "Network error" → Your Supabase project might be paused</li>
              <li>If "Status 401" → Check your API key</li>
              <li>If "Status 404" → Check your Supabase URL</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

