'use client'

import Link from 'next/link'
import { Job } from '@/types'

interface JobCardProps {
  job: Job
  isSaved: boolean
  onSaveToggle: (jobId: string) => void
  isSubscribed: boolean
}

const jobTypeColors = {
  'full-time': 'bg-blue-100 text-blue-800',
  'part-time': 'bg-yellow-100 text-yellow-800',
  'remote': 'bg-green-100 text-green-800',
  'freelance': 'bg-purple-100 text-purple-800',
  'internship': 'bg-pink-100 text-pink-800',
  'contract': 'bg-indigo-100 text-indigo-800',
}

const experienceLevelColors = {
  fresher: 'bg-slate-100 text-slate-800',
  junior: 'bg-green-100 text-green-800',
  'mid-level': 'bg-blue-100 text-blue-800',
  senior: 'bg-purple-100 text-purple-800',
  lead: 'bg-orange-100 text-orange-800',
  manager: 'bg-red-100 text-red-800',
}

export default function JobCard({ job, isSaved, onSaveToggle, isSubscribed }: JobCardProps) {
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Competitive'
    if (min && max) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`
    if (min) return `₹${min.toLocaleString()}+`
    return `Up to ₹${max.toLocaleString()}`
  }

  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  const getCompanyInitials = (company: string) => {
    return company
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const isExpired = new Date(job.expiresAt) < new Date()

  return (
    <div className="group relative bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Badges */}
      <div className="absolute top-3 left-3 right-3 flex justify-between z-10">
        <div className="flex space-x-2">
          {job.isFeatured && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md">
              ⭐ Featured
            </span>
          )}
          {job.isUrgent && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white shadow-md">
              🔥 Urgent
            </span>
          )}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={() => onSaveToggle(job.id)}
        disabled={!isSubscribed}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 ${
          !isSubscribed
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : isSaved
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200'
        }`}
        title={isSubscribed ? (isSaved ? 'Remove from saved' : 'Save job') : 'Subscribe to save jobs'}
      >
        <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>

      {/* Content */}
      <Link href={`/jobs/${job.slug}`} className="block p-6">
        {/* Company Logo */}
        <div className="flex items-center mb-4">
          {job.companyLogo ? (
            <img
              src={job.companyLogo.url}
              alt={job.company}
              className="w-12 h-12 rounded-lg object-cover mr-3"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold mr-3">
              {getCompanyInitials(job.company)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-slate-600 truncate">{job.company}</p>
          </div>
        </div>

        {/* Location and Time */}
        <div className="flex items-center text-sm text-slate-500 mb-3">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{job.location}</span>
          {job.isRemote && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
              🌍 Remote
            </span>
          )}
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${jobTypeColors[job.jobType]}`}>
            {job.jobType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${experienceLevelColors[job.experienceLevel]}`}>
            {job.experienceLevel.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>

        {/* Salary */}
        <div className="text-lg font-semibold text-slate-900 mb-3">
          {formatSalary(job.salaryMin, job.salaryMax)}
          {job.salaryCurrency === 'USD' && ' USD'}
        </div>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {job.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded text-xs bg-slate-100 text-slate-700"
              >
                {skill.skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-slate-100 text-slate-500">
                +{job.skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Posted Time */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Posted {formatPostedDate(job.postedAt)}</span>
          {isExpired && (
            <span className="text-red-600 font-medium">Expired</span>
          )}
        </div>
      </Link>

      {/* Action Button */}
      <div className="px-6 pb-4 pt-2">
        <Link
          href={`/jobs/${job.slug}`}
          className="block w-full text-center bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
        >
          View Details
        </Link>
      </div>

      {/* Paywall Overlay */}
      {!isSubscribed && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-lg">
          <svg className="w-12 h-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Subscribe to View</h3>
          <p className="text-sm text-slate-600 text-center mb-4 px-4">
            Get unlimited access to job details and save your favorite positions
          </p>
          <Link
            href="/subscribe"
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
          >
            Subscribe Now
          </Link>
        </div>
      )}
    </div>
  )
}