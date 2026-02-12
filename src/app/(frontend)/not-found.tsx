'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="max-w-4xl w-full text-center">
        {/* 404 Text with gradient effect */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            404
          </h1>
        </div>

        {/* Error message */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Oops! The page you're looking for seems to have vanished into the digital void.
            Don't worry, even the best job seekers get lost sometimes!
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-12 relative">
          <div className="relative w-64 h-64 mx-auto">
            {/* Lost job seeker illustration */}
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background circle */}
              <circle cx="100" cy="100" r="90" fill="#1e293b" />

              {/* Question marks */}
              <text x="50" y="80" fontSize="24" fill="#64748b" font-weight="bold">?</text>
              <text x="130" y="80" fontSize="20" fill="#475569" font-weight="bold">?</text>
              <text x="80" y="130" fontSize="28" fill="#334155" font-weight="bold">?</text>
              <text x="120" y="140" fontSize="18" fill="#64748b" font-weight="bold">?</text>

              {/* Magnifying glass */}
              <circle cx="140" cy="60" r="15" stroke="#4f46e5" strokeWidth="3" fill="none" />
              <line x="150" y="70" x2="165" y2="85" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link
            href="/"
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Go Home
          </Link>

          <Link
            href="/jobs"
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 border border-slate-700"
          >
            Browse Jobs
          </Link>
        </div>

        {/* Helpful links */}
        <div className="bg-slate-900 rounded-xl p-8 border border-slate-800">
          <h3 className="text-xl font-semibold text-white mb-6">Looking for something specific?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="space-y-3">
              <Link
                href="/jobs"
                className="flex items-center text-slate-300 hover:text-indigo-400 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A9.001 9.001 0 0112 21a9.001 9.001 0 01-9-9.255A9.001 9.001 0 0112 3a9.001 9.001 0 019 9.255z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
                Browse All Jobs
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center text-slate-300 hover:text-indigo-400 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Dashboard
              </Link>
            </div>

            <div className="space-y-3">
              <Link
                href="/subscribe"
                className="flex items-center text-slate-300 hover:text-indigo-400 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Subscription Plans
              </Link>

              <Link
                href="/help"
                className="flex items-center text-slate-300 hover:text-indigo-400 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help & Support
              </Link>
            </div>
          </div>
        </div>

        {/* Search suggestion */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 mb-4">
            Try using the search bar to find what you're looking for
          </p>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for jobs, companies, or skills..."
                className="w-full px-6 py-3 pr-12 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onFocus={(e) => {
                  // Redirect to jobs page with search query
                  window.location.href = `/jobs?search=${encodeURIComponent(e.target.value)}`
                }}
              />
              <svg
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}