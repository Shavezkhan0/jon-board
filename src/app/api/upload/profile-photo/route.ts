import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getPayloadClient } from '@/lib/mongodb'
import { uploadProfilePhoto } from '@/lib/cloudinary'
import { parseFormData, validateImageFile } from '@/lib/parseFormData'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Please login first' }, { status: 401 })
    }

    const userWithPhoto = user as unknown as {
      id: string
      profilePhotoPublicId?: string | null
      profilePhotoUrl?: string | null
    }

    const { file } = await parseFormData(request)

    const validation = validateImageFile(file, 5)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const result = await uploadProfilePhoto(
      file!.buffer,
      userWithPhoto.id,
      userWithPhoto.profilePhotoPublicId || undefined,
    )

    const payload = await getPayloadClient()
    await payload.update({
      collection: 'users',
      id: userWithPhoto.id,
      data: {
        profilePhotoUrl: result.url,
        profilePhotoPublicId: result.publicId,
      } as any,
    })

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
      message: 'Profile photo updated successfully!',
    })
  } catch (error: unknown) {
    console.error('Profile photo upload error:', error)
    const message = error instanceof Error ? error.message : 'Upload failed. Please try again.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userWithPhoto = user as unknown as {
      id: string
      profilePhotoPublicId?: string | null
      profilePhotoUrl?: string | null
    }

    if (!userWithPhoto.profilePhotoPublicId) {
      return NextResponse.json({ error: 'No profile photo to delete' }, { status: 400 })
    }

    const { deleteFromCloudinary } = await import('@/lib/cloudinary')
    await deleteFromCloudinary(userWithPhoto.profilePhotoPublicId)

    const payload = await getPayloadClient()
    await payload.update({
      collection: 'users',
      id: userWithPhoto.id,
      data: {
        profilePhotoUrl: null,
        profilePhotoPublicId: null,
      } as any,
    })

    return NextResponse.json({
      success: true,
      message: 'Profile photo removed successfully',
    })
  } catch (error: unknown) {
    console.error('Delete photo error:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete photo'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
