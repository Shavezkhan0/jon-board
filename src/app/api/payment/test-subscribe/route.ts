import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { PLANS, PlanType, addDays } from '@/lib/razorpay'

interface TestSubscribeRequest {
  plan: PlanType
}

async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return null
    }

    const payload = await getPayload({ config })

    // Get user by JWT token
    try {
      const { user } = (await payload.findByID({
        collection: 'users',
        id: token,
      })) as any
      return user
    } catch {
      return null
    }
  } catch (error) {
    console.error('Error authenticating user:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: TestSubscribeRequest = await request.json()
    const { plan } = body

    // Validate plan
    if (!plan || !['monthly', 'quarterly', 'yearly'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 })
    }

    // Get current user
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    // Get existing user to get current total paid
    const existingUser = await payload.findByID({
      collection: 'users',
      id: user.id,
    })

    // Generate fake payment data
    const fakeOrderId = 'TEST_ORDER_' + Date.now()
    const fakePaymentId = 'TEST_PAY_' + Date.now()

    // Calculate dates
    const startedAt = new Date()
    const expiresAt = addDays(startedAt, PLANS[plan].duration)

    // Step 1 — Create Subscription document
    const subscription = await payload.create({
      collection: 'subscriptions',
      data: {
        user: user.id,
        userEmail: user.email,
        plan: plan,
        status: 'active',
        razorpayOrderId: fakeOrderId,
        razorpayPaymentId: fakePaymentId,
        razorpaySignature: 'TEST_SIGNATURE',
        amount: PLANS[plan].amount,
        currency: 'INR',
        startedAt: startedAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        isVerified: true,
      },
    })

    // Step 2 — Update User document
    const updatedUser = await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        subscriptionStatus: 'active',
        subscriptionExpiry: expiresAt.toISOString(),
        subscriptionPlan: plan,
        razorpayPaymentId: fakePaymentId,
        totalPaid: ((existingUser as any)?.totalPaid || 0) + PLANS[plan].amount,
      },
    })

    // Step 3 — Return success response
    return NextResponse.json({
      success: true,
      message: 'Subscription activated successfully!',
      subscription: {
        plan: plan,
        planName: PLANS[plan].name,
        amount: PLANS[plan].amount,
        startedAt: startedAt,
        expiresAt: expiresAt,
        daysTotal: PLANS[plan].duration,
        orderId: fakeOrderId,
        paymentId: fakePaymentId,
      },
    })
  } catch (error) {
    console.error('Test subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to activate subscription. Please try again.' },
      { status: 500 },
    )
  }
}
