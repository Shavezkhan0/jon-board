'use client'

import Link from 'next/link'

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-xl text-slate-600">
            We couldn't process your payment
          </p>
        </div>

        {/* Error Details Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800 mb-4">
              ⚠️ Payment Issue
            </div>
            
            <p className="text-slate-600 mb-6">
              Don't worry, your account wasn't charged. This could be due to:
            </p>

            <ul className="text-left text-slate-700 space-y-3 mb-6">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>Insufficient funds or daily transaction limit reached</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>Payment method declined by your bank</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>Network connectivity issues</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>Timeout during payment processing</span>
              </li>
            </ul>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-amber-900 mb-2">What to do now?</h3>
              <ol className="text-sm text-amber-800 space-y-1 text-left">
                <li>1. Check your payment method details</li>
                <li>2. Ensure you have sufficient funds</li>
                <li>3. Try a different payment method</li>
                <li>4. Contact your bank if the issue persists</li>
              </ol>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/subscribe"
              className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 text-center"
            >
              Try Again
            </Link>
            <button
              onClick={() => window.open('mailto:support@jobboard.com?subject=Payment Issue - Help Needed', '_blank')}
              className="flex-1 bg-slate-100 text-slate-700 py-3 px-6 rounded-lg font-medium hover:bg-slate-200 transition-colors duration-200"
            >
              Contact Support
            </button>
          </div>
        </div>

        {/* Additional Help */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-3">Need Help?</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center text-slate-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Email: support@jobboard.com</span>
            </div>
            <div className="flex items-center text-slate-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Support Hours: 9 AM - 6 PM IST</span>
            </div>
            <div className="flex items-center text-slate-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Most issues are resolved within 24 hours</span>
            </div>
          </div>
        </div>

        {/* Security Assurance */}
        <div className="text-center mt-6 text-slate-500 text-sm">
          <div className="inline-flex items-center space-x-2 bg-slate-100 rounded-lg px-4 py-2 border border-slate-200">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Your payment information is secure and was not charged</span>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-600"></div>
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

export async function generateMetadata() {
  return {
    title: 'Payment Failed - JobBoard Pro',
    description: 'Payment could not be processed. Try again or contact support for assistance.',
    keywords: 'payment failed, payment issue, subscription error',
    noindex: true, // Prevent indexing of error pages
  }
}