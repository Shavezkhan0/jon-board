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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="w-full space-y-3">
      {/* Welcome Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          {getGreeting()}, {user.fullName.split(' ')[0]}! 👋
        </h1>
        <p className="text-sm text-slate-600 mt-0.5">Here's your job search summary.</p>
      </div>

      {/* Subscription Status Card */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div
          className={`p-3 ${
            subscriptionStatus.isActive
              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
              : subscriptionStatus.status === 'expired'
                ? 'bg-gradient-to-r from-red-500 to-rose-600'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600'
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Subscription Status</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
              {getPlanName()}
            </span>
          </div>

          {subscriptionStatus.isActive ? (
            <div className="text-white mt-2">
              <div className="text-2xl font-bold">{subscriptionStatus.daysRemaining}</div>
              <div className="text-xs text-white/80">days remaining</div>
              <div className="text-xs text-white/80 mt-1">
                Expires {subscriptionStatus.expiryDate && formatDate(subscriptionStatus.expiryDate)}
              </div>
              <button
                onClick={() => router.push('/subscribe')}
                className="mt-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded text-xs font-medium"
              >
                Renew Early
              </button>
            </div>
          ) : subscriptionStatus.status === 'expired' ? (
            <div className="text-white mt-2">
              <div className="text-sm font-medium mb-1">Subscription Expired</div>
              <button
                onClick={() => router.push('/subscribe')}
                className="bg-white hover:bg-white/90 text-red-600 px-3 py-1.5 rounded text-xs font-medium"
              >
                Renew Now
              </button>
            </div>
          ) : (
            <div className="text-white mt-2">
              <div className="text-sm font-medium mb-1">No Active Subscription</div>
              <button
                onClick={() => router.push('/subscribe')}
                className="bg-white hover:bg-white/90 text-indigo-600 px-3 py-1.5 rounded text-xs font-medium"
              >
                View Plans
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 bg-indigo-100 rounded-md flex items-center justify-center">
              <svg
                className="w-4 h-4 text-indigo-600"
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
            <span className="text-lg font-bold text-slate-900">{savedJobsCount}</span>
          </div>
          <p className="text-xs text-slate-600 mt-1">Saved Jobs</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
              <svg
                className="w-4 h-4 text-green-600"
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
            <span className="text-lg font-bold text-slate-900">
              {subscriptionStatus.daysRemaining}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">Days Left</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
              <svg
                className="w-4 h-4 text-purple-600"
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
            <span className="text-sm font-bold text-slate-900">{getPlanName()}</span>
          </div>
          <p className="text-xs text-slate-600 mt-1">Plan</p>
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

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3">
        <h2 className="text-sm font-semibold text-slate-900 mb-2">Recent Activity</h2>
        <div className="text-center py-4">
          <svg
            className="w-8 h-8 text-slate-400 mx-auto"
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
          <p className="text-sm text-slate-600 mt-1">No recent activity</p>
        </div>
      </div>
    </div>
  )
}
