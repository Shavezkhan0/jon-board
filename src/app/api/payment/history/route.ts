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

    try {
      // Fetch all subscriptions for the user
      const subscriptions = await payload.find({
        collection: 'subscriptions',
        where: {
          user: {
            equals: user.id,
          },
        },
        sort: '-startedAt',
        depth: 0,
      })

      return NextResponse.json({
        success: true,
        subscriptions: subscriptions.docs.map(sub => ({
          id: sub.id,
          userEmail: sub.userEmail,
          plan: sub.plan,
          status: sub.status,
          amount: sub.amount,
          currency: sub.currency,
          startedAt: sub.startedAt,
          expiresAt: sub.expiresAt,
          razorpayOrderId: sub.razorpayOrderId,
          razorpayPaymentId: sub.razorpayPaymentId,
          isVerified: sub.isVerified,
          createdAt: sub.createdAt,
        })),
      })
    } catch (fetchError) {
      console.error('Error fetching payment history:', fetchError)
      return NextResponse.json(
        { success: false, message: 'Failed to fetch payment history' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Payment history error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}