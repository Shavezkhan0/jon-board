'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { PLANS, formatPrice, PlanType } from '@/lib/razorpay'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/context/AuthContext'
import ConfirmModal from '@/components/Subscription/ConfirmModal'
import SuccessScreen from '@/components/Subscription/SuccessScreen'

interface PricingSectionProps {
  user: any
  isActive: boolean
  subscription: any
}

export default function PricingSection({ user, isActive, subscription }: PricingSectionProps) {
  const router = useRouter()
  const { toast, refreshUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPricing, setShowPricing] = useState(!isActive)
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  // Test subscription state
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [testLoading, setTestLoading] = useState(false)
  const [subscriptionData, setSubscriptionData] = useState<any>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState('')

  const calculateDaysRemaining = (expiryDate: string) => {
    const now = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  }

  const calculateProgress = (totalDays: number, daysRemaining: number) => {
    return ((totalDays - daysRemaining) / totalDays) * 100
  }

  const handleSelectPlan = (planId: PlanType) => {
    setSelectedPlan(planId)
    setShowModal(true)
    setError('')
  }

  const handleConfirmSubscription = async () => {
    if (!selectedPlan) return

    setTestLoading(true)
    setError('')

    try {
      const res = await fetch('/api/payment/test-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to activate subscription')
        setTestLoading(false)
        return
      }

      // Success!
      setShowModal(false)
      setSubscriptionData(data.subscription)
      setShowSuccess(true)
      setSelectedPlan(null)

      toast('🎉 Subscription Activated!', 'success')

      // Refresh user state immediately
      await refreshUser()

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
    } catch (err) {
      console.error('Test subscription error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setTestLoading(false)
    }
  }

  const handleCancelModal = () => {
    setShowModal(false)
    setSelectedPlan(null)
    setTestLoading(false)
  }

  const faqs = [
    {
      question: 'Can I cancel anytime?',
      answer:
        'Yes, you can cancel your subscription anytime. Your access will continue until the end of your current billing period.',
    },
    {
      question: 'What happens when I activate a test subscription?',
      answer:
        'You get full access to all premium features immediately. No actual payment is processed - this is for testing purposes only.',
    },
    {
      question: 'How long does the test subscription last?',
      answer:
        'Test subscriptions last for the full duration of your selected plan (30 days for Monthly, 90 days for Quarterly, 365 days for Yearly).',
    },
    {
      question: 'Can I change my plan later?',
      answer:
        'Yes! You can upgrade or downgrade your plan at any time. The new plan will take effect after your current billing period ends.',
    },
    {
      question: 'What happens to my saved jobs if I cancel?',
      answer:
        "Your saved jobs remain in your account. If you reactivate your subscription later, you'll regain access to all your saved positions.",
    },
  ]

  if (showSuccess && subscriptionData) {
    return <SuccessScreen subscription={subscriptionData} onClose={() => setShowSuccess(false)} />
  }

  if (isActive && subscription && !showPricing) {
    const daysRemaining = calculateDaysRemaining(subscription.expiresAt)
    const plan = PLANS[subscription.plan as PlanType]
    const progress = calculateProgress(plan.duration, daysRemaining)

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Active Subscription</h1>
            <p className="text-xl text-slate-600">You have full access to all premium features</p>
          </div>

          {/* Active Subscription Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-2">
                  {plan.name.toUpperCase()}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {formatPrice(plan.amount)}/{plan.name.toLowerCase().slice(0, -2)}
                </h2>
                <p className="text-slate-600">
                  Expires on{' '}
                  {new Date(subscription.expiresAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="mt-6 sm:mt-0">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#10b981"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (progress / 100)}`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">{daysRemaining}</div>
                      <div className="text-xs text-slate-500">days left</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowPricing(true)}
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
              >
                Renew Early
              </button>
              <button
                onClick={() => router.push('/jobs')}
                className="flex-1 bg-slate-100 text-slate-700 py-3 px-6 rounded-lg font-medium hover:bg-slate-200 transition-colors duration-200"
              >
                Go to Jobs
              </button>
            </div>
          </div>

          {/* Features List */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Your Premium Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Unlimited job browsing',
                'Advanced search & filters',
                'Save unlimited jobs',
                'Email job alerts',
                'Direct apply links',
                'Profile management',
              ].map((feature, index) => (
                <div key={index} className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showModal}
        plan={selectedPlan}
        planDetails={selectedPlan ? PLANS[selectedPlan] : null}
        onConfirm={handleConfirmSubscription}
        onCancel={handleCancelModal}
        isLoading={testLoading}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
        {/* Header */}
        <div className="text-center py-12 px-4">
          <h1 className="text-5xl font-bold text-white mb-4">Choose Your Perfect Plan</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Unlock unlimited job searches and premium features to land your dream job faster.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Monthly Plan */}
            <div className="relative">
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 hover:transform hover:scale-105 transition-all duration-300">
                <div className="text-center mb-8">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300 mb-4">
                    Flexible
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">Monthly</h3>
                  <div className="text-4xl font-bold text-white mb-2">
                    {formatPrice(PLANS.monthly.amount)}
                  </div>
                  <p className="text-slate-400">per month</p>
                  <p className="text-slate-500 text-sm mt-1">30 days access</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    'All job listings access',
                    'Advanced filters',
                    'Save unlimited jobs',
                    'Direct apply links',
                    'Email job alerts',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-indigo-400 mr-3 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan('monthly')}
                  disabled={loading}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Get Started →
                </button>
              </div>
            </div>

            {/* Quarterly Plan - Most Popular */}
            <div className="relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-lg">
                  ⭐ Most Popular
                </span>
              </div>
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl border border-indigo-500 ring-2 ring-indigo-500 p-8 hover:transform hover:scale-105 transition-all duration-300 shadow-2xl">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Quarterly</h3>
                  <div className="text-4xl font-bold text-white mb-2">
                    {formatPrice(PLANS.quarterly.amount)}
                  </div>
                  <p className="text-indigo-200 mb-2">per quarter</p>
                  <p className="text-sm text-indigo-300">
                    ₹{Math.round(PLANS.quarterly.amount / 3)}/month
                  </p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white mt-3">
                    Save 13%
                  </span>
                  <p className="text-slate-400">90 days access</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    'Everything in Monthly',
                    'Priority job alerts',
                    'Advanced profile visibility',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-400 mr-3 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-white">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan('quarterly')}
                  disabled={loading}
                  className="w-full bg-white text-indigo-600 py-3 px-4 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
                >
                  Get Started →
                </button>
              </div>
            </div>

            {/* Yearly Plan - Best Value */}
            <div className="relative">
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 hover:transform hover:scale-105 transition-all duration-300">
                <div className="text-center mb-8">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-600 text-white mb-4">
                    Best Value
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">Yearly</h3>
                  <div className="text-4xl font-bold text-white mb-2">
                    {formatPrice(PLANS.yearly.amount)}
                  </div>
                  <p className="text-slate-400 mb-2">per year</p>
                  <p className="text-sm text-slate-300">
                    ₹{Math.round(PLANS.yearly.amount / 12)}/month
                  </p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white mt-3">
                    Save 33%
                  </span>
                  <p className="text-slate-400">365 days access</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    'Everything in Quarterly',
                    'Priority email support',
                    'Resume review credits',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-purple-400 mr-3 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan('yearly')}
                  disabled={loading}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Get Started →
                </button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center">
                <p className="text-red-400 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Test Mode Notice */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center space-x-2 bg-slate-800 rounded-lg px-6 py-4 border border-slate-700">
              <span className="text-yellow-500 font-medium">
                🧪 Test Mode — No payment required
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-4">
              All subscriptions are activated instantly without payment processing for testing
              purposes.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
