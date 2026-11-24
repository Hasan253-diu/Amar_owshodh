'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react'
import type { ReportStats } from '@/app/actions/history'
import { useLanguage } from '@/context/LanguageContext'

interface ReportsViewProps {
  stats: ReportStats
}

export const ReportsView: React.FC<ReportsViewProps> = ({ stats }) => {
  const { t, lang, formatNumber } = useLanguage()

  const pieData = [
    { name: t.common.taken, value: stats.totalTaken, color: '#16A34A' },
    { name: t.common.skipped, value: stats.totalSkipped, color: '#DC2626' },
    { name: t.common.pending, value: stats.totalPending, color: '#F97316' },
  ].filter((item) => item.value > 0)

  // Map weekly breakdown days according to current language
  const bnToEnDays: Record<string, string> = {
    'রবি': 'Sun',
    'সোম': 'Mon',
    'মঙ্গল': 'Tue',
    'বুধ': 'Wed',
    'বৃহস্পতি': 'Thu',
    'শুক্র': 'Fri',
    'শনি': 'Sat',
  }

  const localizedWeekly = (stats.weeklyBreakdown || []).map((item) => {
    let dayLabel = item.day
    if (lang === 'en') {
      Object.entries(bnToEnDays).forEach(([bn, en]) => {
        if (dayLabel.startsWith(bn)) {
          dayLabel = dayLabel.replace(bn, en)
        }
      })
    } else {
      // In bn mode, ensure numbers are formatted to Bengali digits if desired
      dayLabel = dayLabel.replace(/\d+/g, (match) => formatNumber(match))
    }
    return {
      ...item,
      day: dayLabel,
    }
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.reports.title}
        description={t.reports.description}
      />

      {/* Medical Disclaimer Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong>{t.common.disclaimerTitle}:</strong> {t.common.disclaimerText}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title={t.reports.adherenceRate}
          value={`${formatNumber(stats.adherenceRate)}%`}
          subtitle={t.reports.adherenceRateSub}
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title={t.reports.totalTaken}
          value={`${formatNumber(stats.totalTaken)} ${t.reports.timesSuffix}`}
          subtitle={t.reports.totalTakenSub}
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title={t.reports.totalSkipped}
          value={`${formatNumber(stats.totalSkipped)} ${t.reports.timesSuffix}`}
          subtitle={t.reports.totalSkippedSub}
          icon={XCircle}
          variant="destructive"
        />
        <StatCard
          title={t.reports.totalPending}
          value={`${formatNumber(stats.totalPending)} ${t.reports.timesSuffix}`}
          subtitle={t.reports.totalPendingSub}
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
          <h3 className="font-bold text-base text-[#1E293B] mb-1">
            {t.reports.weeklySummaryTitle}
          </h3>
          <p className="text-xs text-[#64748B] mb-6">{t.reports.weeklySummaryDesc}</p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={localizedWeekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="taken" name={t.common.taken} fill="#16A34A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="skipped" name={t.common.skipped} fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Overall Ratio Pie Chart */}
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-[#1E293B] mb-1">
              {t.reports.ratioTitle}
            </h3>
            <p className="text-xs text-[#64748B] mb-4">{t.reports.ratioDesc}</p>

            <div className="h-56 w-full flex items-center justify-center">
              {pieData.length === 0 ? (
                <p className="text-xs text-[#64748B]">{t.reports.noData}</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-[#E2E8F0] text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#16A34A]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                {t.common.taken}
              </span>
              <span className="font-bold text-[#1E293B]">{formatNumber(stats.totalTaken)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#DC2626]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                {t.common.skipped}
              </span>
              <span className="font-bold text-[#1E293B]">{formatNumber(stats.totalSkipped)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
