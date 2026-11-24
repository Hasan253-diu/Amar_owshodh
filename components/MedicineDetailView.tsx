'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { ScheduleForm } from '@/components/ScheduleForm';
import { MedicineForm } from '@/components/MedicineForm';
import { useLanguage } from '@/context/LanguageContext';
import type { Medicine, MedicineSchedule } from '@/app/actions/medicines';

interface MedicineDetailViewProps {
  medicine: Medicine;
  schedules: MedicineSchedule[];
}

export const MedicineDetailView: React.FC<MedicineDetailViewProps> = ({ medicine, schedules }) => {
  const { t, formatTime } = useLanguage();

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/medicines"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#1E293B] mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.medicines.backToList}</span>
        </Link>
        <PageHeader
          title={medicine.name}
          description={t.medicines.editDescription}
        >
          <StatusBadge status={medicine.is_active ? 'active' : 'archived'} />
        </PageHeader>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Medicine Details & Edit */}
        <div>
          <h2 className="text-lg font-bold text-[#1E293B] mb-4">{t.medicines.editTitle}</h2>
          <MedicineForm initialData={medicine} isEdit={true} />
        </div>

        {/* Schedules for this medicine */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
            <h2 className="text-lg font-bold text-[#1E293B] mb-4">{t.medicines.schedulesForMedicine}</h2>

            {schedules.length === 0 ? (
              <p className="text-sm text-[#64748B] py-4 text-center">
                {t.medicines.noSchedulesForMedicine}
              </p>
            ) : (
              <div className="space-y-3">
                {schedules.map((sch) => (
                  <div
                    key={sch.id}
                    className="flex items-center justify-between p-3.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-[#2563EB] rounded-lg">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#1E293B]">
                          {formatTime(sch.reminder_time)}
                        </p>
                        <p className="text-xs text-[#64748B]">
                          {sch.repeat_days.map((d) => t.common.daysOfWeekShort[d]).join(', ')}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-medium">
                      {t.common.active}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-base font-bold text-[#1E293B] mb-3">{t.medicines.addNewSchedule}</h3>
            <ScheduleForm
              medicines={[medicine]}
              selectedMedicineId={medicine.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
