// Test endpoint to check if environment variables are loaded
// GET /api/test-env

import { NextResponse } from 'next/server'

export async function GET() {
  const dbUrl = process.env.DATABASE_URL
  
  return NextResponse.json({
    hasDatabaseUrl: !!dbUrl,
    urlPreview: dbUrl 
      ? dbUrl.replace(/:([^:@]+)@/, ':****@').substring(0, 60) + '...' 
      : 'missing',
    message: dbUrl 
      ? '✅ DATABASE_URL is loaded' 
      : '❌ DATABASE_URL is missing - check your .env.local file',
  })
}

