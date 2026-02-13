import HeroSection from '@/components/Home/HeroSection'
import CategoriesSection from '@/components/Home/CategoriesSection'
import FeaturedJobsSection from '@/components/Home/FeaturedJobsSection'
import HowItWorksSection from '@/components/Home/HowItWorksSection'
import PricingPreviewSection from '@/components/Home/PricingPreviewSection'
import TestimonialsSection from '@/components/Home/TestimonialsSection'
import CTASection from '@/components/Home/CTASection'
import Footer from '@/components/Footer'
import type { Job, JobsResponse } from '@/types'

interface Category {
  name: string
  slug: string
  icon: string
  count: number
}

function getBaseUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return url.startsWith('http') ? url : `https://${url}`
}

async function getFeaturedJobs(): Promise<Job[]> {
  try {
    const response = await fetch(`${getBaseUrl()}/api/jobs?where[isFeatured][equals]=true&limit=6`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return []
    }

    const data: JobsResponse = await response.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching featured jobs:', error)
    return []
  }
}

async function getTotalJobsCount(): Promise<number> {
  try {
    const response = await fetch(`${getBaseUrl()}/api/jobs?limit=1`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return 0
    }

    const data: JobsResponse = await response.json()
    return data.totalDocs || 0
  } catch (error) {
    console.error('Error fetching total jobs count:', error)
    return 0
  }
}

async function getCategoriesWithCounts(): Promise<Category[]> {
  try {
    // Get all jobs to count by category
    const response = await fetch(`${getBaseUrl()}/api/jobs?limit=1000`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return getDefaultCategories()
    }

    const data: JobsResponse = await response.json()
    const jobs = data.docs || []

    // Count jobs by category
    const categoryCounts: Record<string, number> = {}
    jobs.forEach(job => {
      if (job.category) {
        categoryCounts[job.category] = (categoryCounts[job.category] || 0) + 1
      }
    })

    // Define categories with their icons
    const categories: Category[] = [
      { name: 'Technology', slug: 'technology', icon: '💻', count: categoryCounts['technology'] || 0 },
      { name: 'Design', slug: 'design', icon: '🎨', count: categoryCounts['design'] || 0 },
      { name: 'Marketing', slug: 'marketing', icon: '📈', count: categoryCounts['marketing'] || 0 },
      { name: 'Finance', slug: 'finance', icon: '💰', count: categoryCounts['finance'] || 0 },
      { name: 'Healthcare', slug: 'healthcare', icon: '🏥', count: categoryCounts['healthcare'] || 0 },
      { name: 'Education', slug: 'education', icon: '📚', count: categoryCounts['education'] || 0 },
      { name: 'Legal', slug: 'legal', icon: '⚖️', count: categoryCounts['legal'] || 0 },
      { name: 'Operations', slug: 'operations', icon: '🔧', count: categoryCounts['operations'] || 0 },
    ]

    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return getDefaultCategories()
  }
}

function getDefaultCategories(): Category[] {
  return [
    { name: 'Technology', slug: 'technology', icon: '💻', count: 45 },
    { name: 'Design', slug: 'design', icon: '🎨', count: 23 },
    { name: 'Marketing', slug: 'marketing', icon: '📈', count: 38 },
    { name: 'Finance', slug: 'finance', icon: '💰', count: 27 },
    { name: 'Healthcare', slug: 'healthcare', icon: '🏥', count: 31 },
    { name: 'Education', slug: 'education', icon: '📚', count: 19 },
    { name: 'Legal', slug: 'legal', icon: '⚖️', count: 15 },
    { name: 'Operations', slug: 'operations', icon: '🔧', count: 22 },
  ]
}

export default async function HomePage() {
  const [featuredJobs, totalJobsCount, categories] = await Promise.all([
    getFeaturedJobs(),
    getTotalJobsCount(),
    getCategoriesWithCounts(),
  ])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <HeroSection />
      <CategoriesSection categories={categories} />
      {featuredJobs.length > 0 && <FeaturedJobsSection jobs={featuredJobs} />}
      <HowItWorksSection />
      <PricingPreviewSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  )
}