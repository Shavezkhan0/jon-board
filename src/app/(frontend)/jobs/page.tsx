import { getCurrentUser, isSubscriptionActive } from '@/lib/auth'
import { JobFilters, JobsResponse, User } from '@/types'
import JobsPageClient from '@/components/Jobs/JobsPageClient'

interface JobsPageProps {
  searchParams: {
    search?: string
    category?: string
    jobType?: string
    experienceLevel?: string
    location?: string
    page?: string
    sort?: string
  }
}

// Build where query for PayloadCMS API
function buildWhereQuery(searchParams: JobsPageProps['searchParams']) {
  const where: any = {
    isActive: { equals: true },
  }

  // Add date filter for expired jobs
  where.expiresAt = { greater_than: new Date().toISOString() }

  if (searchParams.search) {
    where.or = [
      { title: { like: searchParams.search } },
      { company: { like: searchParams.search } },
      { description: { like: searchParams.search } },
    ]
  }

  if (searchParams.category) {
    where.category = { equals: searchParams.category }
  }

  if (searchParams.jobType) {
    where.jobType = { equals: searchParams.jobType }
  }

  if (searchParams.experienceLevel) {
    where.experienceLevel = { equals: searchParams.experienceLevel }
  }

  if (searchParams.location) {
    where.location = { like: searchParams.location }
  }

  return where
}

// Build sort query
function buildSortQuery(sort?: string) {
  switch (sort) {
    case 'oldest':
      return 'postedAt'
    case 'salary-high':
      return '-salaryMax'
    case 'salary-low':
      return 'salaryMax'
    default:
      return '-postedAt' // newest
  }
}

async function fetchJobs(searchParams: JobsPageProps['searchParams']): Promise<JobsResponse> {
  const page = parseInt(searchParams.page || '1', 10)
  const limit = 12
  const where = buildWhereQuery(searchParams)
  const sort = buildSortQuery(searchParams.sort)

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const queryString = new URLSearchParams({
    where: JSON.stringify(where),
    sort,
    limit: limit.toString(),
    page: page.toString(),
    depth: '1',
  }).toString()

  try {
    const response = await fetch(`${baseUrl}/api/jobs?${queryString}`, {
      cache: 'no-store', // Disable caching for fresh data
    })

    if (!response.ok) {
      throw new Error('Failed to fetch jobs')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching jobs:', error)
    // Return empty response on error
    return {
      docs: [],
      totalDocs: 0,
      limit,
      totalPages: 0,
      page,
      pagingCounter: 0,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    }
  }
}

export default async function JobsPage(props: { searchParams: Promise<JobsPageProps['searchParams']> }) {
  // Await searchParams per Next.js 15 requirements
  const searchParams = await props.searchParams

  // Get current user and subscription status
  let user: User | null = null
  let isSubscribed = false

  try {
    user = await getCurrentUser()
    isSubscribed = user ? isSubscriptionActive(user) : false
  } catch (error) {
    console.error('Error checking authentication:', error)
  }

  // Fetch jobs
  const jobsData = await fetchJobs(searchParams)

  // Extract saved job IDs if user is authenticated
  let savedJobIds: string[] = []
  if (user) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const savedJobsResponse = await fetch(
        `${baseUrl}/api/jobs/saved`,
        {
          cache: 'no-store',
          credentials: 'include',
        }
      )

      if (savedJobsResponse.ok) {
        const savedJobsData = await savedJobsResponse.json()
        savedJobIds = savedJobsData.savedJobs?.map((saved: any) =>
          typeof saved.job === 'string' ? saved.job : saved.job.id
        ) || []
      }
    } catch (error) {
      console.error('Error fetching saved jobs:', error)
    }
  }

  // Build filters object for client component
  const filters: JobFilters = {
    search: searchParams.search,
    category: searchParams.category,
    jobType: searchParams.jobType,
    experienceLevel: searchParams.experienceLevel,
    location: searchParams.location,
  }

  return (
    <JobsPageClient
      initialJobs={jobsData}
      initialFilters={filters}
      initialPage={parseInt(searchParams.page || '1', 10)}
      initialSort={searchParams.sort || 'newest'}
      user={user}
      isSubscribed={isSubscribed}
      savedJobIds={savedJobIds}
    />
  )
}

export async function generateMetadata() {
  return {
    title: 'Browse Jobs - JobBoard Pro',
    description: 'Find your dream job from thousands of listings. Filter by category, experience level, location, and more.',
    keywords: 'jobs, career, employment, job board, job search, remote jobs, tech jobs',
    openGraph: {
      title: 'Browse Jobs - JobBoard Pro',
      description: 'Find your dream job from thousands of listings',
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/jobs`,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Browse Jobs - JobBoard Pro',
      description: 'Find your dream job from thousands of listings',
    },
  }
}