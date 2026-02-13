'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, X, CheckCheck, Briefcase, Clock, AlertCircle, Megaphone } from 'lucide-react'
import type { UserNotificationType } from '@/types/notifications'

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<UserNotificationType[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const router = useRouter()

  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/unread-count')
      const data = await response.json()
      setUnreadCount(data.unreadCount)
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }, [])

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/notifications')
      const data = await response.json()
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleBellClick = useCallback(() => {
    if (!isOpen) {
      fetchNotifications()
    }
    setIsOpen(!isOpen)
  }, [isOpen, fetchNotifications])

  const handleMarkAllRead = useCallback(async () => {
    try {
      await fetch('/api/notifications/mark-read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      })

      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }, [])

  const handleMarkOneRead = useCallback(async (userNotifId: string, notificationId: string) => {
    try {
      await fetch('/api/notifications/mark-read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      })

      setNotifications((prev) =>
        prev.map((notif) => (notif.id === userNotifId ? { ...notif, isRead: true } : notif)),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }, [])

  const handleNotificationClick = useCallback(
    (notif: UserNotificationType) => {
      handleMarkOneRead(notif.id, notif.id)

      if (notif.notification?.job?.slug) {
        router.push(`/jobs/${notif.notification.job.slug}`)
      }
      setIsOpen(false)
    },
    [handleMarkOneRead],
  )

  const getTimeAgo = useCallback((dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`

    return new Date(dateString).toLocaleDateString()
  }, [])

  const getTypeIcon = useCallback((type: string) => {
    const iconMap = {
      new_job: {
        icon: Briefcase,
        bgColor: 'bg-blue-500/20',
        textColor: 'text-blue-400',
      },
      subscription_expiry: {
        icon: Clock,
        bgColor: 'bg-orange-500/20',
        textColor: 'text-orange-400',
      },
      subscription_expired: {
        icon: AlertCircle,
        bgColor: 'bg-red-500/20',
        textColor: 'text-red-400',
      },
      general: {
        icon: Megaphone,
        bgColor: 'bg-purple-500/20',
        textColor: 'text-purple-400',
      },
      job_alert: {
        icon: Bell,
        bgColor: 'bg-green-500/20',
        textColor: 'text-green-400',
      },
    }

    const IconComponent = iconMap[type as keyof typeof iconMap]?.icon || iconMap.general.icon

    return (
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconMap[type as keyof typeof iconMap]?.bgColor || iconMap.general.bgColor} ${iconMap[type as keyof typeof iconMap]?.textColor || iconMap.general.textColor}`}
      >
        <IconComponent className="w-5 h-5" />
      </div>
    )
  }, [])

  useEffect(() => {
    fetchUnreadCount()

    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [fetchUnreadCount])

  const closeOnOutsideClick = useCallback((e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [closeOnOutsideClick])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleBellClick}
        className="relative p-2 text-slate-400 hover:text-white rounded-xl transition-all"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 font-bold animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-bold">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center gap-1"
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[420px] overflow-y-auto">
            {isLoading && (
              <div className="flex items-center justify-center p-8">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!isLoading && notifications.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Bell size={40} className="text-slate-600 mb-3" />
                <p className="text-slate-500 font-medium">No notifications yet</p>
                <p className="text-slate-600 text-sm mt-1">New job alerts will appear here</p>
              </div>
            )}

            {!isLoading &&
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex gap-3 p-4 border-b border-slate-800 cursor-pointer transition-colors hover:bg-slate-800/60 ${!notif.isRead ? 'bg-indigo-950/20' : ''}`}
                >
                  {getTypeIcon(notif.notification.type)}

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-tight ${!notif.isRead ? 'text-white font-semibold' : 'text-slate-300'}`}
                    >
                      {notif.notification.title}
                    </p>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                      {notif.notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-slate-600 text-xs">{getTimeAgo(notif.createdAt)}</span>
                      {notif.notification?.job && (
                        <span className="text-indigo-400 text-xs">View Job →</span>
                      )}
                    </div>
                  </div>

                  {!notif.isRead && (
                    <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              ))}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-slate-800 text-center">
              <a
                href="/dashboard/notifications"
                className="text-indigo-400 hover:text-indigo-300 text-sm"
              >
                View all notifications
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
