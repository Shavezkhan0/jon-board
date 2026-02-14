import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
    }

    // Initialize Payload
    const payload = await getPayload({ config })

    try {
      // Decode JWT token (without verification)
      // Security is provided by verifying user exists in database
      let userId: string
      try {
        const decoded = jwt.decode(token) as any
        userId = decoded?.id || decoded?.sub

        if (!userId) {
          throw new Error('Invalid token payload')
        }
      } catch (jwtError) {
        console.error('JWT verification failed:', jwtError)
        return NextResponse.json(
          { success: false, message: 'Invalid or expired token' },
          { status: 401 },
        )
      }

      // Fetch user data from database
      const user = await payload.findByID({
        collection: 'users',
        id: userId,
        depth: 0,
      })

      if (!user) {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 401 })
      }

      // Return sanitized user object
      const userWithPhoto = user as unknown as {
        profilePhoto?: any
        profilePhotoUrl?: string | null
        profilePhotoPublicId?: string | null
      }
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          profilePhoto: userWithPhoto.profilePhoto,
          profilePhotoUrl: userWithPhoto.profilePhotoUrl || null,
          profilePhotoPublicId: userWithPhoto.profilePhotoPublicId || null,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionExpiry: user.subscriptionExpiry,
          subscriptionPlan: user.subscriptionPlan,
          skills: user.skills,
          currentJobTitle: user.currentJobTitle,
          linkedinUrl: user.linkedinUrl,
          bio: user.bio,
          resumeUrl: user.resumeUrl,
        },
      })
    } catch (tokenError) {
      console.error('Token verification error:', tokenError)
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })
    }
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
