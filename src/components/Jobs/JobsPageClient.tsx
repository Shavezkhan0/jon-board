'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import debounce from 'lodash/debounce'
import JobCard from './JobCard'
import PaywallOverlay from './PaywallOverlay'
import {
  Job,
  JobsResponse,
  User,
  JobFilters,
  JobTypeOption,
  CategoryOption,
  ExperienceLevelOption,
} from '@/types'
import { useToast } from '@/components/ui/Toast'

function getBaseUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return url.startsWith('http') ? url : `https://${url}`
}

// Constants for filters
const JOB_TYPES: JobTypeOption[] = [
  { value: 'full-time', label: 'Full-Time', color: 'bg-blue-100 text-blue-800' },
  { value: 'part-time', label: 'Part-Time', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'remote', label: 'Remote', color: 'bg-green-100 text-green-800' },
  { value: 'freelance', label: 'Freelance', color: 'bg-purple-100 text-purple-800' },
  { value: 'internship', label: 'Internship', color: 'bg-pink-100 text-pink-800' },
  { value: 'contract', label: 'Contract', color: 'bg-indigo-100 text-indigo-800' },
]

const CATEGORIES: CategoryOption[] = [
  { value: 'technology', label: 'Technology' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'design', label: 'Design' },
  { value: 'finance', label: 'Finance' },
  { value: 'sales', label: 'Sales' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'legal', label: 'Legal' },
  { value: 'operations', label: 'Operations' },
  { value: 'other', label: 'Other' },
]

