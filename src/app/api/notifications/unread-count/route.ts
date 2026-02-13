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

    // Count unread notifications
    const result = await payload.find({
      collection: 'user-notifications',
      where: {
        and: [{ user: { equals: user.id } }, { isRead: { equals: false } }],
      },
      limit: 0,
    })

    return NextResponse.json({
      unreadCount: result.totalDocs,
    })
  } catch (error: any) {
    console.error('Get unread count error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch unread count' },
      { status: 500 },
    )
  }
}
