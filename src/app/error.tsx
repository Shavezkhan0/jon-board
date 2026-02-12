'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="max-w-4xl w-full text-center">
        {/* Error illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse"></div>
            <div className="relative flex items-center justify-center w-full h-full">
              <svg
                className="w-16 h-16 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Error message */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Something went wrong
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-4">
            We're sorry, but something unexpected happened. Our team has been notified
            and is working to fix this issue.
          </p>
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm font-mono">
                Error: {error.message}
              </p>
              {error.digest && (
                <p className="text-red-400 text-sm font-mono mt-2">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={reset}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Try Again
          </button>
          
          <Link
            href="/"
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 border border-slate-700"
          >
            Go Home
          </Link>
        </div>

        {/* Helpful resources */}
        <div className="bg-slate-900 rounded-xl p-8 border border-slate-800">
          <h3 className="text-xl font-semibold text-white mb-6">What can you do now?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Refresh the page</h4>
                  <p className="text-slate-400 text-sm">Sometimes a simple refresh is all you need</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Try again later</h4>
                  <p className="text-slate-400 text-sm">Wait a few minutes and try again</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Contact support</h4>
                  <p className="text-slate-400 text-sm">Reach out to our support team for help</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-1">Check status</h4>
                  <p className="text-slate-400 text-sm">Visit our status page for system updates</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report error */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 mb-4">
            Error ID: {error.digest || 'unknown'}
          </p>
          <Link
            href="/help"
            className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Report this issue
          </Link>
        </div>
      </div>
    </div>
  )
}