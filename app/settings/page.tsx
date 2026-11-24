'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { User, Bell, Download, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import {
  getNotificationPermission,
  requestBrowserNotificationPermission,
} from '@/lib/notifications'

export default function SettingsPage() {
  const { profile, user } = useAuth()
  const { t, lang } = useLanguage()
  const [notificationStatus, setNotificationStatus] = useState<string>(getNotificationPermission())
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleEnableNotification = async () => {
    const res = await requestBrowserNotificationPermission()
    setNotificationStatus(res)
    if (res === 'granted') {
      setSuccessMessage(t.settings.notificationSuccess)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title={t.settings.title}
        description={t.settings.description}
      />

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16A34A]" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Profile Info */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0]">
          <div className="p-2.5 bg-blue-50 text-[#2563EB] rounded-lg">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#1E293B]">{t.settings.profileTitle}</h3>
            <p className="text-xs text-[#64748B]">{t.settings.profileDesc}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[#64748B] mb-1 font-semibold">{t.auth.fullName}</label>
            <p className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] font-medium text-[#1E293B]">
              {profile?.full_name || t.settings.unspecified}
            </p>
          </div>

          <div>
            <label className="block text-[#64748B] mb-1 font-semibold">{t.auth.email}</label>
            <p className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] font-medium text-[#1E293B]">
              {user?.email || profile?.email || t.settings.unspecified}
            </p>
          </div>

          <div>
            <label className="block text-[#64748B] mb-1 font-semibold">
              {lang === 'bn' ? 'অ্যাকাউন্ট রোল' : 'Account Role'}
            </label>
            <p className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] font-medium text-[#1E293B]">
              {profile?.role === 'admin'
                ? (lang === 'bn' ? 'অ্যাডমিন (Admin)' : 'Admin')
                : (lang === 'bn' ? 'সাধারণ ব্যবহারকারী (User)' : 'Standard User')}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-[#E2E8F0] flex justify-end">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded-lg text-xs font-semibold transition-colors shadow-2xs"
          >
            <span>{lang === 'bn' ? 'প্রোফাইল পেজ ও সম্পাদনা' : 'View Full Profile & Edit'} →</span>
          </Link>
        </div>
      </div>

      {/* Notifications Configuration */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0]">
          <div className="p-2.5 bg-teal-50 text-[#0D9488] rounded-lg">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#1E293B]">{t.settings.notificationsTitle}</h3>
            <p className="text-xs text-[#64748B]">{t.settings.notificationsDesc}</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
          <div>
            <p className="text-xs font-bold text-[#1E293B]">{t.settings.browserPermission}</p>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              {t.settings.currentStatus}{' '}
              <span className="font-semibold text-[#2563EB]">{notificationStatus}</span>
            </p>
          </div>

          {notificationStatus !== 'granted' && (
            <button
              onClick={handleEnableNotification}
              className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              {t.settings.grantPermission}
            </button>
          )}
        </div>
      </div>

      {/* Data Export & Backup */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E2E8F0]">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-[#1E293B]">{t.settings.backupTitle}</h3>
            <p className="text-xs text-[#64748B]">{t.settings.backupDesc}</p>
          </div>
        </div>

        <p className="text-xs text-[#64748B] leading-relaxed">
          {t.settings.backupExpl}
        </p>

        <a
          href="/history"
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#1E293B] hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <Download className="w-4 h-4 text-[#2563EB]" />
          <span>{t.settings.exportHistoryButton}</span>
        </a>
      </div>
    </div>
  )
}
