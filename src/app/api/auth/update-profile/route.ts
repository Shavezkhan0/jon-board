import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

interface UpdateProfileRequest {
  fullName?: string
  phone?: string
  currentJobTitle?: string
  bio?: string
  linkedinUrl?: string
  resumeUrl?: string
  skills?: Array<{ skill: string }>
}

interface ValidationError {
  field: string
  message: string
}

export async function PUT(request: NextRequest) {
  try {
    // Authenticate user from cookie
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    try {
      const { user } = await (payload as any).verifyToken({
        collection: 'users',
        token,
      })

      if (!user) {
        return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })
      }

      const body: UpdateProfileRequest = await request.json()
      const { fullName, phone, currentJobTitle, bio, linkedinUrl, resumeUrl, skills } = body

      // Validation
      const errors: ValidationError[] = []

      if (fullName !== undefined) {
        if (!fullName || fullName.trim().length < 2) {
          errors.push({
            field: 'fullName',
            message: 'Full name must be at least 2 characters long',
          })
        }
      }

      if (phone !== undefined && phone) {
        const phoneRegex = /^[6-9]\d{9}$/
        if (!phoneRegex.test(phone)) {
          errors.push({
            field: 'phone',
            message: 'Please enter a valid 10-digit Indian phone number',
          })
        }
      }

      if (bio !== undefined && bio && bio.length > 300) {
        errors.push({
          field: 'bio',
          message: 'Bio must be less than 300 characters',
        })
      }

      if (linkedinUrl !== undefined && linkedinUrl) {
        try {
          new URL(linkedinUrl)
        } catch {
          errors.push({
            field: 'linkedinUrl',
            message: 'Please enter a valid URL',
          })
        }
      }

      if (resumeUrl !== undefined && resumeUrl) {
        try {
          new URL(resumeUrl)
        } catch {
          errors.push({
            field: 'resumeUrl',
            message: 'Please enter a valid URL',
          })
        }
      }

      if (errors.length > 0) {
        return NextResponse.json({ success: false, errors }, { status: 400 })
      }

      // Update user
      const updateData: any = {}

      if (fullName !== undefined) updateData.fullName = fullName.trim()
      if (phone !== undefined) updateData.phone = phone || null
      if (currentJobTitle !== undefined) updateData.currentJobTitle = currentJobTitle || null
      if (bio !== undefined) updateData.bio = bio || null
      if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl || null
      if (resumeUrl !== undefined) updateData.resumeUrl = resumeUrl || null
      if (skills !== undefined) updateData.skills = skills || []

      const updatedUser = await payload.update({
        collection: 'users',
        id: user.id,
        data: updateData,
      })

      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          fullName: updatedUser.fullName,
          phone: updatedUser.phone,
          profilePhoto: updatedUser.profilePhoto,
          subscriptionStatus: updatedUser.subscriptionStatus,
          subscriptionExpiry: updatedUser.subscriptionExpiry,
          subscriptionPlan: updatedUser.subscriptionPlan,
          skills: updatedUser.skills,
          currentJobTitle: updatedUser.currentJobTitle,
          linkedinUrl: updatedUser.linkedinUrl,
          bio: updatedUser.bio,
          resumeUrl: updatedUser.resumeUrl,
        },
      })
    } catch (tokenError) {
      console.error('Token verification error:', tokenError)
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })
    }
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
