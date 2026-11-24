'use client'

import React, { useState } from 'react'
import { Clock, Check, X, Loader2 } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { recordIntakeStatusAction, type IntakeLog } from '@/app/actions/intake'
import { useLanguage } from '@/context/LanguageContext'

interface ReminderCardProps {
  log: IntakeLog
  onStatusChanged?: (updated: IntakeLog) => void
}

export const ReminderCard: React.FC<ReminderCardProps> = ({ log, onStatusChanged }) => {
  const { t, formatTime } = useLanguage()
  const [currentStatus, setCurrentStatus] = useState(log.status)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleAction = async (status: 'taken' | 'skipped') => {
    setIsUpdating(true)
    try {
      const res = await recordIntakeStatusAction(log.id, status)
      if (res.success && res.data) {
        setCurrentStatus(status)
        if (onStatusChanged) onStatusChanged(res.data)
      }
    } finally {
      setIsUpdating(false)
    }
  }

  const timeFormatted = formatTime(log.scheduled_time)

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] hover:border-slate-300 transition-all gap-3">
      <div className="flex items-center gap-3.5">
        <div className="p-2.5 bg-white rounded-lg border border-[#E2E8F0] text-[#2563EB] shadow-2xs">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-[#1E293B]">
            {log.medicines?.name || t.navigation.medicines}
          </h4>
          <p className="text-xs text-[#64748B] mt-0.5">
            {t.schedule.timePrefix} {timeFormatted} {log.medicines?.notes ? `• ${log.medicines.notes}` : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 self-end sm:self-center">
        <StatusBadge status={currentStatus} />

        {currentStatus === 'pending' && (
          <div className="flex items-center gap-1.5 ml-2">
            <button
              onClick={() => handleAction('taken')}
              disabled={isUpdating}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#16A34A] hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>{t.common.taken}</span>
            </button>
            <button
              onClick={() => handleAction('skipped')}
              disabled={isUpdating}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#DC2626] hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors disabled:opacity-60 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>{t.common.skipped}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
