import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

interface LoginRequest {
  email: string
  password: string
}

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(7)}`

  try {
    console.log(`[${requestId}] Login attempt started`)

    const body: LoginRequest = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 },
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 },
      )
    }

    // Initialize Payload
    const payload = await getPayload({ config })

    try {
      // Find user by email first
      const users = await payload.find({
        collection: 'users',
        where: { email: { equals: email.toLowerCase() } },
      })

      if (users.docs.length === 0) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
      }

      const user = users.docs[0]

      // Check if email is verified
      if (!(user._verified as boolean)) {
        return NextResponse.json(
          {
            error: 'Please verify your email before logging in.',
            code: 'EMAIL_NOT_VERIFIED',
            message:
              'We sent a verification link to your email. Please check your inbox and spam folder.',
            email: user.email,
          },
          { status: 403 },
        )
      }

      // Authenticate user
      const result = await payload.login({
        collection: 'users',
        data: {
          email: email.toLowerCase(),
          password,
        },
      })

      if (!result.user || !result.token) {
        return NextResponse.json(
          { success: false, message: 'Invalid email or password' },
          { status: 401 },
        )
      }

      // Set HTTP-only cookie
      const isProduction = process.env.NODE_ENV === 'production'

      // Return user data with token
      const response = NextResponse.json({
        success: true,
        user: {
          id: result.user.id,
          email: result.user.email,
          fullName: result.user.fullName,
          subscriptionStatus: result.user.subscriptionStatus,
          subscriptionExpiry: result.user.subscriptionExpiry,
          subscriptionPlan: result.user.subscriptionPlan,
        },
      })

      response.cookies.set('payload-token', result.token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      console.log(`[${requestId}] Login successful for: ${email}`)

      return response
    } catch (error: any) {
      console.error(`[${requestId}] Login error:`, error?.message || error)
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 },
      )
    }
  } catch (error: any) {
    console.error(`[${requestId}] Login API error:`, error?.message || error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
