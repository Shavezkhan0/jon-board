import { notFound, redirect } from 'next/navigation'
import { getCurrentUser, isSubscriptionActive } from '@/lib/auth'
import { Job, User } from '@/types'
import JobDetailClient from '@/components/Jobs/JobDetailClient'

interface JobDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

function getBaseUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return url.startsWith('http') ? url : `https://${url}`
}

async function getJob(slug: string): Promise<Job | null> {
  const baseUrl = getBaseUrl()

  try {
    const response = await fetch(`${baseUrl}/api/jobs?where[slug][equals]=${slug}&depth=1`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch job')
    }

    const data = await response.json()
    return data.docs.length > 0 ? data.docs[0] : null
  } catch (error) {
    console.error('Error fetching job:', error)
    return null
  }
}

async function getRelatedJobs(category: string, currentJobId: string): Promise<Job[]> {
  const baseUrl = getBaseUrl()

  try {
    const where = {
      category: { equals: category },
      isActive: { equals: true },
      expiresAt: { greater_than: new Date().toISOString() },
      id: { not_equals: currentJobId },
    }

    const response = await fetch(
      `${baseUrl}/api/jobs?where=${JSON.stringify(where)}&sort=-postedAt&limit=3&depth=1`,
      { cache: 'no-store' },
    )

    if (!response.ok) {
      throw new Error('Failed to fetch related jobs')
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching related jobs:', error)
    return []
  }
}

async function incrementViewCount(jobId: string) {
  const baseUrl = getBaseUrl()

  try {
    await fetch(`${baseUrl}/api/jobs/${jobId}/view`, {
      method: 'POST',
      cache: 'no-store',
    })
  } catch (error) {
    console.error('Error incrementing view count:', error)
  }
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params
  // Get current user and check subscription
  let user: User | null = null
  let isSubscribed = false

  try {
    user = await getCurrentUser()
    isSubscribed = user ? isSubscriptionActive(user) : false
  } catch (error) {
    console.error('Error checking authentication:', error)
  }

  // Redirect to subscribe if not subscribed and trying to access job details
  if (user && !isSubscribed) {
    redirect('/subscribe')
  }

  // Fetch job
  const job = await getJob(slug)

  if (!job) {
    notFound()
  }

  // Check if job is active and not expired
  if (!job.isActive || (job.expiresAt && new Date(job.expiresAt) < new Date())) {
    notFound()
  }

  // Increment view count
  await incrementViewCount(job.id)

  // Get related jobs
  const relatedJobs = await getRelatedJobs(job.category, job.id)

  // Check if job is saved
  let isSaved = false
  if (user) {
    try {
      const baseUrl = getBaseUrl()
      const savedJobsResponse = await fetch(`${baseUrl}/api/jobs/saved`, {
        cache: 'no-store',
        credentials: 'include',
      })

      if (savedJobsResponse.ok) {
        const savedJobsData = await savedJobsResponse.json()
        isSaved =
          savedJobsData.savedJobs?.some(
            (saved: any) => (typeof saved.job === 'string' ? saved.job : saved.job.id) === job.id,
          ) || false
      }
    } catch (error) {
      console.error('Error checking saved status:', error)
    }
  }

  return (
    <JobDetailClient
      job={job}
      user={user}
      isSubscribed={isSubscribed}
      isSaved={isSaved}
      relatedJobs={relatedJobs}
    />
  )
}

export async function generateMetadata({ params }: JobDetailPageProps) {
  const { slug } = await params
  const baseUrl = getBaseUrl()
  const job = await getJob(slug)

  if (!job) {
    return {
      title: 'Job Not Found',
      description: 'The requested job could not be found.',
    }
  }

  const title = `${job.title} at ${job.company} - JobBoard Pro`
  const description = `Apply for ${job.title} position at ${job.company} in ${job.location}. ${job.experienceLevel.replace('-', ' ')} level, ${job.jobType.replace('-', ' ')} role.`

  return {
    title,
    description,
    keywords: [
      job.title,
      job.company,
      job.location,
      job.category,
      job.jobType,
      job.experienceLevel,
      'job application',
      'career',
    ].join(', '),
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${baseUrl}/jobs/${job.slug}`,
      images: job.companyLogo ? [job.companyLogo.url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: job.companyLogo ? [job.companyLogo.url] : [],
    },
    alternates: {
      canonical: `${baseUrl}/jobs/${job.slug}`,
    },
  }
}
