'use client'

import { useState, useEffect, useRef } from 'react'

export default function CTASection() {
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

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

  const handleGetStarted = () => {
    window.location.href = '/register'
  }

  return (
    <div
      ref={sectionRef}
      className="relative py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 opacity-50" />
      
      {/* Floating elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className={`transition-all duration-1000 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Main heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Land Your
            <span className="block text-yellow-300">Dream Job?</span>
          </h2>

          {/* Subtext */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of professionals finding opportunities through JobBoard Pro. 
            Your next career move is just a click away.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-white/30 text-lg"
            >
              Start Free Today
            </button>
            
            <button
              onClick={() => window.location.href = '/jobs'}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg transition-all duration-300 hover:bg-white hover:text-indigo-600 text-lg"
            >
              Browse Jobs
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">5000+</div>
              <div className="text-white/80 text-sm">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1200+</div>
              <div className="text-white/80 text-sm">Jobs Posted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">98%</div>
              <div className="text-white/80 text-sm">Success Rate</div>
            </div>
          </div>

          {/* Quote */}
          <blockquote className="mt-12 max-w-2xl mx-auto">
            <div className="text-xl text-white/90 italic">
              "JobBoard Pro transformed my job search. I found multiple interviews within the first week!"
            </div>
            <footer className="mt-4 text-white/80">
              <div className="font-semibold">— Priya Sharma</div>
              <div className="text-sm">Software Engineer at Infosys</div>
            </footer>
          </blockquote>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-2deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}