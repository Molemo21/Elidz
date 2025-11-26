"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  getUserProfile, 
  upsertUserProfile,
  createUserProfile,
  updateUserProfile 
} from "@/app/actions/user-profiles"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

interface TestResult {
  test: string
  passed: boolean
  message: string
  data?: any
  timestamp: string
}

export default function TestUserProfilesPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])

  const addResult = (test: string, passed: boolean, message: string, data?: any) => {
    setResults(prev => [...prev, {
      test,
      passed,
      message,
      data,
      timestamp: new Date().toISOString()
    }])
  }

  const clearResults = () => {
    setResults([])
  }

  const testGetUserProfile = async () => {
    setLoading(true)
    addResult("Get Profile", true, "Testing...", null)
    
    try {
      const result = await getUserProfile()
      
      if (result.success) {
        addResult(
          "Get Profile",
          true,
          result.data ? "✓ Profile exists in database" : "✓ No profile found (this is OK if you haven't created one yet)",
          result.data
        )
      } else {
        addResult("Get Profile", false, `✗ Error: ${result.error}`, null)
      }
    } catch (error: any) {
      addResult("Get Profile", false, `✗ Exception: ${error.message}`, null)
    } finally {
      setLoading(false)
    }
  }

  const testCreateProfile = async () => {
    setLoading(true)
    addResult("Create Profile", true, "Testing...", null)
    
    try {
      const testData = {
        company_name: `Test Company ${Date.now()}`,
        registration_number: `TEST-${Date.now()}`,
        industry: "Technology",
        business_description: "This is a test company created by the test script",
        annual_revenue: 1000000,
        employees_count: 10,
        years_in_business: 2,
        location: "Test Location",
        funding_requirements: {
          amount_needed: 500000,
          funding_purpose: "Test funding purpose",
          business_stage: "growth" as const,
          industry_sector: ["Technology"],
          preferred_funding_type: ["Grant"]
        }
      }

      const result = await createUserProfile(testData)
      
      if (result.success) {
        addResult("Create Profile", true, "✓ Profile created successfully!", result.data)
      } else {
        addResult("Create Profile", false, `✗ Error: ${result.error}`, null)
      }
    } catch (error: any) {
      addResult("Create Profile", false, `✗ Exception: ${error.message}`, null)
    } finally {
      setLoading(false)
    }
  }

  const testUpdateProfile = async () => {
    setLoading(true)
    addResult("Update Profile", true, "Testing...", null)
    
    try {
      const updateData = {
        company_name: `Updated Test Company ${Date.now()}`,
        business_description: "This profile was updated by the test script"
      }

      const result = await updateUserProfile(updateData)
      
      if (result.success) {
        addResult("Update Profile", true, "✓ Profile updated successfully!", result.data)
      } else {
        addResult("Update Profile", false, `✗ Error: ${result.error}`, null)
      }
    } catch (error: any) {
      addResult("Update Profile", false, `✗ Exception: ${error.message}`, null)
    } finally {
      setLoading(false)
    }
  }

  const testUpsertProfile = async () => {
    setLoading(true)
    addResult("Upsert Profile", true, "Testing...", null)
    
    try {
      const testData = {
        company_name: `Upsert Test Company ${Date.now()}`,
        registration_number: `UPSERT-${Date.now()}`,
        industry: "Manufacturing",
        business_description: "This profile was created/updated using upsert",
        annual_revenue: 2000000,
        employees_count: 25,
        years_in_business: 3,
        location: "Upsert Test Location",
        funding_requirements: {
          amount_needed: 750000,
          funding_purpose: "Upsert test funding purpose",
          business_stage: "expansion" as const,
          industry_sector: ["Manufacturing"],
          preferred_funding_type: ["Loan", "Grant"]
        }
      }

      const result = await upsertUserProfile(testData)
      
      if (result.success) {
        addResult("Upsert Profile", true, "✓ Profile upserted successfully!", result.data)
      } else {
        addResult("Upsert Profile", false, `✗ Error: ${result.error}`, null)
      }
    } catch (error: any) {
      addResult("Upsert Profile", false, `✗ Exception: ${error.message}`, null)
    } finally {
      setLoading(false)
    }
  }

  const runAllTests = async () => {
    clearResults()
    
    addResult("Test Suite", true, "Starting all tests...", null)
    
    await testGetUserProfile()
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await testUpsertProfile()
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await testUpdateProfile()
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await testGetUserProfile()
    
    addResult("Test Suite", true, "✓ All tests completed!", null)
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Please log in to run tests</p>
            <Button asChild>
              <a href="/login">Go to Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const passedCount = results.filter(r => r.passed && r.test !== "Test Suite").length
  const failedCount = results.filter(r => !r.passed && r.test !== "Test Suite").length
  const totalTests = results.filter(r => r.test !== "Test Suite").length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">User Profiles Server Actions Test</h1>
        <p className="text-muted-foreground">
          Test the user profile database integration implementation
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
            <CardDescription>
              Run tests to verify the server actions are working correctly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={testGetUserProfile} 
                disabled={loading}
                variant="outline"
                size="sm"
              >
                Test Get Profile
              </Button>
              <Button 
                onClick={testCreateProfile} 
                disabled={loading}
                variant="outline"
                size="sm"
              >
                Test Create Profile
              </Button>
              <Button 
                onClick={testUpdateProfile} 
                disabled={loading}
                variant="outline"
                size="sm"
              >
                Test Update Profile
              </Button>
              <Button 
                onClick={testUpsertProfile} 
                disabled={loading}
                variant="outline"
                size="sm"
              >
                Test Upsert Profile
              </Button>
              <Button 
                onClick={runAllTests} 
                disabled={loading}
                className="bg-primary"
                size="sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  "Run All Tests"
                )}
              </Button>
              {results.length > 0 && (
                <Button 
                  onClick={clearResults} 
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  Clear Results
                </Button>
              )}
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Current User:</strong> {user.email} ({user.role})
              </p>
              <p className="text-xs text-muted-foreground">
                All tests use your authenticated session. Make sure you're logged in.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {totalTests > 0 && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Test Summary</p>
                <p className="text-2xl font-bold">
                  {passedCount}/{totalTests} passed
                </p>
              </div>
              {failedCount > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Failed</p>
                  <p className="text-2xl font-bold text-destructive">{failedCount}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
          <CardDescription>
            {results.length === 0 
              ? "No tests run yet. Click a test button above to begin."
              : `${results.length} test result(s)`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No test results yet
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${
                    result.passed 
                      ? "bg-success/10 border-success/20" 
                      : "bg-destructive/10 border-destructive/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.passed ? (
                      <CheckCircle2 className="h-5 w-5 text-success mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={result.passed ? "default" : "destructive"}>
                          {result.test}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm wrap-break-word">{result.message}</p>
                      {result.data && (
                        <details className="mt-2">
                          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                            View Data ({Object.keys(result.data).length} fields)
                          </summary>
                          <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto max-h-60">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

