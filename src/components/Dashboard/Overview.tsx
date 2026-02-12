'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { User } from '@/types'

interface OverviewProps {
  user: User
  subscriptionStatus: {
    status: 'none' | 'active' | 'expired' | 'cancelled'
    plan: 'monthly' | 'quarterly' | 'yearly' | null
    expiryDate: string | null
    daysRemaining: number
    isActive: boolean
  }
  savedJobsCount: number
}

export default function Overview({ user, subscriptionStatus, savedJobsCount }: OverviewProps) {
  const router = useRouter()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getPlanName = () => {
    if (!subscriptionStatus.plan) return 'No Plan'
    return subscriptionStatus.plan.charAt(0).toUpperCase() + subscriptionStatus.plan.slice(1)
  }

  const getProgressPercentage = () => {
    if (!subscriptionStatus.expiryDate) return 0
    const expiry = new Date(subscriptionStatus.expiryDate)
    const now = new Date()
    const totalDays = 30 // Assuming 30 days for simplicity
    const daysUsed = totalDays - subscriptionStatus.daysRemaining
    return Math.min((daysUsed / totalDays) * 100, 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="p-6 w-full">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {getGreeting()}, {user.fullName.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-600">
            Welcome back to your dashboard. Here's what's happening with your job search.
          </p>
        </div>

        {/* Subscription Status Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div
            className={`p-6 ${
              subscriptionStatus.isActive
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : subscriptionStatus.status === 'expired'
                  ? 'bg-gradient-to-r from-red-500 to-rose-600'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Subscription Status</h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  subscriptionStatus.isActive
                    ? 'bg-white/20 text-white'
                    : subscriptionStatus.status === 'expired'
                      ? 'bg-white/20 text-white'
                      : 'bg-white/20 text-white'
                }`}
              >
                {getPlanName()}
              </span>
            </div>

            {subscriptionStatus.isActive ? (
              <div className="text-white">
                <div className="text-4xl font-bold mb-2">{subscriptionStatus.daysRemaining}</div>
                <div className="text-white/80 mb-4">days remaining</div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage()}%` }}
                    />
                  </div>
                </div>

                <div className="text-sm text-white/80 mb-4">
                  Expires on{' '}
                  {subscriptionStatus.expiryDate && formatDate(subscriptionStatus.expiryDate)}
                </div>

                <button
                  onClick={() => router.push('/subscribe')}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Renew Early
                </button>
              </div>
            ) : subscriptionStatus.status === 'expired' ? (
              <div className="text-white">
                <div className="text-2xl font-semibold mb-2">Subscription Expired</div>
                <div className="text-white/80 mb-4">
                  Your subscription has expired. Renew now to continue accessing all features.
                </div>
                <button
                  onClick={() => router.push('/subscribe')}
                  className="bg-white hover:bg-white/90 text-red-600 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Renew Now
                </button>
              </div>
            ) : (
              <div className="text-white">
                <div className="text-2xl font-semibold mb-2">No Active Subscription</div>
                <div className="text-white/80 mb-4">
                  Upgrade to a premium plan to unlock unlimited job applications and advanced
                  features.
                </div>
                <button
                  onClick={() => router.push('/subscribe')}
                  className="bg-white hover:bg-white/90 text-indigo-600 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  View Plans
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-slate-900">{savedJobsCount}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Saved Jobs</h3>
            <p className="text-xs text-slate-500 mt-1">Jobs you're interested in</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-slate-900">
                {subscriptionStatus.daysRemaining}
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Days Remaining</h3>
            <p className="text-xs text-slate-500 mt-1">Until subscription expires</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-900">{getPlanName()}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Plan Type</h3>
            <p className="text-xs text-slate-500 mt-1">Current subscription plan</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/jobs"
              className="flex items-center justify-center px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A9.001 9.001 0 0112 21a9.001 9.001 0 01-9-9.255A9.001 9.001 0 0112 3a9.001 9.001 0 019 9.255z"
                />
              </svg>
              Browse Jobs
            </Link>

            <button
              onClick={() => router.push('/dashboard?tab=profile')}
              className="flex items-center justify-center px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Edit Profile
            </button>

            <button
              onClick={() => router.push('/dashboard?tab=subscription')}
              className="flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              View Subscription
            </button>
          </div>
        </div>

        {/* Recent Activity - Placeholder for now */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
          <div className="text-center py-8">
            <svg
              className="w-12 h-12 text-slate-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-slate-600">No recent activity</p>
            <p className="text-sm text-slate-500 mt-1">
              Start browsing jobs to see your activity here
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
