'use client'

import { useState } from 'react'
import type { User } from '@/types'
import { useToast } from '@/components/ui/Toast'
import ProfilePhotoUpload from '@/components/Upload/ProfilePhotoUpload'

interface ProfilePanelProps {
  user: User
  setUser: (user: User) => void
}

interface ProfileFormData {
  fullName: string
  phone: string
  bio: string
  currentJobTitle: string
  linkedinUrl: string
  resumeUrl: string
  skills: string[]
}

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export default function ProfilePanel({ user, setUser }: ProfilePanelProps) {
  const [activeSection, setActiveSection] = useState<
    'personal' | 'professional' | 'skills' | 'account'
  >('personal')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const { toast } = useToast()

  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: user.fullName || '',
    phone: user.phone || '',
    bio: user.bio || '',
    currentJobTitle: user.currentJobTitle || '',
    linkedinUrl: user.linkedinUrl || '',
    resumeUrl: user.resumeUrl || '',
    skills: user.skills?.map((s) => s.skill) || [],
  })

  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  })

  const calculateProfileCompletion = () => {
    const fields = [
      formData.fullName,
      formData.phone,
      formData.bio,
      formData.currentJobTitle,
      formData.linkedinUrl,
      formData.resumeUrl,
      formData.skills.length > 0,
      user.profilePhotoUrl,
    ]
    const completed = fields.filter((field) => field && field !== '').length
    return Math.round((completed / fields.length) * 100)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault()
      if (!formData.skills.includes(newSkill.trim())) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, newSkill.trim()],
        }))
        setNewSkill('')
      }
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const handleSaveSection = async (section: 'personal' | 'professional' | 'skills') => {
    try {
      const sectionData: any = {}

      if (section === 'personal') {
        sectionData.fullName = formData.fullName
        sectionData.phone = formData.phone
        sectionData.bio = formData.bio
      } else if (section === 'professional') {
        sectionData.currentJobTitle = formData.currentJobTitle
        sectionData.linkedinUrl = formData.linkedinUrl
        sectionData.resumeUrl = formData.resumeUrl
      } else if (section === 'skills') {
        sectionData.skills = formData.skills.map((skill: string) => ({ skill }))
      }

      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile')
      }

      toast('Profile updated successfully!', 'success')
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast(error.message || 'Failed to update profile', 'error')
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast('New passwords do not match', 'error')
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast('Password must be at least 8 characters', 'error')
      return
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to change password')
      }

      toast('Password changed successfully!', 'success')
      setShowPasswordModal(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
    } catch (error: any) {
      console.error('Error changing password:', error)
      toast(error.message || 'Failed to change password', 'error')
    }
  }

  return (
    <div className="w-full space-y-3">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-600">Manage your personal information</p>
      </div>

      {/* Profile Completion */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3">
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="text-sm font-medium text-slate-900">Profile Completion</h2>
          <span className="text-xs font-medium text-slate-600">
            {calculateProfileCompletion()}%
          </span>
        </div>
        <div className="bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full"
            style={{ width: `${calculateProfileCompletion()}%` }}
          />
        </div>
      </div>

      {/* Profile Photo */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3">
        <h2 className="text-sm font-medium text-slate-900 mb-2">Profile Photo</h2>
        <ProfilePhotoUpload
          currentPhotoUrl={user.profilePhotoUrl || null}
          userName={user.fullName || user.email || 'User'}
          userId={user.id}
          onUploadSuccess={(newUrl) => {
            setUser({ ...user, profilePhotoUrl: newUrl })
            toast('Profile photo updated!', 'success')
          }}
          onDeleteSuccess={() => {
            setUser({ ...user, profilePhotoUrl: null })
            toast('Profile photo removed', 'info')
          }}
        />
      </div>

      {/* Section Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-4 px-3">
            {[
              { id: 'personal', label: 'Personal' },
              { id: 'professional', label: 'Professional' },
              { id: 'skills', label: 'Skills' },
              { id: 'account', label: 'Account' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`py-2 px-1 border-b-2 text-xs font-medium transition-colors ${
                  activeSection === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-3 space-y-3">
          {/* Personal Info Section */}
          {activeSection === 'personal' && (
            <div className="space-y-2.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                />
              </div>
              <button
                onClick={() => handleSaveSection('personal')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-md font-medium"
              >
                Save
              </button>
            </div>
          )}

          {/* Professional Section */}
          {activeSection === 'professional' && (
            <div className="space-y-2.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Current Job Title
                </label>
                <input
                  type="text"
                  name="currentJobTitle"
                  value={formData.currentJobTitle}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Resume URL</label>
                <input
                  type="url"
                  name="resumeUrl"
                  value={formData.resumeUrl}
                  onChange={handleInputChange}
                  placeholder="https://drive.google.com/your-resume"
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <button
                onClick={() => handleSaveSection('professional')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-md font-medium"
              >
                Save
              </button>
            </div>
          )}

          {/* Skills Section */}
          {activeSection === 'skills' && (
            <div className="space-y-2.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Skills</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 text-indigo-600 hover:text-indigo-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="Type and press Enter"
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <button
                onClick={() => handleSaveSection('skills')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-md font-medium"
              >
                Save
              </button>
            </div>
          )}

          {/* Account Section */}
          {activeSection === 'account' && (
            <div className="space-y-2.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-slate-50 text-slate-600"
                />
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-md font-medium"
              >
                Change Password
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-sm mx-4">
            <h2 className="text-base font-semibold text-slate-900 mb-3">Change Password</h2>
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))
                  }
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                  }
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmNewPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({ ...prev, confirmNewPassword: e.target.value }))
                  }
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-3 py-1.5 border border-slate-300 text-slate-700 text-xs rounded-md hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="flex-1 px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-md hover:bg-indigo-700"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
