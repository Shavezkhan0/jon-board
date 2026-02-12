import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const payload = await getPayload({ config })
    const now = new Date()

    // Auto-expire if needed
    let updatedUser = user
    if (
      user.subscriptionStatus === 'active' &&
      user.subscriptionExpiry &&
      new Date(user.subscriptionExpiry) < now
    ) {
      try {
        updatedUser = await payload.update({
          collection: 'users',
          id: user.id,
          data: {
            subscriptionStatus: 'expired',
          },
        })
      } catch (updateError) {
        console.error('Error updating expired subscription:', updateError)
        // Continue with original user data if update fails
      }
    }

    // Calculate days left
    let daysLeft = 0
    let isActive = false
    const expiresAt = updatedUser.subscriptionExpiry ? new Date(updatedUser.subscriptionExpiry) : null

    if (expiresAt && updatedUser.subscriptionStatus === 'active') {
      const diffTime = expiresAt.getTime() - now.getTime()
      daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      isActive = daysLeft > 0
    }

    // Get subscription details if active
    let startedAt = null
    if (isActive) {
      try {
        const subscription = await payload.find({
          collection: 'subscriptions',
          where: {
            and: [
              {
                user: {
                  equals: user.id,
                },
              },
              {
                status: {
                  equals: 'active',
                },
              },
            ],
          },
          sort: '-startedAt',
          limit: 1,
        })

        if (subscription.docs.length > 0) {
          startedAt = subscription.docs[0].startedAt
        }
      } catch (subscriptionError) {
        console.error('Error fetching subscription details:', subscriptionError)
      }
    }

    return NextResponse.json({
      success: true,
      isActive,
      status: updatedUser.subscriptionStatus,
      plan: updatedUser.subscriptionPlan,
      expiresAt: expiresAt ? expiresAt.toISOString() : null,
      daysLeft,
      startedAt,
    })
  } catch (error) {
    console.error('Payment status error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}