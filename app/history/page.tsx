import React from 'react'
import { HistoryView } from '@/components/HistoryView'
import { getMedicineHistoryAction } from '@/app/actions/history'
import { getMedicinesAction } from '@/app/actions/medicines'

export const dynamic = 'force-dynamic'

export default async function HistoryPage() {
  const [historyRes, medsRes] = await Promise.all([
    getMedicineHistoryAction(),
    getMedicinesAction(),
  ])

  const logs = historyRes.data || []
  const medicines = medsRes.data || []

  return (
    <HistoryView
      initialLogs={logs}
      medicines={medicines}
    />
  )
}
