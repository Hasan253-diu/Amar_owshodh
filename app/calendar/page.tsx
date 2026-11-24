import React from 'react'
import { CalendarView } from '@/components/CalendarView'
import { getCalendarLogsAction } from '@/app/actions/history'

export const dynamic = 'force-dynamic'

export default async function CalendarPage() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  const res = await getCalendarLogsAction(year, month)
  const groupedLogs = res.data || {}

  return (
    <CalendarView
      initialLogsGrouped={groupedLogs}
      currentYear={year}
      currentMonth={month}
    />
  )
}
