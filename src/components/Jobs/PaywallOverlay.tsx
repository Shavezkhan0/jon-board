'use client'

import Link from 'next/link'
import { PLANS, formatPrice } from '@/lib/razorpay'

export default function PaywallOverlay() {
  const hasBeenSubscribed = false // You can get this from user data if they had a subscription before

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center relative">
        {/* Lock Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Subscribe to Access All Jobs
        </h2>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          Get unlimited access to job listings, save your favorite positions, and receive priority notifications about new opportunities.
        </p>

        {/* Plan Mini Cards */}
        <div className="space-y-3 mb-8">
          {Object.entries(PLANS).map(([key, plan]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors"
            >
              <div className="text-left">
                <div className="font-medium text-slate-900">{plan.name}</div>
                {plan.savings && (
                  <div className="text-sm text-green-600">Save {plan.savings}</div>
                )}
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-900">
                  {formatPrice(plan.amount)}
                </div>
                <div className="text-xs text-slate-500">
                  {plan.duration} days
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features List */}
        <div className="text-left mb-8">
          <h3 className="font-medium text-slate-900 mb-3">What you'll get:</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Unlimited job browsing and filtering
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save unlimited jobs to your profile
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Priority access to new job listings
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Advanced job matching recommendations
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <Link
          href="/subscribe"
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 inline-block"
        >
          {hasBeenSubscribed ? 'Renew Your Subscription' : 'Subscribe Now'}
        </Link>

        {/* Cancel Option */}
        <button
          onClick={() => window.history.back()}
          className="mt-4 text-slate-500 hover:text-slate-700 text-sm transition-colors"
        >
          Maybe later
        </button>

        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600"></div>
          <svg className="absolute inset-0 w-full h-full" fill="currentColor">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 0 40 L 40 0 M 0 0 L 0 40" stroke="currentColor" strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>
    </div>
  )
}