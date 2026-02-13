import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
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

      const body: ChangePasswordRequest = await request.json()
      const { currentPassword, newPassword } = body

      // Validation
      const errors: ValidationError[] = []

      if (!currentPassword) {
        errors.push({
          field: 'currentPassword',
          message: 'Current password is required',
        })
      }

      if (!newPassword) {
        errors.push({
          field: 'newPassword',
          message: 'New password is required',
        })
      } else if (newPassword.length < 8) {
        errors.push({
          field: 'newPassword',
          message: 'New password must be at least 8 characters long',
        })
      }

      if (errors.length > 0) {
        return NextResponse.json({ success: false, errors }, { status: 400 })
      }

      // Verify current password
      try {
        await payload.login({
          collection: 'users',
          data: {
            email: user.email,
            password: currentPassword,
          },
        })
      } catch (loginError) {
        return NextResponse.json(
          { success: false, message: 'Current password is incorrect' },
          { status: 401 },
        )
      }

      // Update password
      try {
        await payload.update({
          collection: 'users',
          id: user.id,
          data: {
            password: newPassword,
          },
        })

        return NextResponse.json({
          success: true,
          message: 'Password changed successfully',
        })
      } catch (updateError) {
        console.error('Password update error:', updateError)
        return NextResponse.json(
          { success: false, message: 'Failed to update password' },
          { status: 500 },
        )
      }
    } catch (tokenError) {
      console.error('Token verification error:', tokenError)
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })
    }
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
