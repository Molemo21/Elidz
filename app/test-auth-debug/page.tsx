"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TestAuthDebugPage() {
  const { user, loading, isAdmin, isAuthenticated } = useAuth()
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  useEffect(() => {
    addResult(`Component mounted`)
    addResult(`Loading state: ${loading}`)
    addResult(`User state: ${user ? `${user.email} (${user.role})` : 'null'}`)
    addResult(`Is authenticated: ${isAuthenticated}`)
    addResult(`Is admin: ${isAdmin}`)
  }, [user, loading, isAuthenticated, isAdmin])

  const testSession = async () => {
    addResult('--- Testing Session ---')
    try {
      addResult('Creating Supabase client...')
      const clientStartTime = Date.now()
      const supabase = createClient()
      const clientElapsed = Date.now() - clientStartTime
      addResult(`✓ Client created (${clientElapsed}ms)`)
      
      addResult('Calling getSession()...')
      const sessionStartTime = Date.now()
      
      // Add timeout to session call
      const sessionTimeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          const elapsed = Date.now() - sessionStartTime
          reject(new Error(`getSession() timed out after ${elapsed}ms`))
        }, 10000)
      })
      
      const sessionPromise = supabase.auth.getSession()
      
      try {
        const result = await Promise.race([sessionPromise, sessionTimeoutPromise])
        const elapsed = Date.now() - sessionStartTime
        const { data: { session }, error: sessionError } = result
        
        if (sessionError) {
          addResult(`✗ Session error (${elapsed}ms): ${sessionError.message}`)
        } else if (session) {
          addResult(`✓ Session exists (${elapsed}ms)`)
          addResult(`  User ID: ${session.user.id}`)
          addResult(`  Email: ${session.user.email}`)
          addResult(`  Access token: ${session.access_token ? 'Present' : 'Missing'}`)
          addResult(`  Expires at: ${new Date(session.expires_at! * 1000).toLocaleString()}`)
        } else {
          addResult(`✗ No session found (${elapsed}ms)`)
        }
      } catch (timeoutError: any) {
        const elapsed = Date.now() - sessionStartTime
        addResult(`✗ getSession() TIMED OUT after ${elapsed}ms`)
        addResult(`  This indicates a problem with the Supabase client or localStorage`)
        addResult(`  Possible causes:`)
        addResult(`  1. localStorage is blocked or corrupted`)
        addResult(`  2. Supabase client initialization issue`)
        addResult(`  3. Browser storage quota exceeded`)
      }
    } catch (error: any) {
      addResult(`✗ Session test error: ${error.message}`)
    }
  }

  const testGetUser = async () => {
    addResult('--- Testing getUser() ---')
    try {
      const supabase = createClient()
      
      addResult('Calling getUser()...')
      const startTime = Date.now()
      const { data: { user: authUser }, error } = await supabase.auth.getUser()
      const elapsed = Date.now() - startTime
      
      if (error) {
        addResult(`✗ getUser() error (${elapsed}ms): ${error.message}`)
      } else if (authUser) {
        addResult(`✓ getUser() success (${elapsed}ms)`)
        addResult(`  User ID: ${authUser.id}`)
        addResult(`  Email: ${authUser.email}`)
      } else {
        addResult(`✗ getUser() returned no user`)
      }
    } catch (error: any) {
      addResult(`✗ getUser() test error: ${error.message}`)
    }
  }

  const testProfileQuery = async () => {
    addResult('--- Testing Profile Query ---')
    try {
      const supabase = createClient()
      
      // Get user ID first
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        addResult('✗ No auth user to query profile')
        return
      }
      
      addResult(`Querying profile for user: ${authUser.id}`)
      const startTime = Date.now()
      
      // Create timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Query timed out after 10 seconds'))
        }, 10000)
      })
      
      const queryPromise = supabase
        .from('users')
        .select('id, email, role, first_name, last_name, approved')
        .eq('id', authUser.id)
        .single()
      
      try {
        const result = await Promise.race([queryPromise, timeoutPromise])
        const elapsed = Date.now() - startTime
        
        if (result.error) {
          addResult(`✗ Profile query error (${elapsed}ms): ${result.error.message}`)
          addResult(`  Error code: ${result.error.code || 'N/A'}`)
          addResult(`  Error details: ${JSON.stringify(result.error, null, 2)}`)
        } else if (result.data) {
          addResult(`✓ Profile query success (${elapsed}ms)`)
          addResult(`  Email: ${result.data.email}`)
          addResult(`  Role: ${result.data.role}`)
          addResult(`  Approved: ${result.data.approved}`)
        } else {
          addResult(`✗ Profile query returned no data`)
        }
      } catch (timeoutError: any) {
        const elapsed = Date.now() - startTime
        addResult(`✗ Profile query TIMED OUT after ${elapsed}ms`)
        addResult(`  This indicates an RLS policy issue`)
      }
    } catch (error: any) {
      addResult(`✗ Profile query test error: ${error.message}`)
    }
  }

  const testGetCurrentUser = async () => {
    addResult('--- Testing getCurrentUser() ---')
    try {
      const { AuthService } = await import('@/lib/auth')
      
      addResult('Calling AuthService.getCurrentUser()...')
      addResult('  (This will use localStorage fallback if getSession() times out)')
      const startTime = Date.now()
      const currentUser = await AuthService.getCurrentUser()
      const elapsed = Date.now() - startTime
      
      if (currentUser) {
        addResult(`✓ getCurrentUser() success (${elapsed}ms)`)
        addResult(`  Email: ${currentUser.email}`)
        addResult(`  Role: ${currentUser.role}`)
        addResult(`  Approved: ${currentUser.approved}`)
      } else {
        addResult(`✗ getCurrentUser() returned null (${elapsed}ms)`)
        addResult(`  This likely means profile query timed out or session recovery failed`)
      }
    } catch (error: any) {
      addResult(`✗ getCurrentUser() test error: ${error.message}`)
    }
  }

  const testDirectLocalStorageRead = async () => {
    addResult('--- Testing Direct localStorage Read ---')
    try {
      if (typeof window === 'undefined') {
        addResult('✗ Not in browser environment')
        return
      }
      
      addResult('Reading session directly from localStorage...')
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const projectRef = supabaseUrl.split('//')[1]?.split('.')[0] || ''
      const storageKey = `sb-${projectRef}-auth-token`
      
      addResult(`Looking for key: ${storageKey}`)
      let stored = localStorage.getItem(storageKey)
      
      if (!stored) {
        // Search for any auth-token key
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.includes('auth-token')) {
            stored = localStorage.getItem(key)
            addResult(`Found key: ${key}`)
            break
          }
        }
      }
      
      if (stored) {
        addResult(`✓ Found session data (${stored.length} chars)`)
        try {
          const parsed = JSON.parse(stored)
          addResult(`  Access token: ${parsed.access_token ? 'Present' : 'Missing'}`)
          addResult(`  Refresh token: ${parsed.refresh_token ? 'Present' : 'Missing'}`)
          addResult(`  User ID: ${parsed.user?.id || 'Missing'}`)
          addResult(`  User Email: ${parsed.user?.email || 'Missing'}`)
          addResult(`  Expires at: ${parsed.expires_at ? new Date(parsed.expires_at * 1000).toLocaleString() : 'Missing'}`)
          
          // Check if token is expired
          if (parsed.expires_at) {
            const expiresAt = new Date(parsed.expires_at * 1000)
            const now = new Date()
            if (expiresAt < now) {
              addResult(`  ⚠ Token is EXPIRED (expired ${Math.floor((now.getTime() - expiresAt.getTime()) / 1000)}s ago)`)
              addResult(`  This might cause getSession() to hang while trying to refresh`)
            } else {
              addResult(`  ✓ Token is valid (expires in ${Math.floor((expiresAt.getTime() - now.getTime()) / 1000)}s)`)
            }
          }
        } catch (parseError: any) {
          addResult(`✗ Failed to parse session data: ${parseError.message}`)
        }
      } else {
        addResult('✗ No session data found in localStorage')
      }
    } catch (error: any) {
      addResult(`✗ Direct localStorage read error: ${error.message}`)
    }
  }

  const testLocalStorage = async () => {
    addResult('--- Testing localStorage ---')
    try {
      if (typeof window === 'undefined') {
        addResult('✗ Not in browser environment')
        return
      }
      
      addResult('Checking localStorage availability...')
      const testKey = '__supabase_test__'
      const testValue = 'test'
      
      try {
        localStorage.setItem(testKey, testValue)
        const retrieved = localStorage.getItem(testKey)
        localStorage.removeItem(testKey)
        
        if (retrieved === testValue) {
          addResult('✓ localStorage is working')
        } else {
          addResult('✗ localStorage read/write failed')
        }
      } catch (storageError: any) {
        addResult(`✗ localStorage error: ${storageError.message}`)
        addResult('  Possible causes:')
        addResult('  - localStorage is disabled')
        addResult('  - Storage quota exceeded')
        addResult('  - Privacy mode (incognito) restrictions')
      }
      
      // Check for Supabase session in localStorage
      addResult('Checking for Supabase session in localStorage...')
      const supabaseKeys = Object.keys(localStorage).filter(key => 
        key.includes('supabase') || key.includes('sb-')
      )
      
      if (supabaseKeys.length > 0) {
        addResult(`✓ Found ${supabaseKeys.length} Supabase keys in localStorage:`)
        supabaseKeys.forEach(key => {
          const value = localStorage.getItem(key)
          addResult(`  - ${key}: ${value ? `${value.length} chars` : 'empty'}`)
        })
      } else {
        addResult('✗ No Supabase keys found in localStorage')
      }
    } catch (error: any) {
      addResult(`✗ localStorage test error: ${error.message}`)
    }
  }

  const runAllTests = async () => {
    setTestResults([])
    addResult('=== Starting Auth Debug Tests ===')
    await testLocalStorage()
    await new Promise(resolve => setTimeout(resolve, 500))
    await testDirectLocalStorageRead()
    await new Promise(resolve => setTimeout(resolve, 500))
    await testSession()
    await new Promise(resolve => setTimeout(resolve, 500))
    await testGetUser()
    await new Promise(resolve => setTimeout(resolve, 500))
    await testProfileQuery()
    await new Promise(resolve => setTimeout(resolve, 500))
    await testGetCurrentUser()
    addResult('=== Tests Complete ===')
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Auth Debug Diagnostic Tool</CardTitle>
          <CardDescription>
            This tool helps identify exactly where the authentication flow is failing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current State */}
          <div className="space-y-2">
            <h3 className="font-semibold">Current Auth State</h3>
            <div className="bg-muted p-4 rounded-lg space-y-1 text-sm">
              <div><strong>Loading:</strong> {loading ? 'true' : 'false'}</div>
              <div><strong>User:</strong> {user ? `${user.email} (${user.role})` : 'null'}</div>
              <div><strong>Is Authenticated:</strong> {isAuthenticated ? 'true' : 'false'}</div>
              <div><strong>Is Admin:</strong> {isAdmin ? 'true' : 'false'}</div>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="space-y-2">
            <h3 className="font-semibold">Run Tests</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={testLocalStorage} variant="outline">Test localStorage</Button>
              <Button onClick={testDirectLocalStorageRead} variant="outline">Read Session from localStorage</Button>
              <Button onClick={testSession} variant="outline">Test Session</Button>
              <Button onClick={testGetUser} variant="outline">Test getUser()</Button>
              <Button onClick={testProfileQuery} variant="outline">Test Profile Query</Button>
              <Button onClick={testGetCurrentUser} variant="outline">Test getCurrentUser()</Button>
              <Button onClick={runAllTests} className="bg-primary">Run All Tests</Button>
            </div>
          </div>

          {/* Test Results */}
          <div className="space-y-2">
            <h3 className="font-semibold">Test Results</h3>
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-xs max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <div className="text-muted-foreground">No tests run yet. Click a test button above.</div>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="mb-1">{result}</div>
                ))
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <h3 className="font-semibold">Instructions</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Click "Run All Tests" to execute all diagnostic tests</li>
              <li>Check the results to see where the flow is failing</li>
              <li>If profile query times out, it indicates an RLS policy issue</li>
              <li>Share the test results to help identify the exact problem</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

