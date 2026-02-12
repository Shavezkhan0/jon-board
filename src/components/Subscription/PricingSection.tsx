'use client'

import { useState, useEffect, useRef } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { PLANS, formatPrice, PlanType } from '@/lib/razorpay'
import { User } from '@/types'
import { useToast } from '@/components/ui/Toast'

interface PricingSectionProps {
  user: User
  isActive: boolean
  subscription: any
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function PricingSection({ user, isActive, subscription }: PricingSectionProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPricing, setShowPricing] = useState(!isActive)
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const razorpayLoaded = useRef(false)

  const calculateDaysRemaining = (expiryDate: string) => {
    const now = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  }

  const calculateProgress = (totalDays: number, daysRemaining: number) => {
    return ((totalDays - daysRemaining) / totalDays) * 100
  }

  const handleSubscribe = async (planId: PlanType) => {
    if (loading) return

    setLoading(true)

    try {
      // Step 1: Create order
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ plan: planId }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Failed to create order')
      }

      // Step 2: Load Razorpay if not loaded
      if (!razorpayLoaded.current || !window.Razorpay) {
        throw new Error('Payment system is loading. Please try again.')
      }

      const plan = PLANS[planId]

      // Step 3: Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'JobBoard Pro',
        description: `${plan.name} Subscription`,
        image: '/logo.png',
        handler: async (response: any) => {
          try {
            // Step 4: Verify payment
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: planId,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              // Step 5: Success handling
              toast('🎉 Subscription Activated!', 'success')
              
              // Redirect to success page with confetti
              router.push(`/payment/success?plan=${plan.name}&expiresAt=${verifyData.expiresAt}`)
            } else {
              throw new Error(verifyData.message || 'Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            toast('Payment verification failed. Please contact support.', 'error')
          } finally {
            setLoading(false)
          }
        },
        prefill: {
          name: user.fullName,
          email: user.email,
          contact: user.phone || undefined,
        },
        theme: {
          color: '#6366f1',
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            toast('Payment cancelled', 'info')
          },
          escape: true,
          handleback: true,
          confirm_close: true,
          persist: 'nomal',
        },
        notes: {
          user_id: user.id,
          plan_type: planId,
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Subscription error:', error)
      toast(error instanceof Error ? error.message : 'Something went wrong', 'error')
      setLoading(false)
    }
  }

  const faqs = [
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription anytime. Your access will continue until the end of your current billing period.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept UPI, Visa, Mastercard, Rupay, Net Banking, and various digital wallets through Razorpay\'s secure payment gateway.'
    },
    {
      question: 'Will I get a reminder before expiry?',
      answer: 'Yes! You\'ll receive email reminders 7 days before your subscription expires so you can renew without interruption.'
    },
    {
      question: 'Is my payment secure?',
      answer: 'Absolutely! All payments are processed through Razorpay, which is PCI DSS compliant and uses industry-standard encryption.'
    },
    {
      question: 'Can I change my plan later?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. The new plan will take effect after your current billing period ends.'
    },
    {
      question: 'What happens to my saved jobs if I cancel?',
      answer: 'Your saved jobs remain in your account. If you reactivate your subscription later, you\'ll regain access to all your saved positions.'
    },
  ]

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
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                  Expires on {new Date(subscription.expiresAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              <div className="mt-6 sm:mt-0">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
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
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => {
          razorpayLoaded.current = true
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
        {/* Header */}
        <div className="text-center py-12 px-4">
          <h1 className="text-5xl font-bold text-white mb-4">
            Unlock Your Career Potential
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Choose the perfect plan to access unlimited job listings, advanced features, and land your dream job faster.
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
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-indigo-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">Access to all job listings</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-indigo-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">Advanced search & filters</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-indigo-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">Save unlimited jobs</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-indigo-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">Email job alerts</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-indigo-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">Direct apply links</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-indigo-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">Profile management</span>
                  </li>
                </ul>
                
                <button
                  onClick={() => handleSubscribe('monthly')}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Subscribe Now'
                  )}
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
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl border border-indigo-500 p-8 hover:transform hover:scale-105 transition-all duration-300 shadow-2xl">
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
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white">Everything in Monthly</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white">Priority job alerts</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white">Advanced profile visibility</span>
                  </li>
                </ul>
                
                <button
                  onClick={() => handleSubscribe('quarterly')}
                  disabled={loading}
                  className="w-full bg-white text-indigo-600 py-3 px-6 rounded-lg font-medium hover:bg-slate-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Subscribe Now'
                  )}
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
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-purple-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">Everything in Quarterly</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-purple-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">Priority email support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-purple-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">Resume review credits</span>
                  </li>
                </ul>
                
                <button
                  onClick={() => handleSubscribe('yearly')}
                  disabled={loading}
                  className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Subscribe Now'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center space-x-2 bg-slate-800 rounded-lg px-6 py-4 border border-slate-700">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-white font-medium">Secure Payment by Razorpay</span>
              <div className="flex items-center space-x-3 ml-4">
                <span className="text-2xl text-white">💳</span>
                <span className="text-2xl text-white">📱</span>
                <span className="text-2xl text-white">🏦</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-3">
              Accepts UPI, Visa, Mastercard, Rupay, Net Banking & more
            </p>
          </div>

          {/* FAQs */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-700 transition-colors duration-200"
                  >
                    <span className="text-white font-medium">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-slate-400 transform transition-transform duration-200 ${
                        expandedFAQ === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-6 py-4 border-t border-slate-700">
                      <p className="text-slate-300">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}