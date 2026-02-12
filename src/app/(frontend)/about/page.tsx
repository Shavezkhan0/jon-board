import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About JobBoard Pro - Our Mission & Team',
  description: 'Learn about JobBoard Pro\'s mission to connect Indian job seekers with their dream opportunities. Meet our team and discover how we\'re revolutionizing job search.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20"></div>
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">JobBoard Pro</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8">
            We're on a mission to transform how Indian professionals find their dream jobs
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-slate-400">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span>Founded in 2024</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>5000+ Members</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>100+ Companies</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Mission
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Making job discovery simple, transparent, and effective for millions of Indian professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-indigo-500 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Transparency</h3>
              <p className="text-slate-300">
                Clear job descriptions, salary ranges, and company information. No hidden surprises, just genuine opportunities.
              </p>
            </div>

            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-indigo-500 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Efficiency</h3>
              <p className="text-slate-300">
                Smart matching algorithms and intuitive search tools help you find the right opportunities faster.
              </p>
            </div>

            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-indigo-500 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Community</h3>
              <p className="text-slate-300">
                Building a supportive ecosystem where job seekers and companies can connect and grow together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How JobBoard Pro Works
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Simple steps to connect you with your next career opportunity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Create Account</h3>
              <p className="text-slate-300">
                Sign up in seconds and create your professional profile
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Choose Plan</h3>
              <p className="text-slate-300">
                Select the subscription that fits your career needs
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Browse Jobs</h3>
              <p className="text-slate-300">
                Access exclusive listings from top companies across India
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                4
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Apply & Get Hired</h3>
              <p className="text-slate-300">
                Apply directly and track your applications in one place
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              The passionate professionals behind JobBoard Pro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                AK
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">Arun Kumar</h3>
              <p className="text-indigo-400 mb-3">Founder & CEO</p>
              <p className="text-slate-300 text-sm">
                Former tech lead with 10+ years in recruitment technology. Passionate about connecting talent with opportunities.
              </p>
              <div className="flex justify-center space-x-3 mt-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 00-2.143-2.143 10.002 10.002 0 01-3.274 1.27 4.938 4.938 0 00-7.694-5.904 10.017 10.017 0 01-6.484 2.353 4.954 4.954 0 00-2.144-2.143 10.002 10.002 0 01-.001-13.734 4.954 4.954 0 002.144-2.143 10.002 10.002 0 0112.636 6.483 4.96 4.96 0 005.904 7.694 9.997 9.997 0 011.773-3.274 4.96 4.96 0 002.143-2.144"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                PS
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">Priya Sharma</h3>
              <p className="text-indigo-400 mb-3">Head of Product</p>
              <p className="text-slate-300 text-sm">
                UX expert with 8+ years in building intuitive job platforms. Focused on creating seamless user experiences.
              </p>
              <div className="flex justify-center space-x-3 mt-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 00-2.143-2.143 10.002 10.002 0 01-3.274 1.27 4.938 4.938 0 00-7.694-5.904 10.017 10.017 0 01-6.484 2.353 4.954 4.954 0 00-2.144-2.143 10.002 10.002 0 01-.001-13.734 4.954 4.954 0 002.144-2.143 10.002 10.002 0 0112.636 6.483 4.96 4.96 0 005.904 7.694 9.997 9.997 0 011.773-3.274 4.96 4.96 0 002.143-2.144"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                RV
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">Rahul Verma</h3>
              <p className="text-indigo-400 mb-3">CTO & Co-founder</p>
              <p className="text-slate-300 text-sm">
                Full-stack architect with 12+ years in scalable systems. Ensuring our platform is fast, secure, and reliable.
              </p>
              <div className="flex justify-center space-x-3 mt-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 00-2.143-2.143 10.002 10.002 0 01-3.274 1.27 4.938 4.938 0 00-7.694-5.904 10.017 10.017 0 01-6.484 2.353 4.954 4.954 0 00-2.144-2.143 10.002 10.002 0 01-.001-13.734 4.954 4.954 0 002.144-2.143 10.002 10.002 0 0112.636 6.483 4.96 4.96 0 005.904 7.694 9.997 9.997 0 011.773-3.274 4.96 4.96 0 002.143-2.144"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-slate-300">support@jobboardpro.com</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502.607L8 11.5a1 1 0 01-1.274-.464L4.835 9.448a1 1 0 01-.502-.607L5.108 3.812A1 1 0 016.108 3H7a2 2 0 012 2v1z" />
                  </svg>
                  <span className="text-slate-300">+91 98765 43210</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-slate-300">Bangalore, Karnataka, India</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-6">Business Hours</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-300">Monday - Friday</span>
                  <span className="text-slate-300">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Saturday</span>
                  <span className="text-slate-300">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Sunday</span>
                  <span className="text-slate-400">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}