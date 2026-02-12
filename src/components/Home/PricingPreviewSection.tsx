'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface PricingPlan {
  name: string
  price: string
  period: string
  features: string[]
  popular?: boolean
}

export default function PricingPreviewSection() {
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const plans: PricingPlan[] = [
    {
      name: 'Starter',
      price: '₹499',
      period: 'per month',
      features: [
        'Access to 50+ job listings',
        'Basic profile visibility',
        'Email notifications',
        'Mobile app access',
        'Basic search filters',
      ],
    },
    {
      name: 'Professional',
      price: '₹1,299',
      period: 'per month',
      popular: true,
      features: [
        'Access to 200+ job listings',
        'Enhanced profile visibility',
        'Priority application processing',
        'Advanced search filters',
        'Resume building tools',
        'Interview preparation resources',
        'Direct messaging with recruiters',
      ],
    },
    {
      name: 'Enterprise',
      price: '₹2,999',
      period: 'per month',
      features: [
        'Unlimited job access',
        'Premium profile visibility',
        'Same-day application review',
        'AI-powered job matching',
        'Career coaching sessions',
        'Exclusive job listings',
        'Priority customer support',
        'Custom job alerts',
        'LinkedIn profile optimization',
      ],
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

  const handleGetStarted = (plan: string) => {
    router.push('/subscribe')
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
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Choose the perfect plan for your career goals
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-slate-900 rounded-2xl border ${
                plan.popular
                  ? 'border-indigo-500 shadow-2xl shadow-indigo-500/20'
                  : 'border-slate-700'
              } transition-all duration-700 transform hover:scale-105 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: `${index * 150}ms`,
              }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan name */}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-400 ml-2">{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
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
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA button */}
                <button
                  onClick={() => handleGetStarted(plan.name)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className={`text-center transition-all duration-1000 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
             style={{ transitionDelay: `${plans.length * 150}ms` }}>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h4 className="text-xl font-semibold text-white mb-2">
              30-day money-back guarantee
            </h4>
            <p className="text-slate-300">
              Try JobBoard Pro risk-free. If you're not satisfied, get a full refund within 30 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}