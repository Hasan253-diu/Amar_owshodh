'use server'

import { createClient } from '@/lib/supabase/server'
import { IntakeLog, ActionResponse } from './intake'

export interface HistoryFilterParams {
  medicineId?: string
  status?: string
  startDate?: string
  endDate?: string
}

export interface ReportStats {
  totalTaken: number
  totalSkipped: number
  totalPending: number
  adherenceRate: number
  weeklyBreakdown: {
    day: string
    taken: number
    skipped: number
  }[]
  monthlyBreakdown: {
    month: string
    taken: number
    skipped: number
  }[]
}

/**
 * Fetch medicine history with filtering by medicine, status, and date range
 */
export async function getMedicineHistoryAction(
  params?: HistoryFilterParams
): Promise<ActionResponse<IntakeLog[]>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'অননুমোদিত অনুরোধ' }
  }

  let query = supabase
    .from('intake_logs')
    .select('*, medicines(id, name, notes, start_date, end_date)')
    .eq('user_id', user.id)
    .order('scheduled_date', { ascending: false })
    .order('scheduled_time', { ascending: false })

  if (params?.medicineId) {
    query = query.eq('medicine_id', params.medicineId)
  }

  if (params?.status && params.status !== 'all') {
    query = query.eq('status', params.status)
  }

  if (params?.startDate) {
    query = query.gte('scheduled_date', params.startDate)
  }

  if (params?.endDate) {
    query = query.lte('scheduled_date', params.endDate)
  }

  const { data, error } = await query

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: (data as unknown as IntakeLog[]) || [] }
}

/**
 * Fetch calendar intake occurrences for a specific month
 */
export async function getCalendarLogsAction(
  year: number,
  month: number // 1-12
): Promise<ActionResponse<Record<string, IntakeLog[]>>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'অননুমোদিত অনুরোধ' }
  }

  const monthStr = month < 10 ? `0${month}` : `${month}`
  const startOfMonth = `${year}-${monthStr}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const endOfMonth = `${year}-${monthStr}-${lastDay}`

  const { data, error } = await supabase
    .from('intake_logs')
    .select('*, medicines(id, name, notes)')
    .eq('user_id', user.id)
    .gte('scheduled_date', startOfMonth)
    .lte('scheduled_date', endOfMonth)
    .order('scheduled_time', { ascending: true })

  if (error) {
    return { success: false, error: error.message }
  }

  // Group logs by scheduled_date
  const grouped: Record<string, IntakeLog[]> = {}
  const logs = (data as unknown as IntakeLog[]) || []

  logs.forEach((log) => {
    if (!grouped[log.scheduled_date]) {
      grouped[log.scheduled_date] = []
    }
    grouped[log.scheduled_date].push(log)
  })

  return { success: true, data: grouped }
}

/**
 * Aggregate tracking report statistics
 */
export async function getTrackingReportsAction(): Promise<ActionResponse<ReportStats>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: true,
      data: {
        totalTaken: 0,
        totalSkipped: 0,
        totalPending: 0,
        adherenceRate: 0,
        weeklyBreakdown: [],
        monthlyBreakdown: [],
      },
    }
  }

  const { data, error } = await supabase
    .from('intake_logs')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  const logs = data || []
  let totalTaken = 0
  let totalSkipped = 0
  let totalPending = 0

  // Past 7 days structure
  const daysOfWeek = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি']
  const weeklyMap: Record<string, { taken: number; skipped: number }> = {}

  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayLabel = `${daysOfWeek[d.getDay()]} (${dateStr.slice(5)})`
    weeklyMap[dateStr] = { taken: 0, skipped: 0 }
  }

  logs.forEach((log) => {
    if (log.status === 'taken') totalTaken++
    else if (log.status === 'skipped') totalSkipped++
    else if (log.status === 'pending') totalPending++

    if (weeklyMap[log.scheduled_date]) {
      if (log.status === 'taken') weeklyMap[log.scheduled_date].taken++
      if (log.status === 'skipped') weeklyMap[log.scheduled_date].skipped++
    }
  })

  const weeklyBreakdown = Object.entries(weeklyMap).map(([dateStr, counts]) => {
    const d = new Date(dateStr)
    return {
      day: `${daysOfWeek[d.getDay()]} (${dateStr.slice(8)})`,
      taken: counts.taken,
      skipped: counts.skipped,
    }
  })

  const responded = totalTaken + totalSkipped
  const adherenceRate = responded > 0 ? Math.round((totalTaken / responded) * 100) : 0

  return {
    success: true,
    data: {
      totalTaken,
      totalSkipped,
      totalPending,
      adherenceRate,
      weeklyBreakdown,
      monthlyBreakdown: [],
    },
  }
}
