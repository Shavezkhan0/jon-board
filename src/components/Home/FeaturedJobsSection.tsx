'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import JobCard from '@/components/Jobs/JobCard'
import type { Job } from '@/types'

interface FeaturedJobsSectionProps {
  jobs: Job[]
}

export default function FeaturedJobsSection({ jobs }: FeaturedJobsSectionProps) {
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Mock subscription state - in real app this would come from auth context
  const [isSubscribed] = useState(true)
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const handleSaveToggle = (jobId: string) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(jobId)) {
        newSet.delete(jobId)
      } else {
        newSet.add(jobId)
      }
      return newSet
    })
  }

  if (!jobs || jobs.length === 0) {
    return null
  }

  return (
    <div
      ref={sectionRef}
      className="py-20 bg-slate-950"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section heading */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured Opportunities
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Hand-picked positions from top companies looking for talent like you
          </p>
        </div>

        {/* Jobs grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {jobs.map((job, index) => (
            <div
              key={job.id}
              className={`transition-all duration-700 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{
                transitionDelay: `${index * 150}ms`,
              }}
            >
              <JobCard
                job={job}
                isSaved={savedJobs.has(job.id)}
                onSaveToggle={handleSaveToggle}
                isSubscribed={isSubscribed}
              />
            </div>
          ))}
        </div>

        {/* View all jobs button */}
        <div className={`text-center transition-all duration-1000 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
             style={{ transitionDelay: `${jobs.length * 150}ms` }}>
          <button
            onClick={() => router.push('/jobs')}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            View All Jobs
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}