'use client'

import React from 'react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { Users, Pill, Clock, Activity, ShieldCheck, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import type { AdminAggregateStats } from '@/app/actions/admin'

interface AdminViewProps {
  data: AdminAggregateStats | null
  error?: string | null
}

export const AdminView: React.FC<AdminViewProps> = ({ data, error }) => {
  const { t, lang, formatNumber, formatDate } = useLanguage()

  if (!data) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-[#DC2626] rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#1E293B]">{t.admin.restricted}</h2>
        <p className="text-sm text-[#64748B] max-w-md mx-auto">
          {error || t.admin.restrictedDesc}
        </p>
      </div>
    )
  }

  const peopleSuffix = lang === 'bn' ? ' জন' : ' users'
  const countSuffix = lang === 'bn' ? ' টি' : ' items'
  const timesSuffix = lang === 'bn' ? ' বার' : ' times'

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.admin.title}
        description={t.admin.description}
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#2563EB] border border-blue-200 rounded-full text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          {t.admin.badge}
        </span>
      </PageHeader>

      {/* Aggregate Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t.admin.totalUsers}
          value={`${formatNumber(data.totalUsers)}${peopleSuffix}`}
          subtitle={t.admin.totalUsersSub}
          icon={Users}
          variant="primary"
        />
        <StatCard
          title={t.admin.totalMedicines}
          value={`${formatNumber(data.totalMedicinesRegistered)}${countSuffix}`}
          subtitle={t.admin.totalMedicinesSub}
          icon={Pill}
          variant="accent"
        />
        <StatCard
          title={t.admin.totalSchedules}
          value={`${formatNumber(data.totalSchedulesConfigured)}${countSuffix}`}
          subtitle={t.admin.totalSchedulesSub}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title={t.admin.totalResponses}
          value={`${formatNumber(data.totalIntakeResponsesRecorded)}${timesSuffix}`}
          subtitle={t.admin.totalResponsesSub}
          icon={Activity}
          variant="success"
        />
      </div>

      {/* Privacy Notice */}
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-[#2563EB] leading-relaxed">
        <strong>{lang === 'bn' ? 'গোপনীয়তা সুরক্ষা নীতি:' : 'Privacy Protection Notice:'}</strong>{' '}
        {t.admin.privacyNotice}
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs">
        <h3 className="font-bold text-base text-[#1E293B] mb-4">
          {t.admin.recentUsersTitle} ({formatNumber(data.recentUsers.length)}{peopleSuffix})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold">
              <tr>
                <th className="py-2.5 px-4">{t.admin.userId}</th>
                <th className="py-2.5 px-4">{t.admin.name}</th>
                <th className="py-2.5 px-4">{t.admin.email}</th>
                <th className="py-2.5 px-4">{t.admin.regDate}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {data.recentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono text-[11px] text-[#64748B]">
                    {u.id.slice(0, 8)}...
                  </td>
                  <td className="py-3 px-4 font-medium text-[#1E293B]">
                    {u.fullName || (lang === 'bn' ? 'উল্লেখ নেই' : 'Unspecified')}
                  </td>
                  <td className="py-3 px-4 text-[#64748B]">{u.email}</td>
                  <td className="py-3 px-4 text-[#64748B]">
                    {formatDate(u.createdAt.split('T')[0])}
                  </td>
                </tr>
              ))}
              {data.recentUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-[#64748B]">
                    {lang === 'bn' ? 'কোনো ইউজার পাওয়া যায়নি' : 'No users found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
