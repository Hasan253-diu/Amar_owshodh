'use client';

import React from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { ReminderCard } from "@/components/ReminderCard";
import { EmptyState } from "@/components/EmptyState";
import { Pill, Clock, CheckCircle2, AlertCircle, Plus, Calendar } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import type { IntakeLog } from "@/app/actions/intake";

interface DashboardViewProps {
  stats: {
    totalActiveMedicines: number;
    todayRemindersCount: number;
    takenCount: number;
    skippedCount: number;
    pendingCount: number;
    intakePercentage: number;
  };
  todayLogs: IntakeLog[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ stats, todayLogs }) => {
  const { t, formatNumber } = useLanguage();
  const { isGuest } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={t.dashboard.title}
        description={t.dashboard.description}
      >
        <Link
          href={isGuest ? "/login?message=guest_restricted" : "/medicines/new"}
          className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{t.dashboard.addNewMedicine}</span>
        </Link>
      </PageHeader>

      {/* Brand & Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600 rounded-2xl p-5 sm:p-6 text-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-white/20 backdrop-blur-xs rounded-full text-[11px] font-semibold">
            <span>{t.home.badge}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            {t.dashboard.title}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
            {t.dashboard.description}
          </p>
        </div>
        <div className="bg-white px-4 py-2.5 rounded-xl shadow-xs shrink-0 flex items-center justify-center">
          <img
            src="/logo.png"
            alt="আমার ঔষধ (Amar Owshodh)"
            className="w-[140px] sm:w-[170px] h-auto max-h-[60px] object-contain"
          />
        </div>
      </div>

      {/* Medical Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 shadow-2xs">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong>{t.common.disclaimerTitle}</strong> {t.common.disclaimerText}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t.dashboard.statActiveMedicines}
          value={`${formatNumber(stats.totalActiveMedicines)} ${t.dashboard.itemsCountSuffix}`.trim()}
          subtitle={t.dashboard.statActiveMedicinesSub}
          icon={Pill}
          variant="primary"
        />
        <StatCard
          title={t.dashboard.statTodayReminders}
          value={`${formatNumber(stats.todayRemindersCount)} ${t.dashboard.itemsCountSuffix}`.trim()}
          subtitle={t.dashboard.statTodayRemindersSub}
          icon={Calendar}
          variant="accent"
        />
        <StatCard
          title={t.dashboard.statTaken}
          value={`${formatNumber(stats.takenCount)} ${t.dashboard.itemsCountSuffix}`.trim()}
          subtitle={t.dashboard.statTakenSub}
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title={t.dashboard.statPending}
          value={`${formatNumber(stats.pendingCount)} ${t.dashboard.itemsCountSuffix}`.trim()}
          subtitle={t.dashboard.statPendingSub}
          icon={Clock}
          variant="warning"
        />
      </div>

      {/* Today's Schedule & Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Due Reminders List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
            <h2 className="font-bold text-lg text-[#1E293B]">{t.dashboard.todayScheduleTitle}</h2>
            <Link href="/schedule" className="text-xs font-semibold text-[#2563EB] hover:underline">
              {t.dashboard.viewAllSchedule}
            </Link>
          </div>

          {todayLogs.length === 0 ? (
            <EmptyState
              title={t.dashboard.noTodayReminders}
              description={t.dashboard.noTodayRemindersDesc}
            />
          ) : (
            <div className="space-y-3">
              {todayLogs.map((log) => (
                <ReminderCard key={log.id} log={log} />
              ))}
            </div>
          )}
        </div>

        {/* Tracking Summary Card */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-lg text-[#1E293B] pb-4 border-b border-[#E2E8F0] mb-4">
              {t.dashboard.weeklySummaryTitle}
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-[#64748B] mb-1">
                  <span>{t.dashboard.intakeRatio}</span>
                  <span className="text-[#16A34A] font-bold">{formatNumber(stats.intakePercentage)}%</span>
                </div>
                <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                  <div
                    className="bg-[#16A34A] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.intakePercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs text-[#64748B] space-y-2">
                <p className="font-semibold text-[#1E293B]">{t.dashboard.trackingRulesTitle}</p>
                <p className="leading-relaxed">
                  {t.dashboard.trackingRulesDesc}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E2E8F0]">
            <Link
              href="/reports"
              className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center justify-center"
            >
              {t.dashboard.viewDetailedReport}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
