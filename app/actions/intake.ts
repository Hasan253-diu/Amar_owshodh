'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'

export type IntakeStatus = 'pending' | 'taken' | 'skipped'

export interface IntakeLog {
  id: string
  schedule_id: string
  medicine_id: string
  user_id: string
  scheduled_date: string
  scheduled_time: string
  status: IntakeStatus
  recorded_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
  medicines?: {
    id: string
    name: string
    notes: string | null
    start_date?: string | null
    end_date?: string | null
  }
}

export interface AppNotification {
  id: string
  user_id: string
  intake_log_id: string | null
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export type ActionResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}

/**
 * Generates due intake logs for a given date (default today) based on active schedules
 * Avoids duplicates using unique constraint and upsert/insert checks.
 */
export async function generateDueRemindersAction(targetDateStr?: string): Promise<ActionResponse<{ generatedCount: number }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'অননুমোদিত অনুরোধ' }
  }

  const targetDate = targetDateStr ? new Date(targetDateStr) : new Date()
  const dateFormatted = targetDate.toISOString().split('T')[0] // YYYY-MM-DD
  const dayOfWeek = targetDate.getDay() // 0 = Sun, 1 = Mon ... 6 = Sat

  // Fetch active schedules for this user that fall within the start/end date range
  const { data: schedules, error: scheduleError } = await supabase
    .from('medicine_schedules')
    .select('*, medicines!inner(*)')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .eq('medicines.is_active', true)
    .lte('start_date', dateFormatted)

  if (scheduleError) {
    return { success: false, error: scheduleError.message }
  }

  if (!schedules || schedules.length === 0) {
    return { success: true, data: { generatedCount: 0 } }
  }

  let generatedCount = 0

  for (const sch of schedules) {
    // Check if end_date exists and if targetDate exceeds it
    if (sch.end_date && dateFormatted > sch.end_date) {
      continue
    }

    // Check repeat_days
    const repeatDays: number[] = sch.repeat_days || []
    if (!repeatDays.includes(dayOfWeek)) {
      continue
    }

    // Ensure reminder_time is HH:MM:SS
    let remTime = sch.reminder_time
    if (remTime.length === 5) {
      remTime = `${remTime}:00`
    }

    // Check if intake log already exists for this schedule occurrence
    const { data: existing } = await supabase
      .from('intake_logs')
      .select('id')
      .eq('schedule_id', sch.id)
      .eq('scheduled_date', dateFormatted)
      .eq('scheduled_time', remTime)
      .maybeSingle()

    if (!existing) {
      // Insert new pending intake log
      const { data: newLog, error: insertError } = await supabase
        .from('intake_logs')
        .insert({
          user_id: user.id,
          schedule_id: sch.id,
          medicine_id: sch.medicine_id,
          scheduled_date: dateFormatted,
          scheduled_time: remTime,
          status: 'pending',
        } as any)
        .select()
        .single()

      if (!insertError && newLog) {
        generatedCount++
        // Create in-app notification record
        const medicineName = sch.medicines?.name || 'ঔষধ'
        await supabase.from('notifications').insert({
          user_id: user.id,
          intake_log_id: (newLog as any).id,
          title: `ঔষধ গ্রহণের সময়: ${medicineName}`,
          message: `আজ ${dateFormatted} সময় ${remTime.slice(0, 5)} এ আপনার ${medicineName} গ্রহণের শিডিউল রয়েছে।`,
          is_read: false,
        } as any)
      }
    }
  }

  return { success: true, data: { generatedCount } }
}

/**
 * Fetch today's intake logs with joined medicine data
 */
export async function getTodayIntakeLogsAction(dateStr?: string): Promise<ActionResponse<IntakeLog[]>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'অননুমোদিত অনুরোধ' }
  }

  const queryDate = dateStr || new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('intake_logs')
    .select('*, medicines(id, name, notes)')
    .eq('user_id', user.id)
    .eq('scheduled_date', queryDate)
    .order('scheduled_time', { ascending: true })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: (data as unknown as IntakeLog[]) || [] }
}

/**
 * Record user response: Taken or Skipped
 */
export async function recordIntakeStatusAction(
  intakeLogId: string,
  status: 'taken' | 'skipped',
  notes?: string
): Promise<ActionResponse<IntakeLog>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'অননুমোদিত অনুরোধ' }
  }

  const { data, error } = await supabase
    .from('intake_logs')
    .update({
      status,
      recorded_at: new Date().toISOString(),
      notes: notes || null,
      updated_at: new Date().toISOString(),
    } as any)
    .eq('id', intakeLogId)
    .eq('user_id', user.id)
    .select('*, medicines(id, name, notes)')
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/history')
  return { success: true, data: data as unknown as IntakeLog }
}

/**
 * Fetch notifications for current user
 */
export async function getNotificationsAction(): Promise<ActionResponse<AppNotification[]>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'অননুমোদিত অনুরোধ' }
  }

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: (data as AppNotification[]) || [] }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsReadAction(notificationId: string): Promise<ActionResponse> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'অননুমোদিত অনুরোধ' }
  }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true } as any)
    .eq('id', notificationId)
    .eq('user_id', user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Fetch dashboard overview statistics calculated from real records
 */
export async function getDashboardStatsAction(): Promise<ActionResponse<{
  totalActiveMedicines: number
  todayRemindersCount: number
  takenCount: number
  skippedCount: number
  pendingCount: number
  intakePercentage: number
}>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: true,
      data: {
        totalActiveMedicines: 0,
        todayRemindersCount: 0,
        takenCount: 0,
        skippedCount: 0,
        pendingCount: 0,
        intakePercentage: 0,
      },
    }
  }

  const todayStr = new Date().toISOString().split('T')[0]

  // 1. Total active medicines
  const { count: activeMedsCount } = await supabase
    .from('medicines')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_active', true)

  // 2. Today's intake logs
  const { data: todayLogs } = await supabase
    .from('intake_logs')
    .select('status')
    .eq('user_id', user.id)
    .eq('scheduled_date', todayStr)

  const logs = todayLogs || []
  const todayRemindersCount = logs.length
  const takenCount = logs.filter((l) => l.status === 'taken').length
  const skippedCount = logs.filter((l) => l.status === 'skipped').length
  const pendingCount = logs.filter((l) => l.status === 'pending').length

  const respondedCount = takenCount + skippedCount
  const intakePercentage = respondedCount > 0 ? Math.round((takenCount / respondedCount) * 100) : 0

  return {
    success: true,
    data: {
      totalActiveMedicines: activeMedsCount || 0,
      todayRemindersCount,
      takenCount,
      skippedCount,
      pendingCount,
      intakePercentage,
    },
  }
}
