// Job Types
export interface Job {
  id: string
  title: string
  slug: string
  company: string
  companyLogo?: {
    id: string
    url: string
    filename: string
    alt: string
  }
  companyWebsite?: string
  location: string
  isRemote: boolean
  jobType: 'full-time' | 'part-time' | 'remote' | 'freelance' | 'internship' | 'contract'
  category: 'technology' | 'marketing' | 'design' | 'finance' | 'sales' | 'healthcare' | 'education' | 'legal' | 'operations' | 'other'
  experienceLevel: 'fresher' | 'junior' | 'mid-level' | 'senior' | 'lead' | 'manager'
  salaryMin?: number
  salaryMax?: number
  salaryCurrency: 'INR' | 'USD'
  description: any // PayloadCMS rich text
  requirements: any // PayloadCMS rich text
  niceToHave?: any // PayloadCMS rich text
  applyLink: string
  applyEmail?: string
  skills: Array<{ skill: string }>
  benefits: Array<{ benefit: string }>
  isActive: boolean
  isFeatured: boolean
  isUrgent: boolean
  viewCount: number
  applicationCount: number
  expiresAt: string
  postedAt: string
  createdAt: string
  updatedAt: string
}

export interface JobsResponse {
  docs: Job[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

// User Types
export interface User {
  id: string
  email: string
  fullName: string
  phone?: string
  profilePhoto?: {
    id: string
    url: string
    filename: string
    alt: string
  }
  resumeUrl?: string
  skills: Array<{ skill: string }>
  currentJobTitle?: string
  linkedinUrl?: string
  bio?: string
  subscriptionStatus: 'none' | 'active' | 'expired' | 'cancelled'
  subscriptionExpiry?: string
  subscriptionPlan?: 'monthly' | 'quarterly' | 'yearly'
  razorpayOrderId?: string
  razorpayPaymentId?: string
  totalPaid: number
  createdAt: string
  updatedAt: string
}

// Saved Job Type
export interface SavedJob {
  id: string
  user: string | User
  job: string | Job
  savedAt: string
}

// Filter Types
export interface JobFilters {
  search?: string
  category?: string
  jobType?: string
  experienceLevel?: string
  location?: string
  salaryMin?: number
  salaryMax?: number
}

export interface JobTypeOption {
  value: string
  label: string
  color: string
}

export interface CategoryOption {
  value: string
  label: string
}

export interface ExperienceLevelOption {
  value: string
  label: string
}

// Pagination Type
export interface PaginationProps {
  currentPage: number
  totalPages: number
  totalJobs: number
  onPageChange: (page: number) => void
}

// Dashboard Types
export interface DashboardPageProps {
  user: User
  subscriptionStatus: {
    status: 'none' | 'active' | 'expired' | 'cancelled'
    plan: 'monthly' | 'quarterly' | 'yearly' | null
    expiryDate: string | null
    daysRemaining: number
    isActive: boolean
  }
  savedJobsCount: number
  searchParams: { [key: string]: string | string[] | undefined }
}