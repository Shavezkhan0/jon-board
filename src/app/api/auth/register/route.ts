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
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(7)}`

  try {
    console.log(`[${requestId}] Registration attempt started`)

    const body: RegisterRequest = await request.json()
    const { email, password, fullName, phone } = body

    console.log(`[${requestId}] Email: ${email}`)

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
      console.log(`[${requestId}] Validation failed:`, errors)
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    // Initialize Payload with timeout
    const payload = await getPayload({ config })
    console.log(`[${requestId}] Payload initialized successfully`)

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
        console.log(`[${requestId}] User already exists: ${email}`)
        return NextResponse.json(
          { success: false, message: 'Email already exists' },
          { status: 409 },
        )
      }
    } catch (findError) {
      console.error(`[${requestId}] Error checking existing user:`, findError)
      // Continue anyway - the check failed but we can try to create
    }

    // Create user
    try {
      console.log(`[${requestId}] Creating user...`)

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

      console.log(`[${requestId}] User created successfully: ${user.id}`)

      return NextResponse.json({
        success: true,
        code: 'VERIFY_EMAIL',
        message:
          'Account created! Please check your email to verify your account before logging in.',
        email: user.email,
      })
    } catch (createError: any) {
      console.error(`[${requestId}] Error creating user:`, createError?.message || createError)
      console.error(`[${requestId}] Stack:`, createError?.stack)

      return NextResponse.json(
        {
          success: false,
          message: createError?.message?.includes('duplicate')
            ? 'Email already exists'
            : 'Failed to create user. Please try again.',
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error(`[${requestId}] Registration error:`, error?.message || error)
    console.error(`[${requestId}] Stack:`, error?.stack)

    return NextResponse.json(
      {
        success: false,
        message:
          process.env.NODE_ENV === 'development'
            ? `Internal server error: ${error?.message}`
            : 'Internal server error',
      },
      { status: 500 },
    )
  }
}
