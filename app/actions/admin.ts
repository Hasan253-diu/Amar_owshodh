'use server'

import { createClient } from '@/lib/supabase/server'
import { ActionResponse } from './intake'

export interface AdminStats {
  totalUsers: number
  totalMedicinesRegistered: number
  totalSchedulesConfigured: number
  totalIntakeResponsesRecorded: number
  recentUsers: {
    id: string
    email: string
    fullName: string | null
    createdAt: string
  }[]
}

export type AdminAggregateStats = AdminStats

/**
 * Fetch system-level aggregate statistics for Admin role only.
 * Does not expose personal medical records or notes.
 */
export async function getAdminAggregateStatsAction(): Promise<ActionResponse<AdminStats>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'অননুমোদিত অনুরোধ' }
  }

  // Verify Admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const userProfile = profile as { role?: string } | null

  if (userProfile?.role !== 'admin') {
    return { success: false, error: 'অ্যাডমিন অধিকার আবশ্যক' }
  }

  // 1. Total users
  const { count: usersCount, data: recentProfiles } = await supabase
    .from('profiles')
    .select('id, email, full_name, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(10)

  // 2. Aggregate count of medicines across system
  const { count: medicinesCount } = await supabase
    .from('medicines')
    .select('*', { count: 'exact', head: true })

  // 3. Aggregate count of schedules
  const { count: schedulesCount } = await supabase
    .from('medicine_schedules')
    .select('*', { count: 'exact', head: true })

  // 4. Aggregate count of intake responses recorded
  const { count: intakeLogsCount } = await supabase
    .from('intake_logs')
    .select('*', { count: 'exact', head: true })

  return {
    success: true,
    data: {
      totalUsers: usersCount || 0,
      totalMedicinesRegistered: medicinesCount || 0,
      totalSchedulesConfigured: schedulesCount || 0,
      totalIntakeResponsesRecorded: intakeLogsCount || 0,
      recentUsers: (recentProfiles || []).map((p) => ({
        id: p.id,
        email: p.email,
        fullName: p.full_name,
        createdAt: p.created_at,
      })),
    },
  }
}
