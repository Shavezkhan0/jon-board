import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentUser } from '@/lib/auth'

interface UpdateProfileRequest {
  fullName?: string
  phone?: string
  currentJobTitle?: string
  bio?: string
  linkedinUrl?: string
  resumeUrl?: string
  skills?: Array<{ skill: string }>
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    const body: UpdateProfileRequest = await request.json()
    console.log('Profile update request:', JSON.stringify(body))

    const { fullName, phone, currentJobTitle, bio, linkedinUrl, resumeUrl, skills } = body

    // Update user with retry for MongoDB write conflicts
    const updateData: any = {}

    if (fullName !== undefined) {
      const trimmed = fullName.trim()
      updateData.fullName = trimmed || null
    }
    if (phone !== undefined) {
      const trimmed = phone?.trim() || ''
      updateData.phone = trimmed || null
    }
    if (currentJobTitle !== undefined) {
      const trimmed = currentJobTitle?.trim() || ''
      updateData.currentJobTitle = trimmed || null
    }
    if (bio !== undefined) {
      const trimmed = bio?.trim() || ''
      updateData.bio = trimmed || null
    }
    if (linkedinUrl !== undefined) {
      const trimmed = linkedinUrl?.trim() || ''
      updateData.linkedinUrl = trimmed || null
    }
    if (resumeUrl !== undefined) {
      const trimmed = resumeUrl?.trim() || ''
      updateData.resumeUrl = trimmed || null
    }
    if (skills !== undefined) updateData.skills = skills || []

    console.log('Update data:', JSON.stringify(updateData))

    let updatedUser: any = null
    let retries = 3
    while (retries > 0) {
      try {
        updatedUser = await payload.update({
          collection: 'users',
          id: user.id,
          data: updateData,
        })
        break
      } catch (error: any) {
        if (error.code === 112 && retries > 1) {
          retries--
          await new Promise((resolve) => setTimeout(resolve, 100))
          continue
        }
        throw error
      }
    }

    if (!updatedUser) {
      throw new Error('Failed to update user')
    }

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
  } catch (error: any) {
    console.error('Update profile error:', error)
    const errorMessage = error?.message || 'Internal server error'
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 })
  }
}
