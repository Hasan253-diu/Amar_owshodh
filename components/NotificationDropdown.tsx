'use client'

import React, { useState, useEffect } from 'react'
import { Bell, Check, Clock } from 'lucide-react'
import { getNotificationsAction, markNotificationAsReadAction, type AppNotification } from '@/app/actions/intake'
import { useLanguage } from '@/context/LanguageContext'

export const NotificationDropdown: React.FC = () => {
  const { t, formatNumber } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchNotifications = async () => {
    setIsLoading(true)
    const res = await getNotificationsAction()
    if (res.success && res.data) {
      setNotifications(res.data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsReadAction(id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) fetchNotifications()
        }}
        className="relative p-2 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] rounded-lg transition-colors border border-[#E2E8F0]"
        title={t.notifications.title}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#2563EB] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : formatNumber(unreadCount)}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-[#E2E8F0] z-50 overflow-hidden">
          <div className="p-3.5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#1E293B]">{t.notifications.title}</h3>
              {unreadCount > 0 && (
                <span className="text-[11px] font-semibold bg-blue-50 text-[#2563EB] px-2 py-0.5 rounded-full border border-blue-200">
                  {formatNumber(unreadCount)} {t.notifications.newBadge}
                </span>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[#E2E8F0]">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#64748B]">
                {t.notifications.noNotifications}
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 text-xs transition-colors flex items-start justify-between gap-3 ${
                    !n.is_read ? 'bg-blue-50/40 hover:bg-blue-50/60' : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <p className={`font-semibold ${!n.is_read ? 'text-[#1E293B]' : 'text-[#64748B]'}`}>
                      {n.title}
                    </p>
                    <p className="text-[#64748B] leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-[#64748B]/70 flex items-center gap-1 pt-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(n.created_at).toLocaleTimeString()}</span>
                    </p>
                  </div>

                  {!n.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="p-1 hover:bg-blue-100 rounded text-[#2563EB] shrink-0"
                      title={t.notifications.markAsRead}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
