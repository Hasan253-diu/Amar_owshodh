'use client';

import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { MedicineForm } from '@/components/MedicineForm';
import { useLanguage } from '@/context/LanguageContext';

export default function NewMedicinePage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.medicines.addTitle}
        description={t.medicines.addDescription}
      />

      <MedicineForm />
    </div>
  );
}
