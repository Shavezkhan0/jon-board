import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentUser } from '@/lib/auth'
import { PLANS, PlanType, addDays } from '@/lib/razorpay'
import { sendSubscriptionConfirmationEmail } from '@/lib/email'

interface VerifyPaymentRequest {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  plan: PlanType
}

export async function POST(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
    }

    const body: VerifyPaymentRequest = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = body

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !plan) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 },
      )
    }

    // Validate plan
    if (!PLANS[plan]) {
      return NextResponse.json({ success: false, message: 'Invalid plan' }, { status: 400 })
    }

    // Verify Razorpay signature
    const body_string = razorpay_order_id + '|' + razorpay_payment_id

    const isBypassMode = process.env.NEXT_PUBLIC_ENABLE_PAYMENT_BYPASS === 'true'

    if (!isBypassMode) {
      const expected_signature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body_string)
        .digest('hex')

      if (expected_signature !== razorpay_signature) {
        return NextResponse.json(
          { success: false, message: 'Payment verification failed' },
          { status: 400 },
        )
      }
    }

    const payload = await getPayload({ config })
    const planDetails = PLANS[plan]
    const expiresAt = addDays(new Date(), planDetails.duration)

    try {
      // Update subscription document
      const subscription = await payload.update({
        collection: 'subscriptions',
        where: {
          and: [
            {
              user: {
                equals: user.id,
              },
            },
            {
              razorpayOrderId: {
                equals: razorpay_order_id,
              },
            },
          ],
        },
        data: {
          status: 'active',
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          isVerified: true,
          expiresAt,
        },
      })

      // Update user document
      const updatedUser = await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          subscriptionStatus: 'active',
          subscriptionExpiry: expiresAt,
          subscriptionPlan: plan,
          razorpayPaymentId: razorpay_payment_id,
          totalPaid: (user.totalPaid || 0) + planDetails.amount,
        },
      })

      // Send confirmation email
      try {
        await sendSubscriptionConfirmationEmail({
          email: user.email,
          fullName: user.fullName,
          plan: planDetails.name,
          amount: planDetails.amount,
          expiresAt,
        })
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError)
        // Don't fail the request if email fails
      }

      return NextResponse.json({
        success: true,
        expiresAt,
        plan,
        message: 'Subscription activated!',
        subscription: subscription.docs[0],
        user: {
          subscriptionStatus: updatedUser.subscriptionStatus,
          subscriptionExpiry: updatedUser.subscriptionExpiry,
          subscriptionPlan: updatedUser.subscriptionPlan,
        },
      })
    } catch (updateError) {
      console.error('Error updating subscription:', updateError)
      return NextResponse.json(
        { success: false, message: 'Failed to activate subscription' },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
