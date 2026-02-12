'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Overview from '@/components/Dashboard/Overview'
import SavedJobsPanel from '@/components/Dashboard/SavedJobsPanel'
import ProfilePanel from '@/components/Dashboard/ProfilePanel'
import SubscriptionPanel from '@/components/Dashboard/SubscriptionPanel'
import type { User } from '@/types'

interface DashboardClientProps {
  user: User
  subscriptionStatus: {
    status: 'none' | 'active' | 'expired' | 'cancelled'
    plan: 'monthly' | 'quarterly' | 'yearly' | null
    expiryDate: string | null
    daysRemaining: number
    isActive: boolean
  }
  savedJobsCount: number
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function DashboardClient({
  user,
  subscriptionStatus,
  savedJobsCount,
  searchParams,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const tab = searchParams?.tab as string
    if (tab && ['overview', 'saved', 'profile', 'subscription'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    const newUrl = `/dashboard?tab=${tab}`
    router.push(newUrl, { scroll: false })
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'saved':
        return <SavedJobsPanel />
      case 'profile':
        return <ProfilePanel user={user} />
      case 'subscription':
        return <SubscriptionPanel subscriptionStatus={subscriptionStatus} />
      default:
        return (
          <Overview
            user={user}
            subscriptionStatus={subscriptionStatus}
            savedJobsCount={savedJobsCount}
          />
        )
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-slate-900">
        {' '}
        <div className="flex flex-col h-full">
          {/* User Info */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              {user.profilePhoto && typeof user.profilePhoto !== 'string' ? (
                <img
                  src={user.profilePhoto.url || ''}
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                  {user.fullName
                    .split(' ')
                    .map((word) => word[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.fullName}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                <div className="flex items-center mt-1">
                  <div
                    className={`w-2 h-2 rounded-full mr-1 ${
                      subscriptionStatus.isActive ? 'bg-green-400' : 'bg-red-400'
                    }`}
                  />
                  <span className="text-xs text-slate-400">
                    {subscriptionStatus.status === 'active'
                      ? 'Active'
                      : subscriptionStatus.status === 'expired'
                        ? 'Expired'
                        : 'No Subscription'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
              { id: 'saved', label: 'Saved Jobs', icon: 'Bookmark' },
              { id: 'profile', label: 'My Profile', icon: 'User' },
              { id: 'subscription', label: 'Subscription', icon: 'CreditCard' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <svg
                  className={`w-5 h-5 mr-3 ${
                    activeTab === item.id ? 'text-white' : 'text-slate-400'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {item.icon === 'LayoutDashboard' && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                  {item.icon === 'Bookmark' && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  )}
                  {item.icon === 'User' && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  )}
                  {item.icon === 'CreditCard' && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  )}
                </svg>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-slate-800">
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-400 rounded-lg hover:bg-red-900/20 hover:text-red-300 transition-colors"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-hidden bg-slate-50">
        <div className="h-full w-full overflow-y-auto">{renderContent()}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
        <div className="grid grid-cols-5 h-16">
          {[
            { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
            { id: 'browse', label: 'Browse', icon: 'Briefcase' },
            { id: 'saved', label: 'Saved', icon: 'Bookmark' },
            { id: 'profile', label: 'Profile', icon: 'User' },
            { id: 'subscription', label: 'Plan', icon: 'CreditCard' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'browse') {
                  router.push('/jobs')
                } else {
                  handleTabChange(item.id)
                }
              }}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                activeTab === item.id ? 'text-indigo-600' : 'text-slate-600'
              }`}
            >
              <svg
                className={`w-5 h-5 ${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {item.icon === 'LayoutDashboard' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
                {item.icon === 'Briefcase' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A9.001 9.001 0 0112 21a9.001 9.001 0 01-9-9.255A9.001 9.001 0 0112 3a9.001 9.001 0 019 9.255z"
                  />
                )}
                {item.icon === 'Bookmark' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                )}
                {item.icon === 'User' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                )}
                {item.icon === 'CreditCard' && (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                )}
              </svg>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
