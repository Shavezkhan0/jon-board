import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Initialize Payload
    const payload = await getPayload({ config })

    try {
      // Verify and decode JWT token
      const { user } = await payload.verifyToken({
        collection: 'users',
        token,
      })

      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Invalid token' },
          { status: 401 }
        )
      }

      // Fetch fresh user data from MongoDB
      const freshUser = await payload.findByID({
        collection: 'users',
        id: user.id,
        depth: 0,
      })

      if (!freshUser) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 401 }
        )
      }

      // Return sanitized user object
      return NextResponse.json({
        success: true,
        user: {
          id: freshUser.id,
          email: freshUser.email,
          fullName: freshUser.fullName,
          phone: freshUser.phone,
          profilePhoto: freshUser.profilePhoto,
          subscriptionStatus: freshUser.subscriptionStatus,
          subscriptionExpiry: freshUser.subscriptionExpiry,
          subscriptionPlan: freshUser.subscriptionPlan,
          skills: freshUser.skills,
          currentJobTitle: freshUser.currentJobTitle,
          linkedinUrl: freshUser.linkedinUrl,
          bio: freshUser.bio,
          resumeUrl: freshUser.resumeUrl,
        },
      })
    } catch (tokenError) {
      console.error('Token verification error:', tokenError)
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}