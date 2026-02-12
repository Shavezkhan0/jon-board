import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import DashboardClient from './DashboardClient'
import { User, SubscriptionResponse } from '@/types'

async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      return null
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/me`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `payload-token=${token}`,
      },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.user
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

async function getSubscriptionStatus(): Promise<SubscriptionResponse> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/payment/status`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Cookie: `payload-token=${token}` }),
      },
    })

    if (!response.ok) {
      return {
        status: 'none',
        plan: null,
        expiryDate: null,
        daysRemaining: 0,
        isActive: false,
      }
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching subscription status:', error)
    return {
      status: 'none',
      plan: null,
      expiryDate: null,
      daysRemaining: 0,
      isActive: false,
    }
  }
}

async function getSavedJobsCount(): Promise<number> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/saved`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Cookie: `payload-token=${token}` }),
      },
    })

    if (!response.ok) {
      return 0
    }

    const data = await response.json()
    return data.total || 0
  } catch (error) {
    console.error('Error fetching saved jobs count:', error)
    return 0
  }
}

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const resolvedSearchParams = await searchParams
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const [subscriptionStatus, savedJobsCount] = await Promise.all([
    getSubscriptionStatus(),
    getSavedJobsCount(),
  ])

  return (
    <DashboardClient
      user={user}
      subscriptionStatus={subscriptionStatus}
      savedJobsCount={savedJobsCount}
      searchParams={resolvedSearchParams}
    />
  )
}
