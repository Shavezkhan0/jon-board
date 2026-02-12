import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

interface LoginRequest {
  email: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Initialize Payload
    const payload = await getPayload({ config })

    try {
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
          { status: 401 }
        )
      }

      // Set HTTP-only cookie
      const isProduction = process.env.NODE_ENV === 'production'
      const cookieStore = cookies()

      cookieStore.set('payload-token', result.token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      // Return user data
      return NextResponse.json({
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
    } catch (error) {
      console.error('Login error:', error)
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}