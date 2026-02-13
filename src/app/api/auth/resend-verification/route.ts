import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

interface ResendRequest {
  email: string
}

interface RateLimitEntry {
  count: number
  firstAttempt: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

export async function POST(request: NextRequest) {
  try {
    const body: ResendRequest = await request.json()
    const { email } = body

    // Validation
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    // Rate limiting: Max 3 resends per hour per email
    const now = Date.now()
    const rateLimitEntry = rateLimitMap.get(email.toLowerCase())

    if (rateLimitEntry) {
      const hoursPassed = (now - rateLimitEntry.firstAttempt) / (1000 * 60 * 60)

      if (hoursPassed < 1 && rateLimitEntry.count >= 3) {
        return NextResponse.json(
          { error: 'Too many attempts. Try again in 1 hour.' },
          { status: 429 },
        )
      }

      if (hoursPassed >= 1) {
        // Reset after 1 hour
        rateLimitMap.set(email.toLowerCase(), { count: 1, firstAttempt: now })
      } else {
        // Increment count
        rateLimitMap.set(email.toLowerCase(), {
          count: rateLimitEntry.count + 1,
          firstAttempt: rateLimitEntry.firstAttempt,
        })
      }
    } else {
      // First attempt
      rateLimitMap.set(email.toLowerCase(), { count: 1, firstAttempt: now })
    }

    // Initialize Payload
    const payload = await getPayload({ config })

    // Check if user exists
    const users = await payload.find({
      collection: 'users',
      where: { email: { equals: email.toLowerCase() } },
    })

    if (users.docs.length === 0) {
      return NextResponse.json({ error: 'No account found with this email' }, { status: 404 })
    }

    const user = users.docs[0]

    // Check if user is already verified
    if (user._verified as boolean) {
      return NextResponse.json({ error: 'Email already verified. Please login.' }, { status: 400 })
    }

    // Call PayloadCMS built-in resend verification endpoint
    try {
      const resendResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/users/resend-verification`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.toLowerCase() }),
        },
      )

      if (!resendResponse.ok) {
        const errorData = await resendResponse.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to resend verification email')
      }

      return NextResponse.json({
        success: true,
        message: 'Verification email sent! Check your inbox.',
      })
    } catch (fetchError) {
      console.error('Resend verification error:', fetchError)
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again later.' },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('Resend verification API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
