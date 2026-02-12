import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/mongodb'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Auth check
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayloadClient()
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '20')

    // Fetch user notifications
    const result = await payload.find({
      collection: 'user-notifications',
      where: { user: { equals: user.id } },
      sort: '-createdAt',
      limit,
      depth: 2,
    })

    // Count unread notifications
    const unreadResult = await payload.find({
      collection: 'user-notifications',
      where: {
        and: [{ user: { equals: user.id } }, { isRead: { equals: false } }],
      },
      limit: 0,
    })

    return NextResponse.json({
      notifications: result.docs,
      unreadCount: unreadResult.totalDocs,
      total: result.totalDocs,
    })
  } catch (error: any) {
    console.error('Get notifications error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch notifications' },
      { status: 500 },
    )
  }
}
