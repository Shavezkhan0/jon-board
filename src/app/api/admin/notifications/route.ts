import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/mongodb'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Auth check and admin verification
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin by email from env
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
    const isAdmin = adminEmails.includes(user.email) || user.roles?.includes('admin')
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 })
    }

    const payload = await getPayloadClient()
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const page = parseInt(url.searchParams.get('page') || '1')

    // Fetch notifications
    const result = await payload.find({
      collection: 'notifications',
      sort: '-createdAt',
      limit,
      depth: 1,
    })

    return NextResponse.json({
      notifications: result.docs,
      total: result.totalDocs,
      page,
      limit,
    })
  } catch (error: any) {
    console.error('Get notification history error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch notification history' },
      { status: 500 },
    )
  }
}
