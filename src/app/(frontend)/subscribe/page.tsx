import { redirect } from 'next/navigation'
import { getCurrentUser, isSubscriptionActive } from '@/lib/auth'
import PricingSection from '@/components/Subscription/PricingSection'

export default async function SubscribePage() {
  // Get current user
  const user = await getCurrentUser()
  
  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login?redirect=/subscribe')
  }

  // Check subscription status
  const isActive = isSubscriptionActive(user)
  let subscription = null

  if (isActive) {
    // Get subscription details if active
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const response = await fetch(`${baseUrl}/api/payment/status`, {
        cache: 'no-store',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        subscription = data
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error)
    }
  }

  return (
    <PricingSection 
      user={user} 
      isActive={isActive} 
      subscription={subscription} 
    />
  )
}

export async function generateMetadata() {
  return {
    title: 'Subscribe - JobBoard Pro',
    description: 'Choose the perfect subscription plan to unlock unlimited job searches, saved positions, and advanced features on JobBoard Pro.',
    keywords: 'subscription, pricing, job board premium, job search, career',
    openGraph: {
      title: 'Subscribe - JobBoard Pro',
      description: 'Choose the perfect subscription plan to unlock unlimited job searches and advanced features',
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe`,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Subscribe - JobBoard Pro',
      description: 'Choose the perfect subscription plan to unlock unlimited job searches and advanced features',
    },
  }
}