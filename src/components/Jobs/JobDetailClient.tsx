'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Job, User } from '@/types'
import RichTextRenderer from './RichTextRenderer'
import JobCard from './JobCard'
import { useToast } from '@/components/ui/Toast'

interface JobDetailClientProps {
  job: Job
  user: User | null
  isSubscribed: boolean
  isSaved: boolean
  relatedJobs: Job[]
}

const jobTypeColors = {
  'full-time': 'bg-blue-100 text-blue-800',
  'part-time': 'bg-yellow-100 text-yellow-800',
  remote: 'bg-green-100 text-green-800',
  freelance: 'bg-purple-100 text-purple-800',
  internship: 'bg-pink-100 text-pink-800',
  contract: 'bg-indigo-100 text-indigo-800',
}

const experienceLevelColors = {
  fresher: 'bg-slate-100 text-slate-800',
  junior: 'bg-green-100 text-green-800',
  'mid-level': 'bg-blue-100 text-blue-800',
  senior: 'bg-purple-100 text-purple-800',
  lead: 'bg-orange-100 text-orange-800',
  manager: 'bg-red-100 text-red-800',
}

export default function JobDetailClient({
  job,
  user,
  isSubscribed,
  isSaved,
  relatedJobs,
}: JobDetailClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const formatSalary = (min?: number, max?: number) => {
    if (min && max) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`
    if (min) return `₹${min.toLocaleString()}+`
    if (max) return `Up to ₹${max.toLocaleString()}`
    return 'Competitive'
  }

  const getCompanyInitials = (company: string) => {
    return company
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleSaveToggle = async () => {
    if (!user) {
      toast('Please login to save jobs', 'warning')
      return
    }

    setIsSaving(true)

    try {
      const method = isSaved ? 'DELETE' : 'POST'
      const url = isSaved ? `/api/jobs/save?jobId=${job.id}` : '/api/jobs/save'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: isSaved ? undefined : JSON.stringify({ jobId: job.id }),
      })

      const data = await response.json()

      if (data.success) {
        toast(isSaved ? 'Job removed from saved' : 'Job saved successfully', 'success')
        router.refresh() // Refresh to update save state
      } else {
        toast(data.message || 'Failed to save job', 'error')
      }
    } catch (error) {
      console.error('Error saving job:', error)
      toast('Failed to save job', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleShareJob = async () => {
    const url = window.location.href

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${job.title} at ${job.company}`,
          text: `Check out this ${job.jobType} position: ${job.title} at ${job.company} in ${job.location}`,
          url,
        })
      } else {
        await navigator.clipboard.writeText(url)
        toast('Job link copied to clipboard!', 'success')
      }
    } catch (error) {
      console.error('Error sharing job:', error)
      toast('Failed to share job', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-slate-500 hover:text-slate-700">
              Home
            </Link>
            <span className="text-slate-400">/</span>
            <Link href="/jobs" className="text-slate-500 hover:text-slate-700">
              Jobs
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900 font-medium truncate max-w-xs sm:max-w-none">
              {job.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Job Details */}
          <div className="flex-1">
            {/* Company Header */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo.url}
                      alt={job.company}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                      {getCompanyInitials(job.company)}
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">{job.title}</h1>
                    <h2 className="text-xl text-slate-700 mb-2">{job.company}</h2>
                    <div className="flex items-center text-slate-600">
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{job.location}</span>
                      {job.companyWebsite && (
                        <>
                          <span className="mx-2">•</span>
                          <a
                            href={job.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-700"
                          >
                            Website
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <button
                    onClick={handleSaveToggle}
                    disabled={isSaving}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      isSaved
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill={isSaved ? 'currentColor' : 'none'}
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
                    {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save Job'}
                  </button>
                  <button
                    onClick={handleShareJob}
                    className="flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors duration-200"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.432-1.342A9.001 9.001 0 0112 3c-4.474 0-8.268 2.943-9.432 7m18.864 0A9.001 9.001 0 0112 21c-4.474 0-8.268-2.943-9.432-7"
                      />
                    </svg>
                    Share
                  </button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {job.isFeatured && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                    ⭐ Featured
                  </span>
                )}
                {job.isUrgent && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500 text-white">
                    🔥 Urgent
                  </span>
                )}
                {job.isRemote && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    🌍 Remote
                  </span>
                )}
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${jobTypeColors[job.jobType]}`}
                >
                  {job.jobType.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${experienceLevelColors[job.experienceLevel]}`}
                >
                  {job.experienceLevel.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              </div>

              {/* Posted and Expiry Info */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200 text-sm text-slate-600">
                <div>
                  Posted:{' '}
                  <span className="font-medium text-slate-900">
                    {new Date(job.postedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  Expires:{' '}
                  <span className="font-medium text-slate-900">
                    {new Date(job.expiresAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <section className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Job Description</h3>
              <RichTextRenderer content={job.description} />
            </section>

            {/* Requirements */}
            <section className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Requirements</h3>
              <RichTextRenderer content={job.requirements} />
            </section>

            {/* Nice to Have */}
            {job.niceToHave && (
              <section className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Nice to Have</h3>
                <RichTextRenderer content={job.niceToHave} />
              </section>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <section className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Skills Required</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {skill.skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <section className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Benefits</h3>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-slate-700">{benefit.benefit}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Related Jobs */}
            {relatedJobs.length > 0 && (
              <section className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Related Jobs</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {relatedJobs.map((relatedJob) => (
                    <JobCard
                      key={relatedJob.id}
                      job={relatedJob}
                      isSaved={false} // We'd need to check saved status for related jobs
                      onSaveToggle={() => {}} // Placeholder
                      isSubscribed={isSubscribed}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:w-96">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Salary Card */}
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
                <h3 className="text-sm font-medium text-indigo-100 mb-2">Salary Range</h3>
                <div className="text-3xl font-bold mb-2">
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </div>
                {job.salaryCurrency === 'USD' && (
                  <div className="text-sm text-indigo-100">United States Dollar</div>
                )}
              </div>

              {/* Apply Actions */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <a
                  href={job.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 text-center mb-3"
                >
                  Apply Now
                </a>

                {job.applyEmail && (
                  <a
                    href={`mailto:${job.applyEmail}?subject=Application for ${job.title} at ${job.company}`}
                    className="block w-full bg-slate-100 text-slate-700 py-3 px-4 rounded-lg font-medium hover:bg-slate-200 transition-colors duration-200 text-center"
                  >
                    Apply via Email
                  </a>
                )}
              </div>

              {/* Job Summary */}
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Job Summary</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Job Type</dt>
                    <dd className="text-sm text-slate-900">
                      {job.jobType.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Experience Level</dt>
                    <dd className="text-sm text-slate-900">
                      {job.experienceLevel
                        .replace('-', ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Category</dt>
                    <dd className="text-sm text-slate-900 capitalize">{job.category}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Location</dt>
                    <dd className="text-sm text-slate-900">{job.location}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Posted</dt>
                    <dd className="text-sm text-slate-900">
                      {new Date(job.postedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Expires</dt>
                    <dd className="text-sm text-slate-900">
                      {new Date(job.expiresAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
