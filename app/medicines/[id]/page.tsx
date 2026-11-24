import React from 'react';
import { notFound } from 'next/navigation';
import { MedicineDetailView } from '@/components/MedicineDetailView';
import { getMedicineByIdAction } from '@/app/actions/medicines';

export const dynamic = 'force-dynamic';

interface MedicineDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MedicineDetailPage({ params }: MedicineDetailPageProps) {
  const { id } = await params;
  const res = await getMedicineByIdAction(id);

  if (!res.success || !res.data) {
    notFound();
  }

  const { medicine, schedules } = res.data;

  return <MedicineDetailView medicine={medicine} schedules={schedules} />;
}
