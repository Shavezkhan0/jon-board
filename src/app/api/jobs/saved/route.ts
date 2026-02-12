import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const payload = await getPayload({ config })

    try {
      // Fetch all saved jobs for the user with populated job details
      const savedJobs = await payload.find({
        collection: 'saved-jobs',
        where: {
          user: {
            equals: user.id,
          },
        },
        sort: '-savedAt',
        depth: 2, // Populate job details
        limit: 100,
      })

      // Format response with job details
      const formattedSavedJobs = savedJobs.docs.map(savedJob => {
        const job = savedJob.job as any // Type assertion for populated job
        
        return {
          id: savedJob.id,
          savedAt: savedJob.savedAt,
          job: {
            id: job?.id,
            title: job?.title,
            company: job?.company,
            location: job?.location,
            jobType: job?.jobType,
            category: job?.category,
            experienceLevel: job?.experienceLevel,
            salaryMin: job?.salaryMin,
            salaryMax: job?.salaryMax,
            salaryCurrency: job?.salaryCurrency,
            description: job?.description,
            isRemote: job?.isRemote,
            isFeatured: job?.isFeatured,
            isUrgent: job?.isUrgent,
            slug: job?.slug,
            expiresAt: job?.expiresAt,
            postedAt: job?.postedAt,
            companyLogo: job?.companyLogo,
            companyWebsite: job?.companyWebsite,
            skills: job?.skills,
            benefits: job?.benefits,
          },
        }
      })

      return NextResponse.json({
        success: true,
        savedJobs: formattedSavedJobs,
        total: savedJobs.totalDocs,
      })
    } catch (fetchError) {
      console.error('Error fetching saved jobs:', fetchError)
      return NextResponse.json(
        { success: false, message: 'Failed to fetch saved jobs' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Saved jobs error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}