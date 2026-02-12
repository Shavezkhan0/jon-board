'use client'

import { useState, useEffect, useRef } from 'react'

interface Step {
  number: number
  icon: string
  title: string
  description: string
}

export default function HowItWorksSection() {
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const steps: Step[] = [
    {
      number: 1,
      icon: '🔐',
      title: 'Create Account',
      description: 'Sign up free in 30 seconds and unlock access to exclusive job listings',
    },
    {
      number: 2,
      icon: '💳',
      title: 'Subscribe',
      description: 'Choose a plan starting at ₹499/month to access all features',
    },
    {
      number: 3,
      icon: '🚀',
      title: 'Apply to Jobs',
      description: 'Browse and apply to hundreds of jobs from top companies across India',
    },
  ]

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

  return (
    <div
      ref={sectionRef}
      className="py-20 bg-slate-900"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section heading */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Get started in three simple steps and land your dream job
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Desktop arrow connectors */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 -translate-y-1/2">
            <div className="flex items-center justify-between px-1/4">
              <div className="flex-1 h-0.5 bg-gradient-to-r from-indigo-500 to-transparent" />
              <div className="flex-1 h-0.5 bg-gradient-to-r from-indigo-500 to-indigo-500" />
              <div className="flex-1 h-0.5 bg-gradient-to-r from-indigo-500 to-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative text-center transition-all duration-700 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{
                  transitionDelay: `${index * 200}ms`,
                }}
              >
                {/* Step number and icon */}
                <div className="relative mb-8">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-xl shadow-indigo-500/30 transform hover:scale-105 transition-transform duration-300">
                    <div className="text-4xl">{step.icon}</div>
                  </div>
                  
                  {/* Step number badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    {step.number}
                  </div>
                </div>

                {/* Step content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Mobile arrow indicator */}
                <div className="lg:hidden flex justify-center mt-8">
                  {index < steps.length - 1 && (
                    <svg
                      className="w-6 h-6 text-indigo-500 animate-bounce"
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
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA button */}
        <div className={`text-center mt-16 transition-all duration-1000 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
             style={{ transitionDelay: `${steps.length * 200}ms` }}>
          <button
            onClick={() => window.location.href = '/register'}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            Get Started Now
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