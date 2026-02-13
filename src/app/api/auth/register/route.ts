import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

interface RegisterRequest {
  email: string
  password: string
  fullName: string
  phone?: string
}

interface ValidationError {
  field: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json()
    const { email, password, fullName, phone } = body

    // Validation
    const errors: ValidationError[] = []

    if (!email) {
      errors.push({ field: 'email', message: 'Email is required' })
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        errors.push({ field: 'email', message: 'Please enter a valid email address' })
      }
    }

    if (!password) {
      errors.push({ field: 'password', message: 'Password is required' })
    } else if (password.length < 8) {
      errors.push({ field: 'password', message: 'Password must be at least 8 characters long' })
    }

    if (!fullName) {
      errors.push({ field: 'fullName', message: 'Full name is required' })
    } else if (fullName.trim().length < 2) {
      errors.push({ field: 'fullName', message: 'Full name must be at least 2 characters long' })
    }

    if (phone) {
      const phoneRegex = /^[6-9]\d{9}$/
      if (!phoneRegex.test(phone)) {
        errors.push({
          field: 'phone',
          message: 'Please enter a valid 10-digit Indian phone number',
        })
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    // Initialize Payload
    const payload = await getPayload({ config })

    // Check if user already exists
    try {
      const existingUser = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: email.toLowerCase(),
          },
        },
        limit: 1,
      })

      if (existingUser.docs.length > 0) {
        return NextResponse.json(
          { success: false, message: 'Email already exists' },
          { status: 409 },
        )
      }
    } catch (error) {
      console.error('Error checking existing user:', error)
    }

    // Create user
    try {
      const user = await payload.create({
        collection: 'users',
        draft: false,
        data: {
          email: email.toLowerCase(),
          password,
          fullName: fullName.trim(),
          phone: phone || undefined,
          roles: ['user'],
          subscriptionStatus: 'none',
        },
      })

      return NextResponse.json({
        success: true,
        code: 'VERIFY_EMAIL',
        message:
          'Account created! Please check your email to verify your account before logging in.',
        email: user.email,
      })
    } catch (error) {
      console.error('Error creating user:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to create user' },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
