import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const searchParams = request.nextUrl.searchParams
    const asAdmin = searchParams.get('admin') === 'true'

    // If admin=true, simulate admin access
    const jobs = await payload.find({
      collection: 'jobs',
      limit: 100,
      depth: 0,
      overrideAccess: asAdmin ? false : undefined,
    })

    return NextResponse.json({
      count: jobs.totalDocs,
      jobs: jobs.docs.map((j) => ({
        id: j.id,
        title: j.title,
        isActive: j.isActive,
        expiresAt: j.expiresAt,
        createdAt: j.createdAt,
      })),
      mode: asAdmin ? 'admin' : 'public',
    })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message, stack: error?.stack }, { status: 500 })
  }
}
