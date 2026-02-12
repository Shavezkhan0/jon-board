'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Search, Bookmark, Bell, Rocket } from 'lucide-react'

interface SuccessScreenProps {
  subscription: {
    planName: string
    amount: number
    expiresAt: string
    orderId: string
    daysTotal: number
  }
  onClose: () => void
}

export default function SuccessScreen({ subscription, onClose }: SuccessScreenProps) {
  const router = useRouter()

  // Format amount
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(subscription.amount / 100)

  // Format expiry date
  const expiryDate = new Date(subscription.expiresAt)
  const formattedExpiry = expiryDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const handleBrowseJobs = () => {
    router.push('/jobs')
  }

  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-lg w-full">
        {/* Animated Success Checkmark */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle size={48} className="text-white" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-6">
          <h1 className="text-white text-3xl font-bold mb-2">Subscription Activated! 🎉</h1>
          <p className="text-slate-400">Welcome to JobBoard Pro Premium</p>
        </div>

        {/* Subscription Details Card */}
        <div className="bg-slate-900 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Plan:</span>
              <p className="text-white font-medium">{subscription.planName}</p>
            </div>
            <div>
              <span className="text-slate-500">Amount:</span>
              <p className="text-white font-medium">{formattedAmount}</p>
            </div>
            <div>
              <span className="text-slate-500">Duration:</span>
              <p className="text-white font-medium">{subscription.daysTotal} days</p>
            </div>
            <div>
              <span className="text-slate-500">Valid Until:</span>
              <p className="text-white font-medium">{formattedExpiry}</p>
            </div>
            <div>
              <span className="text-slate-500">Order ID:</span>
              <p className="text-white font-medium text-xs">{subscription.orderId}</p>
            </div>
            <div>
              <span className="text-slate-500">Status:</span>
              <div className="inline-flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-green-400 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* What's Unlocked Section */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-4">You now have access to:</h3>
          <div className="space-y-3">
            <div className="flex items-center text-slate-300">
              <Search size={20} className="text-indigo-400 mr-3" />
              <span>Browse all job listings</span>
            </div>
            <div className="flex items-center text-slate-300">
              <Bookmark size={20} className="text-indigo-400 mr-3" />
              <span>Save unlimited jobs</span>
            </div>
            <div className="flex items-center text-slate-300">
              <Bell size={20} className="text-indigo-400 mr-3" />
              <span>Receive job alerts</span>
            </div>
            <div className="flex items-center text-slate-300">
              <Rocket size={20} className="text-indigo-400 mr-3" />
              <span>Direct apply to jobs</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleBrowseJobs}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white 
                     py-4 rounded-xl font-bold text-lg transition-colors
                     flex items-center justify-center"
          >
            Browse Jobs Now →
          </button>
          <button
            onClick={handleGoToDashboard}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white 
                     py-3 rounded-xl font-medium transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
