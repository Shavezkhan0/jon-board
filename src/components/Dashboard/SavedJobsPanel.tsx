'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Job, SavedJob } from '@/types'
import SkeletonCard from '@/components/ui/Skeleton'

interface SavedJobsPanelProps {}

export default function SavedJobsPanel({}: SavedJobsPanelProps) {
  const [savedJobs, setSavedJobs] = useState<(SavedJob & { job: Job })[]>([])
  const [filteredJobs, setFilteredJobs] = useState<(SavedJob & { job: Job })[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null)

  const fetchSavedJobs = async () => {
    try {
      const response = await fetch('/api/jobs/saved')
      if (!response.ok) {
        throw new Error('Failed to fetch saved jobs')
      }
      const data = await response.json()
      setSavedJobs(data.docs || [])
      setFilteredJobs(data.docs || [])
    } catch (error) {
      console.error('Error fetching saved jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSavedJobs()
  }, [])

  useEffect(() => {
    const filtered = savedJobs.filter((savedJob) => {
      const job = savedJob.job as Job
      return (
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
    setFilteredJobs(filtered)
  }, [searchTerm, savedJobs])

  const handleRemoveJob = async (savedJobId: string) => {
    try {
      const response = await fetch(`/api/jobs/saved/${savedJobId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to remove saved job')
      }

      setSavedJobs(savedJobs.filter((job) => job.id !== savedJobId))
      setConfirmRemove(null)
    } catch (error) {
      console.error('Error removing saved job:', error)
    }
  }

  const getJobTypeColor = (jobType: string) => {
    const colors: Record<string, string> = {
      'full-time': 'bg-green-100 text-green-800',
      'part-time': 'bg-blue-100 text-blue-800',
      remote: 'bg-purple-100 text-purple-800',
      freelance: 'bg-orange-100 text-orange-800',
      internship: 'bg-pink-100 text-pink-800',
      contract: 'bg-yellow-100 text-yellow-800',
    }
    return colors[jobType] || 'bg-gray-100 text-gray-800'
  }

  const formatSalary = (min?: number, max?: number, currency?: string) => {
    if (!min && !max) return 'Salary not disclosed'
    const currencySymbol = currency === 'USD' ? '$' : '₹'
    if (min && max) {
      return `${currencySymbol}${min.toLocaleString()} - ${currencySymbol}${max.toLocaleString()}`
    }
    if (min) {
      return `${currencySymbol}${min.toLocaleString()}+`
    }
    return `Up to ${currencySymbol}${max?.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Saved Jobs</h1>
          <p className="text-slate-600">Jobs you've saved for later review</p>
        </div>

        {/* Search bar skeleton */}
        <div className="mb-6">
          <div className="h-10 bg-slate-200 rounded-lg animate-pulse" />
        </div>

        {/* Loading skeletons */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 w-full">
      <div className="w-full mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Saved Jobs</h1>
          <p className="text-slate-600">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
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
            <input
              type="text"
              placeholder="Search saved jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Job List */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-slate-400 mx-auto mb-4"
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
            <h3 className="text-lg font-medium text-slate-900 mb-2">No saved jobs yet</h3>
            <p className="text-slate-600 mb-6">Start browsing and save jobs that interest you</p>
            <Link
              href="/jobs"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((savedJob) => {
              const job = savedJob.job as Job
              return (
                <div
                  key={savedJob.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Company Info */}
                    <div className="flex items-start space-x-4">
                      {/* Company Logo/Initials */}
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {job.companyLogo ? (
                          <img
                            src={job.companyLogo.url}
                            alt={job.company}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-slate-600">
                            {job.company.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Job Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/jobs/${job.slug}`}
                          className="text-lg font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                        >
                          {job.title}
                        </Link>
                        <p className="text-slate-600 font-medium mb-2">{job.company}</p>

                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {job.location}
                          </div>

                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getJobTypeColor(job.jobType)}`}
                          >
                            {job.jobType.replace('-', ' ')}
                          </span>

                          <div className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                              />
                            </svg>
                            {formatSalary(
                              job.salaryMin ?? undefined,
                              job.salaryMax ?? undefined,
                              job.salaryCurrency ?? undefined,
                            )}
                          </div>

                          <div className="flex items-center text-slate-500">
                            <svg
                              className="w-4 h-4 mr-1"
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
                            Saved {formatDate(savedJob.savedAt)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/jobs/${job.slug}`}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                      >
                        View Job
                      </Link>

                      {confirmRemove === savedJob.id ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleRemoveJob(savedJob.id)}
                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmRemove(null)}
                            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmRemove(savedJob.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove from saved"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
