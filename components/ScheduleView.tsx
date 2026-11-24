'use client';

import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { ScheduleForm } from '@/components/ScheduleForm';
import { EmptyState } from '@/components/EmptyState';
import { Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import type { MedicineSchedule, Medicine } from '@/app/actions/medicines';

interface ScheduleViewProps {
  schedules: (MedicineSchedule & { medicines?: Medicine })[];
  medicines: Medicine[];
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ schedules, medicines }) => {
  const { t, formatTime, formatNumber } = useLanguage();

  return (
    <div className="space-y-8">
      <PageHeader
        title={t.schedule.title}
        description={t.schedule.description}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Schedule List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs">
            <h2 className="font-bold text-lg text-[#1E293B] mb-4">
              {t.schedule.allSchedules} ({formatNumber(schedules.length)} {t.dashboard.itemsCountSuffix})
            </h2>

            {schedules.length === 0 ? (
              <EmptyState
                title={t.schedule.noSchedules}
                description={t.schedule.noSchedulesDesc}
              />
            ) : (
              <div className="space-y-3">
                {schedules.map((sch) => (
                  <div
                    key={sch.id}
                    className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 bg-blue-50 text-[#2563EB] rounded-lg border border-blue-100">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#1E293B]">
                          {sch.medicines?.name || t.navigation.medicines}
                        </h4>
                        <p className="text-xs text-[#64748B] mt-0.5">
                          {t.schedule.timePrefix} {formatTime(sch.reminder_time)} • {sch.repeat_days.map((d) => t.common.daysOfWeekShort[d]).join(', ')}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 bg-blue-50 text-[#2563EB] border border-blue-200 rounded-full font-medium">
                      {sch.is_active ? t.common.active : t.common.archived}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create Schedule Form */}
        <div>
          <h2 className="font-bold text-lg text-[#1E293B] mb-4">{t.schedule.addNewSchedule}</h2>
          {medicines.length === 0 ? (
            <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] text-center">
              <p className="text-sm text-[#64748B] mb-4">
                {t.schedule.mustAddMedicineFirst}
              </p>
              <a
                href="/medicines/new"
                className="inline-block px-4 py-2 bg-[#2563EB] text-white text-xs font-semibold rounded-lg"
              >
                {t.medicines.addNew}
              </a>
            </div>
          ) : (
            <ScheduleForm medicines={medicines} />
          )}
        </div>
      </div>
    </div>
  );
};
