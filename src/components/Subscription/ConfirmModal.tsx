'use client'

import { useEffect } from 'react'
import { ShoppingCart, X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  plan: 'monthly' | 'quarterly' | 'yearly' | null
  planDetails: {
    name: string
    amount: number
    duration: number
  } | null
  onConfirm: () => void
  onCancel: () => void
  isLoading: boolean
}

export default function ConfirmModal({
  isOpen,
  plan,
  planDetails,
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmModalProps) {
  if (!isOpen || !plan || !planDetails) return null

  // Calculate expiry date
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + planDetails.duration)
  const formattedExpiry = expiryDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(planDetails.amount / 100)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full mx-4
                   transform transition-all duration-300 scale-100 opacity-100"
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          disabled={isLoading}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart size={32} className="text-white" />
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Confirm Subscription</h2>
          <p className="text-slate-400 text-sm">You are about to activate:</p>
        </div>

        {/* Plan Summary Card */}
        <div className="bg-slate-800 rounded-xl p-4 my-4">
          <div className="text-white font-semibold text-lg mb-2">{planDetails.name}</div>
          <div className="text-indigo-400 text-3xl font-bold mb-1">{formattedAmount}</div>
          <div className="text-slate-400 text-sm mb-3">{planDetails.duration} days access</div>
          <div className="text-slate-500 text-xs">Access until: {formattedExpiry}</div>
        </div>

        {/* Features List */}
        <div className="mb-6">
          <div className="space-y-2">
            <div className="flex items-center text-green-400 text-sm">
              <span className="mr-2">✅</span>
              <span className="text-slate-300">Access to all job listings</span>
            </div>
            <div className="flex items-center text-green-400 text-sm">
              <span className="mr-2">✅</span>
              <span className="text-slate-300">Advanced search & filters</span>
            </div>
            <div className="flex items-center text-green-400 text-sm">
              <span className="mr-2">✅</span>
              <span className="text-slate-300">Save unlimited jobs</span>
            </div>
            <div className="flex items-center text-green-400 text-sm">
              <span className="mr-2">✅</span>
              <span className="text-slate-300">Direct apply to jobs</span>
            </div>
            <div className="flex items-center text-green-400 text-sm">
              <span className="mr-2">✅</span>
              <span className="text-slate-300">Email job alerts</span>
            </div>
          </div>
        </div>

        {/* Test Mode Banner */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mt-4">
          <div className="text-yellow-400 font-semibold text-sm mb-1">🧪 Test Mode</div>
          <div className="text-yellow-300/70 text-xs">
            No actual payment will be processed. This is for testing only.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white 
                     py-3 px-4 rounded-xl font-medium transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white 
                     py-3 px-4 rounded-xl font-medium transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed 
                     flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Activating...
              </>
            ) : (
              <>Activate Subscription ✨</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
