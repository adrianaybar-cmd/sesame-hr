import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Health check endpoint (para load balancers, monitoring)
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '0.1.0',
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  )
}
