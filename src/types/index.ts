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
  } | null
  companyLogoUrl?: string | null
  companyLogoPublicId?: string | null
  companyWebsite?: string | null
  location: string
  workMode: 'office' | 'remote' | 'hybrid' | 'flexible'
  officeAddress?: string | null
  jobType: 'full-time' | 'part-time' | 'remote' | 'freelance' | 'internship' | 'contract'
  category:
    | 'technology'
    | 'marketing'
    | 'design'
    | 'finance'
    | 'sales'
    | 'healthcare'
    | 'education'
    | 'legal'
    | 'operations'
    | 'other'
  experienceLevel: 'fresher' | 'junior' | 'mid-level' | 'senior' | 'lead' | 'manager'
  experienceYearsMin?: number | null
  experienceYearsMax?: number | null
  salaryMin?: number | null
  salaryMax?: number | null
  salaryCurrency?: 'INR' | 'USD' | null
  description: any // PayloadCMS rich text
  requirements: any // PayloadCMS rich text
  responsibilities: any // PayloadCMS rich text
  message?: any // PayloadCMS rich text - additional notes for applicants
  niceToHave?: any // PayloadCMS rich text
  applyLink?: string | null
  applyEmail?: string | null
  hrContactName?: string | null
  hrEmail?: string | null
  hrPhone?: string | null
  acceptsReferrals?: boolean | null
  skills?: Array<{ skill: string }> | null
  benefits?: Array<{ benefit: string }> | null
  isActive?: boolean | null
  isFeatured?: boolean | null
  isUrgent?: boolean | null
  viewCount?: number | null
  applicationCount?: number | null
  expiresAt?: string | null
  postedAt?: string | null
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
  phone?: string | null
  profilePhoto?:
    | string
    | {
        id: string
        url?: string | null
        filename?: string | null
        alt: string
      }
    | null
  profilePhotoUrl?: string | null
  profilePhotoPublicId?: string | null
  resumeUrl?: string | null
  skills?: Array<{ skill: string }> | null
  currentJobTitle?: string | null
  linkedinUrl?: string | null
  bio?: string | null
  subscriptionStatus?: 'none' | 'active' | 'expired' | 'cancelled' | null
  subscriptionExpiry?: string | null
  subscriptionPlan?: 'monthly' | 'quarterly' | 'yearly' | null
  razorpayOrderId?: string | null
  razorpayPaymentId?: string | null
  totalPaid?: number | null
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
export interface SubscriptionResponse {
  status: 'none' | 'active' | 'expired' | 'cancelled'
  plan: 'monthly' | 'quarterly' | 'yearly' | null
  expiryDate: string | null
  daysRemaining: number
  isActive: boolean
  currency?: string
}

export interface DashboardPageProps {
  user: User
  subscriptionStatus: SubscriptionResponse
  savedJobsCount: number
  searchParams: { [key: string]: string | string[] | undefined }
}
