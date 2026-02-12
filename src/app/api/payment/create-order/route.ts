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
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body: CreateOrderRequest = await request.json()
    const { plan } = body

    // Validate plan
    if (!plan || !PLANS[plan]) {
      return NextResponse.json(
        { success: false, message: 'Invalid plan selected' },
        { status: 400 }
      )
    }

    const planDetails = PLANS[plan]
    const receipt = `receipt_${user.id}_${Date.now()}`

    // Create Razorpay order
    try {
      const order = await razorpay.orders.create({
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
            expiresAt: addDays(new Date(), planDetails.duration),
            isVerified: false,
          },
        })

        return NextResponse.json({
          success: true,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
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
        try {
          await razorpay.orders.payments(order.id)
        } catch (rollbackError) {
          console.error('Error rolling back Razorpay order:', rollbackError)
        }

        return NextResponse.json(
          { success: false, message: 'Failed to create subscription' },
          { status: 500 }
        )
      }
    } catch (razorpayError) {
      console.error('Error creating Razorpay order:', razorpayError)
      return NextResponse.json(
        { success: false, message: 'Failed to create payment order' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}