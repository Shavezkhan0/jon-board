'use client'

import { useState, useEffect, useRef } from 'react'

interface Testimonial {
  name: string
  title: string
  company: string
  avatar: string
  quote: string
  rating: number
}

export default function TestimonialsSection() {
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const testimonials: Testimonial[] = [
    {
      name: 'Priya Sharma',
      title: 'Software Engineer',
      company: 'Infosys',
      avatar: 'PS',
      quote: 'JobBoard Pro helped me land my dream job in just 2 weeks! The quality of listings and the application tracking features are amazing. Highly recommend to all job seekers.',
      rating: 5,
    },
    {
      name: 'Rahul Verma',
      title: 'Product Manager',
      company: 'Swiggy',
      avatar: 'RV',
      quote: 'I was skeptical at first, but the investment paid off immediately. Got multiple interview calls within the first week of subscribing. The platform is worth every penny!',
      rating: 5,
    },
    {
      name: 'Anjali Patel',
      title: 'UX Designer',
      company: 'Zomato',
      avatar: 'AP',
      quote: 'The curated job listings saved me hours of searching. Found a perfect match for my skills and experience. The subscription cost is nothing compared to the value I received.',
      rating: 5,
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-slate-600'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-green-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
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
            What Our Members Say
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Real stories from professionals who found their dream jobs through JobBoard Pro
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-indigo-500 transition-all duration-700 transform hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{
                transitionDelay: `${index * 150}ms`,
              }}
            >
              {/* Rating */}
              <div className="flex mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Quote */}
              <blockquote className="text-slate-300 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Author info */}
              <div className="flex items-center">
                {/* Avatar */}
                <div className={`w-12 h-12 ${getAvatarColor(testimonial.name)} rounded-full flex items-center justify-center text-white font-semibold mr-4`}>
                  {testimonial.avatar}
                </div>
                
                {/* Author details */}
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-slate-400 text-sm">{testimonial.title}</div>
                  <div className="text-slate-500 text-xs">{testimonial.company}</div>
                </div>
              </div>

              {/* Quote mark decoration */}
              <div className="absolute top-4 right-4 text-6xl text-indigo-500/20 font-serif">
                "
              </div>
            </div>
          ))}
        </div>

        {/* Additional social proof */}
        <div className={`text-center mt-16 transition-all duration-1000 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
             style={{ transitionDelay: `${testimonials.length * 150}ms` }}>
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">5,000+</div>
                <div className="text-slate-400 text-sm">Happy Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">1,200+</div>
                <div className="text-slate-400 text-sm">Jobs Filled</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">4.9/5</div>
                <div className="text-slate-400 text-sm">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">98%</div>
                <div className="text-slate-400 text-sm">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}