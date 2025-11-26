'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function TestQueryComparisonPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runTests = async () => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/test/query-comparison')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to run tests')
      }

      setResults(data)
    } catch (err: any) {
      setError(err.message || 'Failed to run comparison tests')
      console.error('Test error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>Query Comparison Tests</CardTitle>
          <CardDescription>
            Compare Supabase queries vs Prisma queries side-by-side
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runTests} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run Comparison Tests'
            )}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 font-semibold">Error:</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {results && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="p-4 bg-gray-50 border rounded-md">
                <h3 className="text-lg font-semibold mb-2">Test Summary</h3>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Total Tests:</span>{' '}
                    {results.summary.total}
                  </div>
                  <div className="text-green-600">
                    <span className="font-semibold">✅ Passed:</span>{' '}
                    {results.summary.passed}
                  </div>
                  <div className="text-red-600">
                    <span className="font-semibold">❌ Failed:</span>{' '}
                    {results.summary.failed}
                  </div>
                  <div>
                    <span className="font-semibold">Success Rate:</span>{' '}
                    {results.summary.successRate}
                  </div>
                </div>
              </div>

              {/* Individual Test Results */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Test Results</h3>
                {results.results.map((test: any, index: number) => (
                  <Card key={index} className={test.match ? 'border-green-200' : 'border-red-200'}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{test.testName}</CardTitle>
                        <span
                          className={
                            test.match
                              ? 'text-green-600 font-semibold'
                              : 'text-red-600 font-semibold'
                          }
                        >
                          {test.match ? '✅ PASS' : '❌ FAIL'}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-semibold">Supabase:</span>{' '}
                          <span
                            className={test.supabaseSuccess ? 'text-green-600' : 'text-red-600'}
                          >
                            {test.supabaseSuccess ? 'Success' : 'Failed'}
                          </span>
                          {test.supabaseError && (
                            <div className="text-red-600 text-xs mt-1">
                              {test.supabaseError}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-semibold">Prisma:</span>{' '}
                          <span
                            className={test.prismaSuccess ? 'text-green-600' : 'text-red-600'}
                          >
                            {test.prismaSuccess ? 'Success' : 'Failed'}
                          </span>
                          {test.prismaError && (
                            <div className="text-red-600 text-xs mt-1">
                              {test.prismaError}
                            </div>
                          )}
                        </div>
                      </div>
                      {test.differences && test.differences.length > 0 && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                          <p className="font-semibold text-red-800 mb-1">Differences:</p>
                          <ul className="list-disc list-inside text-red-600 text-xs space-y-1">
                            {test.differences.map((diff: string, i: number) => (
                              <li key={i}>{diff}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