const EXPERIENCE_LEVELS: ExperienceLevelOption[] = [
  { value: 'fresher', label: 'Fresher' },
  { value: 'junior', label: 'Junior' },
  { value: 'mid-level', label: 'Mid-Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'manager', label: 'Manager' },
]

interface JobsPageClientProps {
  initialJobs: JobsResponse
  initialFilters: JobFilters
  initialPage: number
  initialSort: string
  user: User | null
  isSubscribed: boolean
  savedJobIds: string[]
}

export default function JobsPageClient({
  initialJobs,
  initialFilters,
  initialPage,
  initialSort,
  user,
  isSubscribed,
  savedJobIds,
}: JobsPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [jobs, setJobs] = useState<JobsResponse>(initialJobs)
  const [filters, setFilters] = useState<JobFilters>(initialFilters)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [sort, setSort] = useState(initialSort)
  const [isLoading, setIsLoading] = useState(false)
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set(savedJobIds))
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Debounced search function
  const debouncedSearch = debounce((searchTerm: string) => {
    updateFilters({ ...filters, search: searchTerm })
  }, 500)

  // Update URL with new filters
  const updateURL = (newFilters: JobFilters, page: number = 1, newSort: string = sort) => {
    const params = new URLSearchParams()

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })

    if (page > 1) params.set('page', page.toString())
    if (newSort !== 'newest') params.set('sort', newSort)

    const newUrl = params.toString() ? `/jobs?${params.toString()}` : '/jobs'
    router.push(newUrl, { scroll: false })
  }

  // Update filters and fetch new jobs
  const updateFilters = async (
    newFilters: JobFilters,
    page: number = 1,
    newSort: string = sort,
  ) => {
    setFilters(newFilters)
    setCurrentPage(page)
    setSort(newSort)
    setIsLoading(true)

    try {
      const baseUrl = getBaseUrl()

      // Build where query
      const where: any = {
        isActive: { equals: true },
        expiresAt: { greater_than: new Date().toISOString() },
      }

      if (newFilters.search) {
        where.or = [
          { title: { like: newFilters.search } },
          { company: { like: newFilters.search } },
          { description: { like: newFilters.search } },
        ]
      }
      if (newFilters.category) where.category = { equals: newFilters.category }
      if (newFilters.jobType) where.jobType = { equals: newFilters.jobType }
      if (newFilters.experienceLevel) where.experienceLevel = { equals: newFilters.experienceLevel }
      if (newFilters.location) where.location = { like: newFilters.location }

      // Build sort query
      let sortQuery = '-postedAt'
      switch (newSort) {
        case 'oldest':
          sortQuery = 'postedAt'
          break
        case 'salary-high':
          sortQuery = '-salaryMax'
          break
        case 'salary-low':
          sortQuery = 'salaryMax'
          break
      }

      const queryString = new URLSearchParams({
        where: JSON.stringify(where),
        sort: sortQuery,
        limit: '12',
        page: page.toString(),
        depth: '1',
      }).toString()

      const response = await fetch(`${baseUrl}/api/jobs?${queryString}`, { cache: 'no-store' })
      const newJobs = await response.json()

      setJobs(newJobs)
      updateURL(newFilters, page, newSort)
    } catch (error) {
      console.error('Error fetching jobs:', error)
      toast('Failed to fetch jobs', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle job save toggle
  const handleSaveToggle = async (jobId: string) => {
    if (!user) {
      toast('Please login to save jobs', 'warning')
      return
    }

    if (!isSubscribed) {
      toast('Active subscription required to save jobs', 'warning')
      return
    }

    const isSaved = savedJobs.has(jobId)
    const method = isSaved ? 'DELETE' : 'POST'
    const url = isSaved ? `/api/jobs/save?jobId=${jobId}` : '/api/jobs/save'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: isSaved ? undefined : JSON.stringify({ jobId }),
      })

      const data = await response.json()

      if (data.success) {
        setSavedJobs((prev) => {
          const newSet = new Set(prev)
          if (isSaved) {
            newSet.delete(jobId)
            toast('Job removed from saved', 'success')
          } else {
            newSet.add(jobId)
            toast('Job saved successfully', 'success')
          }
          return newSet
        })
      } else {
        toast(data.message || 'Failed to save job', 'error')
      }
    } catch (error) {
      console.error('Error saving job:', error)
      toast('Failed to save job', 'error')
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({})
    setCurrentPage(1)
    router.push('/jobs', { scroll: false })
  }

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some((value) => value && value !== '')

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Search jobs by title, company, or keywords..."
                defaultValue={filters.search || ''}
                onChange={(e) => debouncedSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <svg
                className="absolute left-3 top-3.5 w-5 h-5 text-slate-400"
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

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-white text-indigo-600 px-2 py-0.5 rounded-full text-xs font-medium">
                  {Object.values(filters).filter(Boolean).length}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <select
              value={sort}
              onChange={(e) => updateFilters(filters, currentPage, e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="salary-high">Salary: High to Low</option>
              <option value="salary-low">Salary: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FiltersSidebar
              filters={filters}
              onFiltersChange={updateFilters}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Jobs Grid */}
          <div className="flex-1 relative">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-slate-900">
                Showing {jobs.totalDocs} {jobs.totalDocs === 1 ? 'job' : 'jobs'}
              </h1>
            </div>

            {/* Jobs Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-white rounded-lg border border-slate-200 p-6">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-2/3 mb-4"></div>
                      <div className="flex space-x-2 mb-4">
                        <div className="h-6 bg-slate-200 rounded w-16"></div>
                        <div className="h-6 bg-slate-200 rounded w-16"></div>
                      </div>
                      <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-4/5"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.docs.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jobs.docs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={savedJobs.has(job.id)}
                    onSaveToggle={handleSaveToggle}
                    isSubscribed={isSubscribed}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-slate-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No jobs found</h3>
                <p className="text-slate-600 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {jobs.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={jobs.totalPages}
                  totalJobs={jobs.totalDocs}
                  onPageChange={(page) => updateFilters(filters, page)}
                />
              </div>
            )}

            {/* Paywall Overlay */}
            {!isSubscribed && user && <PaywallOverlay />}
          </div>
        </div>
      </div>

      {/* Mobile Filter Menu */}
      {isMobileMenuOpen && (
        <MobileFilterMenu
          filters={filters}
          onFiltersChange={(newFilters) => {
            updateFilters(newFilters)
            setIsMobileMenuOpen(false)
          }}
          onClearFilters={clearFilters}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  )
}

// Filter Sidebar Component
interface FiltersSidebarProps {
  filters: JobFilters
  onFiltersChange: (filters: JobFilters, page?: number, sort?: string) => void
  onClearFilters: () => void
}

function FiltersSidebar({ filters, onFiltersChange, onClearFilters }: FiltersSidebarProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 sticky top-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
        {Object.values(filters).some(Boolean) && (
          <button
            onClick={onClearFilters}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Job Type */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-slate-700 mb-3">Job Type</h3>
        <div className="space-y-2">
          {JOB_TYPES.map((type) => (
            <label key={type.value} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.jobType === type.value}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    jobType: e.target.checked ? type.value : undefined,
                  })
                }
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-slate-600">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Category */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-slate-700 mb-3">Category</h3>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <label key={category.value} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.category === category.value}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    category: e.target.checked ? category.value : undefined,
                  })
                }
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-slate-600">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-slate-700 mb-3">Experience Level</h3>
        <div className="space-y-2">
          {EXPERIENCE_LEVELS.map((level) => (
            <label key={level.value} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.experienceLevel === level.value}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    experienceLevel: e.target.checked ? level.value : undefined,
                  })
                }
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-slate-600">{level.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-slate-700 mb-3">Location</h3>
        <input
          type="text"
          placeholder="Enter city or state"
          value={filters.location || ''}
          onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  )
}

// Pagination Component
import { PaginationProps } from '@/types'

function Pagination({ currentPage, totalPages, totalJobs, onPageChange }: PaginationProps) {
  const pages = []
  const maxVisible = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  let endPage = Math.min(totalPages, startPage + maxVisible - 1)

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return (
    <div className="flex justify-center items-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2 text-slate-500">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            page === currentPage
              ? 'bg-indigo-600 text-white'
              : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2 text-slate-500">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  )
}

// Mobile Filter Menu Component
interface MobileFilterMenuProps {
  filters: JobFilters
  onFiltersChange: (filters: JobFilters, page?: number, sort?: string) => void
  onClearFilters: () => void
  onClose: () => void
}

function MobileFilterMenu({
  filters,
  onFiltersChange,
  onClearFilters,
  onClose,
}: MobileFilterMenuProps) {
  return (
    <div className="lg:hidden fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
        <div className="p-4 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4">
          <FiltersSidebar
            filters={filters}
            onFiltersChange={onFiltersChange}
            onClearFilters={onClearFilters}
          />

          <button
            onClick={onClose}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 mt-4"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}
