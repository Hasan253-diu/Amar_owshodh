'use client'

import React from 'react'
import Link from 'next/link'
import { AlertTriangle, LogIn, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'

export const GuestModeBanner: React.FC = () => {
  const { isGuest, exitGuestMode } = useAuth()
  const { t } = useLanguage()

  if (!isGuest) return null

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2.5 shadow-2xs z-20">
      <div className="flex items-center gap-2 font-medium">
        <span className="p-1 bg-amber-200/70 text-amber-800 rounded-md shrink-0">
          <AlertTriangle className="w-3.5 h-3.5" />
        </span>
        <span className="text-[11px] sm:text-xs">{t.common.guestBannerNotice}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#2563EB] hover:bg-blue-700 text-white rounded-md font-semibold text-[11px] transition-colors shadow-2xs"
        >
          <LogIn className="w-3 h-3" />
          <span>{t.common.loginToContinue}</span>
        </Link>
        <button
          onClick={() => exitGuestMode()}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-amber-100/60 text-amber-900 border border-amber-300 rounded-md font-semibold text-[11px] transition-colors cursor-pointer"
        >
          <LogOut className="w-3 h-3 text-amber-700" />
          <span>{t.common.exitGuestMode}</span>
        </button>
      </div>
    </div>
  )
}
