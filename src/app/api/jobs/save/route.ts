import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentUser, isSubscriptionActive } from '@/lib/auth'

interface SaveJobRequest {
  jobId: string
}

export async function POST(request: NextRequest) {
  try {
    // Get current user and check subscription
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check if user has active subscription
    if (!isSubscriptionActive(user)) {
      return NextResponse.json(
        { success: false, message: 'Active subscription required to save jobs' },
        { status: 403 }
      )
    }

    const body: SaveJobRequest = await request.json()
    const { jobId } = body

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: 'Job ID is required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    try {
      // Check if job exists and is active
      const job = await payload.findByID({
        collection: 'jobs',
        id: jobId,
        depth: 0,
      })

      if (!job) {
        return NextResponse.json(
          { success: false, message: 'Job not found' },
          { status: 404 }
        )
      }

      if (!job.isActive) {
        return NextResponse.json(
          { success: false, message: 'Job is no longer active' },
          { status: 400 }
        )
      }

      // Check if already saved
      const existingSave = await payload.find({
        collection: 'saved-jobs',
        where: {
          and: [
            {
              user: {
                equals: user.id,
              },
            },
            {
              job: {
                equals: jobId,
              },
            },
          ],
        },
        limit: 1,
      })

      if (existingSave.docs.length > 0) {
        return NextResponse.json(
          { success: false, message: 'Job already saved' },
          { status: 409 }
        )
      }

      // Save job
      const savedJob = await payload.create({
        collection: 'saved-jobs',
        data: {
          user: user.id,
          job: jobId,
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Job saved successfully',
        savedJob: {
          id: savedJob.id,
          job: savedJob.job,
          savedAt: savedJob.savedAt,
        },
      })
    } catch (payloadError) {
      console.error('Error saving job:', payloadError)
      return NextResponse.json(
        { success: false, message: 'Failed to save job' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Save job error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')

    if (!jobId) {
      return NextResponse.json(
        { success: false, message: 'Job ID is required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    try {
      // Find and delete saved job
      const savedJobs = await payload.find({
        collection: 'saved-jobs',
        where: {
          and: [
            {
              user: {
                equals: user.id,
              },
            },
            {
              job: {
                equals: jobId,
              },
            },
          ],
        },
        limit: 1,
      })

      if (savedJobs.docs.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Saved job not found' },
          { status: 404 }
        )
      }

      await payload.delete({
        collection: 'saved-jobs',
        id: savedJobs.docs[0].id,
      })

      return NextResponse.json({
        success: true,
        message: 'Job removed successfully',
      })
    } catch (payloadError) {
      console.error('Error removing saved job:', payloadError)
      return NextResponse.json(
        { success: false, message: 'Failed to remove job' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Remove saved job error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}