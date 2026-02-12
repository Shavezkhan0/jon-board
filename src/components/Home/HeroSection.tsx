'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [jobsCount, setJobsCount] = useState(0)
  const [companiesCount, setCompaniesCount] = useState(0)
  const [membersCount, setMembersCount] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()
  const heroRef = useRef<HTMLDivElement>(null)

  const locations = [
    'Bangalore',
    'Mumbai',
    'Delhi',
    'Hyderabad',
    'Chennai',
    'Pune',
    'Kolkata',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
  ]

  useEffect(() => {
    setIsLoaded(true)

    // Animate counters
    const animateCounter = (target: number, setter: (value: number) => void, duration: number = 2000) => {
      let start = 0
      const increment = target / (duration / 16)
      const timer = setInterval(() => {
        start += increment
        if (start >= target) {
          setter(target)
          clearInterval(timer)
        } else {
          setter(Math.floor(start))
        }
      }, 16)
      return timer
    }

    const jobsTimer = animateCounter(500, setJobsCount)
    const companiesTimer = animateCounter(100, setCompaniesCount)
    const membersTimer = animateCounter(5000, setMembersCount)

    return () => {
      clearInterval(jobsTimer)
      clearInterval(companiesTimer)
      clearInterval(membersTimer)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (location) params.set('location', location)
    router.push(`/jobs?${params.toString()}`)
  }

  return (
    <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-purple-900/20 to-pink-900/20 animate-pulse" />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Floating job card previews (decorative) */}
      <div className="absolute left-10 top-1/4 w-72 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 transform rotate-3 opacity-20 hover:opacity-30 transition-opacity">
        <div className="w-12 h-12 bg-white/10 rounded-lg mb-4" />
        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded w-3/4" />
          <div className="h-3 bg-white/10 rounded w-1/2" />
          <div className="h-3 bg-white/10 rounded w-2/3" />
        </div>
      </div>

      <div className="absolute right-10 bottom-1/4 w-72 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 transform -rotate-3 opacity-20 hover:opacity-30 transition-opacity">
        <div className="w-12 h-12 bg-white/10 rounded-lg mb-4" />
        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded w-2/3" />
          <div className="h-3 bg-white/10 rounded w-3/4" />
          <div className="h-3 bg-white/10 rounded w-1/2" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center">
        <div className={`transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-sans">
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Find Your Dream
            </span>{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Job
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto">
            Access exclusive job listings across India with a simple subscription
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20">
              {/* Job title input */}
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-6 py-4 bg-transparent text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl"
              />

              {/* Location dropdown */}
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="px-6 py-4 bg-transparent text-white outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-900">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc.toLowerCase()} className="bg-slate-900">
                    {loc}
                  </option>
                ))}
              </select>

              {/* Search button */}
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                Search Jobs
              </button>
            </div>
          </form>

          {/* Stats bar */}
          <div className="flex flex-wrap justify-center gap-8 text-slate-300">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">{jobsCount}+</span>
              <span>Jobs</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">{companiesCount}+</span>
              <span>Companies</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">{membersCount.toLocaleString()}+</span>
              <span>Members</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center text-slate-400">
          <span className="text-sm mb-2">Scroll to explore</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-2deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(1deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}