import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/mongodb'
import { getCurrentUser } from '@/lib/auth'

export async function PUT(request: NextRequest) {
  try {
    // Auth check
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { notificationId, markAll } = body

    const payload = await getPayloadClient()

    if (markAll === true) {
      // Mark all notifications as read
      const unreadResult = await payload.find({
        collection: 'user-notifications',
        where: {
          and: [{ user: { equals: user.id } }, { isRead: { equals: false } }],
        },
      })

      const updateResults = await Promise.allSettled(
        unreadResult.docs.map((notification) =>
          payload.update({
            collection: 'user-notifications',
            id: notification.id,
            data: {
              isRead: true,
              readAt: new Date().toISOString(),
            },
          }),
        ),
      )

      const successCount = updateResults.filter((r) => r.status === 'fulfilled').length

      return NextResponse.json({
        success: true,
        markedCount: successCount,
      })
    } else if (notificationId) {
      // Mark specific notification as read
      const notificationResult = await payload.find({
        collection: 'user-notifications',
        where: {
          and: [{ notification: { equals: notificationId } }, { user: { equals: user.id } }],
        },
        limit: 1,
      })

      if (notificationResult.docs.length === 0) {
        return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
      }

      await payload.update({
        collection: 'user-notifications',
        id: notificationResult.docs[0].id,
        data: {
          isRead: true,
          readAt: new Date().toISOString(),
        },
      })

      return NextResponse.json({
        success: true,
        markedCount: 1,
      })
    } else {
      return NextResponse.json(
        { error: 'Either notificationId or markAll must be provided' },
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error('Mark read error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to mark notifications as read' },
      { status: 500 },
    )
  }
}
