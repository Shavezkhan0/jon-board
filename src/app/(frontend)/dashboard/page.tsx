import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'
import { User, SubscriptionResponse } from '@/types'

interface DashboardPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/me`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/payment/status`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/saved`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
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

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
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
      searchParams={searchParams}
    />
  )
}