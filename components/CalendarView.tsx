'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { useLanguage } from '@/context/LanguageContext'
import type { IntakeLog } from '@/app/actions/intake'

interface CalendarViewProps {
  initialLogsGrouped: Record<string, IntakeLog[]>
  currentYear: number
  currentMonth: number // 1-12
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  initialLogsGrouped,
  currentYear: initYear,
  currentMonth: initMonth,
}) => {
  const { t, formatNumber, formatTime, formatDate } = useLanguage()
  const [year, setYear] = useState(initYear)
  const [month, setMonth] = useState(initMonth)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const firstDayOfMonth = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()

  const handlePrevMonth = () => {
    if (month === 1) {
      setYear(year - 1)
      setMonth(12)
    } else {
      setMonth(month - 1)
    }
    setSelectedDate(null)
  }

  const handleNextMonth = () => {
    if (month === 12) {
      setYear(year + 1)
      setMonth(1)
    } else {
      setMonth(month + 1)
    }
    setSelectedDate(null)
  }

  const calendarCells = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d)
  }

  const selectedDateLogs = selectedDate ? (initialLogsGrouped[selectedDate] || []) : []

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.calendar.title}
        description={t.calendar.description}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
            <h2 className="text-lg font-bold text-[#1E293B]">
              {t.common.months[month - 1]} {formatNumber(year)}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-[#64748B] transition-colors cursor-pointer"
                title={t.calendar.prevMonth}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-[#64748B] transition-colors cursor-pointer"
                title={t.calendar.nextMonth}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-[#64748B] mb-2">
            {t.common.daysOfWeekShort.map((wd) => (
              <div key={wd} className="py-1">
                {wd}
              </div>
            ))}
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarCells.map((dayNum, index) => {
              if (dayNum === null) {
                return <div key={`empty-${index}`} className="h-20 sm:h-24 bg-slate-50/50 rounded-lg border border-transparent" />
              }

              const formattedMonth = month < 10 ? `0${month}` : `${month}`
              const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`
              const cellDateStr = `${year}-${formattedMonth}-${formattedDay}`
              const logsForDay = initialLogsGrouped[cellDateStr] || []
              const isSelected = selectedDate === cellDateStr

              const takenCount = logsForDay.filter((l) => l.status === 'taken').length
              const skippedCount = logsForDay.filter((l) => l.status === 'skipped').length
              const pendingCount = logsForDay.filter((l) => l.status === 'pending').length

              return (
                <div
                  key={cellDateStr}
                  onClick={() => setSelectedDate(cellDateStr)}
                  className={`h-20 sm:h-24 p-2 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#2563EB] bg-blue-50/40 ring-1 ring-[#2563EB]'
                      : 'border-[#E2E8F0] hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className={`text-xs font-bold ${isSelected ? 'text-[#2563EB]' : 'text-[#1E293B]'}`}>
                    {formatNumber(dayNum)}
                  </span>

                  {logsForDay.length > 0 && (
                    <div className="space-y-0.5">
                      {takenCount > 0 && (
                        <div className="text-[10px] font-medium bg-emerald-50 text-emerald-700 px-1 py-0.5 rounded truncate">
                          {formatNumber(takenCount)} {t.common.taken}
                        </div>
                      )}
                      {skippedCount > 0 && (
                        <div className="text-[10px] font-medium bg-rose-50 text-rose-700 px-1 py-0.5 rounded truncate">
                          {formatNumber(skippedCount)} {t.common.skipped}
                        </div>
                      )}
                      {pendingCount > 0 && (
                        <div className="text-[10px] font-medium bg-amber-50 text-amber-700 px-1 py-0.5 rounded truncate">
                          {formatNumber(pendingCount)} {t.common.pending}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Selected Date Detail Drawer */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs">
          <h3 className="font-bold text-base text-[#1E293B] pb-3 border-b border-[#E2E8F0] mb-4">
            {selectedDate ? `${formatDate(selectedDate)} ${t.calendar.detailsForDate}` : t.calendar.selectDatePrompt}
          </h3>

          {!selectedDate ? (
            <p className="text-xs text-[#64748B] text-center py-8">
              {t.calendar.selectDatePrompt}
            </p>
          ) : selectedDateLogs.length === 0 ? (
            <p className="text-xs text-[#64748B] text-center py-8">
              {t.calendar.noRecordsForDate}
            </p>
          ) : (
            <div className="space-y-3">
              {selectedDateLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#1E293B]">
                      {log.medicines?.name || t.navigation.medicines}
                    </span>
                    <StatusBadge status={log.status} />
                  </div>
                  <p className="text-[11px] text-[#64748B] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t.schedule.timePrefix} {formatTime(log.scheduled_time)}</span>
                  </p>
                  {log.recorded_at && (
                    <p className="text-[10px] text-[#64748B]/70">
                      {t.calendar.recordedAtPrefix} {new Date(log.recorded_at).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
