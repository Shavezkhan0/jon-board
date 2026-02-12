'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
  name: string
  slug: string
  icon: string
  count: number
}

interface CategoriesSectionProps {
  categories: Category[]
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

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

  const handleCategoryClick = (slug: string) => {
    router.push(`/jobs?category=${slug}`)
  }

  return (
    <div
      ref={sectionRef}
      className="py-20 bg-slate-900"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section heading */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore by Category
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Find opportunities in your field of expertise
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category.slug)}
              className={`group relative p-8 bg-slate-800 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Icon */}
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                
                {/* Category name */}
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">
                  {category.name}
                </h3>
                
                {/* Job count */}
                <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                  {category.count} job{category.count !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Arrow indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  className="w-5 h-5 text-indigo-400 transform group-hover:translate-x-1 transition-transform duration-300"
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
              </div>
            </button>
          ))}
        </div>

        {/* View all categories link */}
        <div className={`text-center mt-12 transition-all duration-1000 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
             style={{ transitionDelay: `${categories.length * 100}ms` }}>
          <button
            onClick={() => router.push('/jobs')}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            View All Categories
            <svg
              className="w-5 h-5 ml-2 transform group-hover:translate-x-1"
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