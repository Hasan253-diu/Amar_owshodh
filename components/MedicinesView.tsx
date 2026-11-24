'use client';

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { MedicineCard } from '@/components/MedicineCard';
import { EmptyState } from '@/components/EmptyState';
import { useLanguage } from '@/context/LanguageContext';
import type { Medicine } from '@/app/actions/medicines';

interface MedicinesViewProps {
  medicines: Medicine[];
}

export const MedicinesView: React.FC<MedicinesViewProps> = ({ medicines }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.medicines.title}
        description={t.medicines.description}
      >
        <Link
          href="/medicines/new"
          className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{t.medicines.addNew}</span>
        </Link>
      </PageHeader>

      {/* Grid of Medicines */}
      {medicines.length === 0 ? (
        <EmptyState
          title={t.medicines.noMedicines}
          description={t.medicines.noMedicinesDesc}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {medicines.map((med) => (
            <MedicineCard key={med.id} medicine={med} />
          ))}
        </div>
      )}
    </div>
  );
};
