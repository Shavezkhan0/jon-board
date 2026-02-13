import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import SubscriptionClient from '@/components/Dashboard/SubscriptionPanel'

async function getCurrentUser() {
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

async function getSubscriptionStatus() {
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

export default async function SubscriptionPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const subscriptionStatus = await getSubscriptionStatus()

  return <SubscriptionClient subscriptionStatus={subscriptionStatus} />
}