import React from 'react';
import { ScheduleView } from '@/components/ScheduleView';
import { getSchedulesAction, getMedicinesAction } from '@/app/actions/medicines';

export const dynamic = 'force-dynamic';

export default async function SchedulePage() {
  const [schedulesRes, medicinesRes] = await Promise.all([
    getSchedulesAction(),
    getMedicinesAction(),
  ]);

  const schedules = schedulesRes.data || [];
  const medicines = medicinesRes.data || [];

  return <ScheduleView schedules={schedules} medicines={medicines} />;
}
