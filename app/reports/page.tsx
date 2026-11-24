import React from 'react'
import { ReportsView } from '@/components/ReportsView'
import { getTrackingReportsAction } from '@/app/actions/history'

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
  const res = await getTrackingReportsAction()
  const stats = res.data || {
    totalTaken: 0,
    totalSkipped: 0,
    totalPending: 0,
    adherenceRate: 0,
    weeklyBreakdown: [],
    monthlyBreakdown: [],
  }

  return <ReportsView stats={stats} />
}
