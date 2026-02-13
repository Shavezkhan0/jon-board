'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { 
  Send, 
  Bell, 
  Briefcase, 
  Users, 
  UserCheck, 
  Mail, 
  ChevronDown, 
  Check, 
  X, 
  Search, 
  Clock, 
  Megaphone 
} from 'lucide-react'

const TEMPLATES = [
  {
    label: '💼 New Job Alert',
    title: 'New Job Opportunity Available!',
    message: 'A new job has been posted on JobBoard Pro. Login to view the details and apply now.'
  },
  {
    label: '⏰ Subscription Reminder',
    title: 'Your subscription is expiring soon',
    message: 'Your JobBoard Pro subscription is expiring in 3 days. Renew now to keep access to all job listings.'
  },
  {
    label: '🎉 New Jobs Available',
    title: 'New jobs added this week!',
    message: 'We have added new job listings this week. Login to browse and apply to the latest opportunities.'
  },
  {
    label: '📢 General Announcement',
    title: 'Important Update from JobBoard Pro',
    message: 'We have an important announcement for our members. Please login to your dashboard to see the details.'
  },
]

export default function NotifyPage() {
  const [type, setType] = useState<'new_job' | 'general' | 'subscription_expiry' | 'job_alert'>('new_job')
  const [title, setTitle] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [recipient, setRecipient] = useState<'all' | 'subscribed' | 'selected'>('all')
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const [emailInput, setEmailInput] = useState<string>('')
  const [sendEmail, setSendEmail] = useState<boolean>(false)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>('')
  const [jobSearchQuery, setJobSearchQuery] = useState<string>('')
  const [jobSearchResults, setJobSearchResults] = useState<any[]>([])
  const [showJobSearch, setShowJobSearch] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [result, setResult] = useState<{ success: boolean; message: string; totalRecipients?: number } | null>(null)
  const [history, setHistory] = useState<any[]>([])
  const [historyLoading, setHistoryLoading] = useState<boolean>(false)

  const router = useRouter()
  const { user } = useAuth()
  
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || []
  
  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    if (!adminEmails.includes(user.email)) {
      // Show access denied message or redirect
      return
    }
  }, [user, router])

  const fetchJobs = async (query: string) => {
    try {
      const response = await fetch(`/api/jobs?where[title][contains]=${query}&limit=5`)
      const results = await response.json()
      setJobSearchResults(results.docs)
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    }
  }

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true)
      const response = await fetch('/api/admin/notifications')
      const data = await response.json()
      if (data.notifications) {
        setHistory(data.notifications)
      }
    } catch (error) {
      console.error('Failed to fetch notification history:', error)
    } finally {
      setHistoryLoading(false)
    }
  }

  const addEmail = (email: string) => {
    if (!selectedEmails.includes(email)) {
      setSelectedEmails(prev => [...prev, email])
      setEmailInput('')
    }
  }

  const removeEmail = (email: string) => {
    setSelectedEmails(prev => prev.filter(e => e !== email))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !message.trim()) {
      return
    }
    
    if (recipient === 'selected' && selectedEmails.length === 0) {
      return
    }
    
    setSendEmail(true)
    setSelectedJobId(null)
    setSelectedJobTitle('')
    
    try {
      const response = await fetch('/api/admin/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          title,
          message,
          recipient,
          selectedEmails: recipient === 'selected' ? selectedEmails : undefined,
          jobId: selectedJobId || undefined,
          sendEmail: sendEmail
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setTitle('')
        setMessage('')
        setRecipient('all')
        setSelectedEmails([])
        setEmailInput('')
        setResult({ success: true, message: data.message, totalRecipients: data.totalRecipients })
        await fetchHistory()
      } else {
        setSelectedJobId(null)
        setSelectedJobTitle('')
      }
    } catch (error) {
      console.error('Failed to send notification:', error)
      setResult({ success: false, message: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setSendEmail(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-white">📢 Send Notification</h1>
          <p className="text-indigo-200 text-lg mt-2">
            Notify your users about new jobs and updates
          </p>
        </div>
      </div>

      {/* Main Content */}
      {!user ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-lg">You don't have permission to access this page.</p>
            <p>Please contact an administrator if you believe this is an error.</p>
            <button
              onClick={() => router.push('/login')}
              className="mt-6 px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:grid lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Send New Notification</h2>
                
                {/* Notification Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notification Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {TEMPLATES.map((template) => (
                      <div key={template.label} className="relative">
                        <input
                          type="radio"
                          name="notificationType"
                          value={template.label.split(' ')[0]}
                          checked={type === template.label.split(' ')[0]}
                          onChange={(e) => setType(template.label.split(' ')[0] as any)}
                          className="sr-only"
                        />
                        <label
                          onClick={() => setType(template.label.split(' ')[0] as any)}
                          className={`
                            flex items-center justify-center p-4 border rounded-xl cursor-pointer transition-all
                            ${type === template.label.split(' ')[0] 
                              ? 'border-indigo-500 bg-indigo-50' 
                              : 'border-slate-300 bg-white'
                            }
                            ${type === template.label.split(' ')[0] 
                              ? 'text-indigo-700' 
                              : 'text-slate-700'
                            }
                          `}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl mb-1">{template.label.split(' ')[1]}</span>
                            <span className="text-sm text-slate-600">{template.label.slice(2)}</span>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Title Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notification Title *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={TEMPLATES.find(t => t.label.split(' ')[0] === type)?.title || 'New Job: Senior Developer at TCS'}
                      maxLength={100}
                      className={`w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${title.length > 0 ? 'border-indigo-500' : ''}`}
                    />
                    {title.length > 0 && (
                      <span className="absolute right-4 top-3 text-xs text-slate-500">
                        {title.length}/100
                      </span>
                    )}
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Message *
                  </label>
                  <div className="relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={TEMPLATES.find(t => t.label.split(' ')[0] === type)?.message || 'Write your notification message...'}
                      maxLength={300}
                      rows={4}
                      className={`w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${message.length > 0 ? 'border-indigo-500' : ''}`}
                    />
                    {message.length > 0 && (
                      <span className="absolute right-4 bottom-3 text-xs text-slate-500">
                        {message.length}/300
                      </span>
                    )}
                  </div>
                </div>

                {/* Recipient Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Who to Notify *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['all', 'subscribed', 'selected'] as const).map((option) => (
                      <div key={option} className="relative">
                        <input
                          type="radio"
                          name="recipient"
                          value={option}
                          checked={recipient === option}
                          onChange={(e) => setRecipient(e.target.value as 'all' | 'subscribed' | 'selected')}
                          className="sr-only"
                        />
                        <label
                          onClick={() => setRecipient(option)}
                          className={`
                            flex items-center justify-center p-4 border rounded-xl cursor-pointer transition-all
                            ${recipient === option 
                              ? 'border-indigo-500 bg-indigo-50' 
                              : 'border-slate-300 bg-white'
                            }
                            ${recipient === option 
                              ? 'text-indigo-700' 
                              : 'text-slate-700'
                            }
                          `}
                        >
                          <div className="flex items-center space-x-3">
                            {option === 'all' && <Users className="w-5 h-5" />}
                            {option === 'subscribed' && <Bell className="w-5 h-5" />}
                            {option === 'selected' && <UserCheck className="w-5 h-5" />}
                            <span className="text-sm">{option === 'all' ? 'All Users' : option === 'subscribed' ? 'Subscribed Users Only' : 'Selected Users'}</span>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conditional Job Selection */}
                {type === 'new_job' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Link to Job (Optional)
                    </label>
                    <div className="relative">
                      <div className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={jobSearchQuery}
                          onChange={(e) => setJobSearchQuery(e.target.value)}
                          placeholder="Search jobs by title or company..."
                          className={`w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${selectedJobId ? 'border-indigo-500' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowJobSearch(!showJobSearch)}
                          className="p-2 border border-slate-300 rounded-xl hover:bg-slate-100"
                        >
                          <Search className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {showJobSearch && jobSearchResults.length > 0 && (
                        <div className="absolute top-full left-0 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-50 mt-12">
                          <div className="p-2">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-medium text-slate-900">Search Results</h3>
                              <button
                                onClick={() => setShowJobSearch(false)}
                                className="text-slate-500 hover:text-slate-700"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            
                            <div className="space-y-2">
                              {jobSearchResults.map((job) => (
                                <div
                                  key={job.id}
                                  onClick={() => {
                                    setSelectedJobId(job.id)
                                    setSelectedJobTitle(job.title)
                                    setShowJobSearch(false)
                                  }}
                                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                    selectedJobId === job.id
                                      ? 'border-indigo-500 bg-indigo-50' 
                                      : 'border-slate-300 hover:bg-slate-100'
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-medium text-slate-900">{job.title}</p>
                                      <p className="text-sm text-slate-600">{job.company}</p>
                                    </div>
                                    {selectedJobId === job.id && (
                                      <Check className="w-5 h-5 text-indigo-600" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedJobId && (
                      <div className="mt-2 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <p className="text-sm text-indigo-700">
                          <strong>Selected:</strong> {selectedJobTitle}
                        </p>
                        <button
                          onClick={() => {
                            setSelectedJobId(null)
                            setSelectedJobTitle('')
                          }}
                          className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          Clear Selection
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Email Options for Selected Users */}
                {recipient === 'selected' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Addresses *
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <input
                          type="email"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="Enter email address"
                          className={`flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        <button
                          type="button"
                          onClick={() => addEmail(emailInput)}
                          disabled={!emailInput.trim()}
                          className="px-4 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                      </div>
                      
                      {selectedEmails.length > 0 && (
                        <div className="space-y-2">
                          {selectedEmails.map((email, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                              <span className="text-sm text-slate-700">{email}</span>
                              <button
                                onClick={() => removeEmail(email)}
                                className="text-red-500 hover:text-red-700 text-xs"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Email Toggle */}
                <div className="flex items-center space-x-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendEmail}
                      onChange={(e) => setSendEmail(e.target.checked)}
                      className="sr-only"
                    />
                    <div className="relative">
                      <div className={`w-12 h-6 rounded-full transition-all ${sendEmail ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                        <div className={`absolute top-1/2 left-1/2 w-5 h-5 bg-white rounded-full transition-transform ${sendEmail ? 'translate-x-0' : 'translate-x-6'}`}></div>
                      </div>
                      <Mail className={`absolute top-1/2 left-1/2 w-5 h-5 text-slate-600 transition-transform ${sendEmail ? 'translate-x-0' : 'translate-x-6'}`}></Mail>
                    </div>
                    <span className="ml-3 text-sm font-medium">{sendEmail ? 'Also send email via Resend' : 'Notification only'}</span>
                  </label>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex items-center justify-center px-6 py-4 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${!title.trim() || !message.trim() || (recipient === 'selected' && selectedEmails.length === 0) ? 'opacity-50' : ''}`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-transparent rounded-full animate-spin mr-2"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Notification 🚀</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Result Message */}
                {result && (
                  <div className={`mt-4 p-4 rounded-xl border ${
                    result.success 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    <div className="flex items-center">
                      {result.success ? (
                        <Check className="w-5 h-5 text-green-400 mr-2" />
                      ) : (
                        <X className="w-5 h-5 text-red-400 mr-2" />
                      )}
                      <p className={`text-sm ${
                        result.success 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {result.message}
                        {result.totalRecipients && (
                          <span className="block mt-1">
                            Sent to {result.totalRecipients} users
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Preview & History */}
            <div className="lg:col-span-1">
              {/* Preview Card */}
              {(type && title && message) && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Preview</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">{TEMPLATES.find(t => t.label.split(' ')[0] === type)?.label.split(' ')[1] || '📢'}</span>
                      <span className="text-sm text-slate-600 ml-2">{type}</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{title}</p>
                      <p className="text-sm text-slate-600">{message}</p>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs text-slate-500">To:</span>
                      <span className="text-xs text-slate-700">{recipient === 'all' ? 'All Users' : recipient === 'subscribed' ? 'Subscribed Users Only' : `${selectedEmails.length} Selected Users`}</span>
                      {sendEmail && (
                        <span className="text-xs text-slate-500">+ Email</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* History Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-slate-900">Recent Notifications</h2>
                  <button
                    onClick={fetchHistory}
                    disabled={historyLoading}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium disabled:opacity-50"
                  >
                    Refresh
                  </button>
                </div>

                {historyLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                ) : history && history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map((item, index) => (
                      <div key={index} className="p-4 border-b border-slate-200 last:border-b-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                item.type === 'new_job' ? 'bg-blue-500/20 text-blue-400' :
                                item.type === 'general' ? 'bg-purple-500/20 text-purple-400' :
                                item.type === 'subscription_expiry' ? 'bg-orange-500/20 text-orange-400' :
                                item.type === 'job_alert' ? 'bg-green-500/20 text-green-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {item.type === 'new_job' && <Briefcase className="w-3 h-3 text-white" />}
                                {item.type === 'general' && <Megaphone className="w-3 h-3 text-white" />}
                                {item.type === 'subscription_expiry' && <Clock className="w-3 h-3 text-white" />}
                                {item.type === 'job_alert' && <Bell className="w-3 h-3 text-white" />}
                            </div>
                            <div className="text-sm">
                              <p className="font-medium text-slate-900">{item.title}</p>
                              <p className="text-slate-600">{item.message}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-slate-600 text-xs">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                              <span className="text-xs text-slate-500">
                                To: {item.recipient === 'all' ? 'All Users' : item.recipient === 'subscribed' ? 'Subscribed Users Only' : `${item.selectedEmails?.length || 0} Selected Users`}
                              </span>
                              {item.totalRecipients && (
                                <span className="block">
                                  Sent to {item.totalRecipients} users
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                  <div className="text-center py-8 text-slate-600">
                    <Megaphone className="w-12 h-12 text-slate-400 mb-3" />
                    <p className="text-lg font-medium">No notifications sent yet</p>
                    <p className="text-sm">Your notification history will appear here once you start sending notifications.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}