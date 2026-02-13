import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentUser } from '@/lib/auth'
import { razorpay, PLANS, PlanType, addDays } from '@/lib/razorpay'

interface CreateOrderRequest {
  plan: PlanType
}

export async function POST(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
    }

    const body: CreateOrderRequest = await request.json()
    const { plan } = body

    // Validate plan
    if (!plan || !PLANS[plan]) {
      return NextResponse.json(
        { success: false, message: 'Invalid plan selected' },
        { status: 400 },
      )
    }

    const planDetails = PLANS[plan]
    const receipt = `rcpt_${Date.now().toString().slice(-8)}_${user.id.slice(-6)}`

    // Create Razorpay order
    try {
      let order

      const isBypassMode = process.env.NEXT_PUBLIC_ENABLE_PAYMENT_BYPASS === 'true'

      if (isBypassMode) {
        // Create dummy order for bypass mode
        order = {
          id: `order_bypass_${Date.now()}`,
          amount: planDetails.amount,
          currency: 'INR',
        }
      } else {
        // Create actual Razorpay order
        order = await razorpay.orders.create({
          amount: planDetails.amount,
          currency: 'INR',
          receipt,
          notes: {
            userId: user.id,
            email: user.email,
            plan,
            fullName: user.fullName,
          },
        })
      }

      // Initialize Payload
      const payload = await getPayload({ config })

      // Create pending subscription document
      try {
        const subscription = await payload.create({
          collection: 'subscriptions',
          data: {
            user: user.id,
            userEmail: user.email,
            plan,
            status: 'pending',
            razorpayOrderId: order.id,
            amount: planDetails.amount,
            currency: 'INR',
            expiresAt: addDays(new Date(), planDetails.duration).toISOString(),
            isVerified: false,
          },
        })

        return NextResponse.json({
          success: true,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: isBypassMode ? 'dummy_key' : process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          planDetails: {
            name: planDetails.name,
            amount: planDetails.amount,
            duration: planDetails.duration,
            description: planDetails.description,
            savings: planDetails.savings,
          },
          subscriptionId: subscription.id,
        })
      } catch (subscriptionError) {
        console.error('Error creating subscription:', subscriptionError)

        // Try to rollback Razorpay order by marking it as failed
        if (!isBypassMode) {
          // Razorpay orders cannot be explicitly deleted/cancelled via API,
          // they simply remain unpaid if not processed.
        }

        return NextResponse.json(
          { success: false, message: 'Failed to create subscription' },
          { status: 500 },
        )
      }
    } catch (razorpayError) {
      console.error('Error creating Razorpay order:', razorpayError)
      return NextResponse.json(
        { success: false, message: 'Failed to create payment order' },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
