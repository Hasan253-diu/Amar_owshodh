'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

async function verifyAuthUser(supabase: any) {
  const cookieStore = await cookies()
  const isGuestCookie = cookieStore.get('amar_owshodh_guest')?.value === 'true'
  const { data: { user } } = await supabase.auth.getUser()

  if (isGuestCookie || !user || user.is_anonymous || user.id === 'guest-preview-user') {
    return {
      isAllowed: false,
      user: null,
      error: 'এই সুবিধাটি ব্যবহার করতে অনুগ্রহ করে লগইন বা রেজিস্ট্রেশন করুন। (Please login or create an account to use this feature.)',
      requiresAuth: true,
    }
  }

  return { isAllowed: true, user }
}

export interface Medicine {
  id: string
  user_id: string
  name: string
  notes: string | null
  start_date: string
  end_date: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MedicineSchedule {
  id: string
  medicine_id: string
  user_id: string
  reminder_time: string
  repeat_days: number[]
  start_date: string
  end_date: string | null
  timezone: string
  is_active: boolean
  created_at: string
  updated_at: string
}

const medicineSchema = z.object({
  name: z.string().min(1, { message: 'ঔষধের নাম প্রদান করা আবশ্যক' }),
  notes: z.string().optional(),
  startDate: z.string().min(1, { message: 'শুরুর তারিখ নির্বাচন করুন' }),
  endDate: z.string().optional().nullable(),
})

const scheduleSchema = z.object({
  medicineId: z.string().uuid({ message: 'সঠিক ঔষধ নির্বাচন করুন' }),
  reminderTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/, {
    message: 'সঠিক সময় (HH:MM) প্রদান করুন',
  }),
  repeatDays: z.array(z.number()).min(1, { message: 'কমপক্ষে একদিন নির্বাচন করতে হবে' }),
  startDate: z.string().min(1, { message: 'শুরুর তারিখ নির্বাচন করুন' }),
  endDate: z.string().optional().nullable(),
})

export type ActionResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}

// ==========================================
// MEDICINE ACTIONS
// ==========================================

export async function getMedicinesAction(): Promise<ActionResponse<Medicine[]>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'অননুমোদিত অনুরোধ। অনুগ্রহ করে লগইন করুন।' }
  }

  const { data, error } = await supabase
    .from('medicines')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: (data as Medicine[]) || [] }
}

export async function getMedicineByIdAction(id: string): Promise<ActionResponse<{ medicine: Medicine; schedules: MedicineSchedule[] }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'অননুমোদিত অনুরোধ' }
  }

  const { data: medicine, error: medError } = await supabase
    .from('medicines')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (medError || !medicine) {
    return { success: false, error: 'ঔষধ পাওয়া যায়নি' }
  }

  const { data: schedules } = await supabase
    .from('medicine_schedules')
    .select('*')
    .eq('medicine_id', id)
    .eq('user_id', user.id)
    .order('reminder_time', { ascending: true })

  return {
    success: true,
    data: {
      medicine: medicine as Medicine,
      schedules: (schedules as MedicineSchedule[]) || [],
    },
  }
}

export async function createMedicineAction(formData: FormData): Promise<ActionResponse<Medicine>> {
  const supabase = await createClient()
  const authCheck = await verifyAuthUser(supabase)
  if (!authCheck.isAllowed || !authCheck.user) {
    return { success: false, error: authCheck.error }
  }
  const user = authCheck.user

  const rawData = {
    name: formData.get('name') as string,
    notes: (formData.get('notes') as string) || undefined,
    startDate: formData.get('startDate') as string,
    endDate: (formData.get('endDate') as string) || null,
  }

  const validated = medicineSchema.safeParse(rawData)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message }
  }

  const { data, error } = await supabase
    .from('medicines')
    .insert({
      user_id: user.id,
      name: validated.data.name,
      notes: validated.data.notes || null,
      start_date: validated.data.startDate,
      end_date: validated.data.endDate,
      is_active: true,
    } as any)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/medicines')
  revalidatePath('/dashboard')
  return { success: true, data: data as Medicine }
}

export async function updateMedicineAction(id: string, formData: FormData): Promise<ActionResponse<Medicine>> {
  const supabase = await createClient()
  const authCheck = await verifyAuthUser(supabase)
  if (!authCheck.isAllowed || !authCheck.user) {
    return { success: false, error: authCheck.error }
  }
  const user = authCheck.user

  const rawData = {
    name: formData.get('name') as string,
    notes: (formData.get('notes') as string) || undefined,
    startDate: formData.get('startDate') as string,
    endDate: (formData.get('endDate') as string) || null,
  }

  const validated = medicineSchema.safeParse(rawData)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message }
  }

  const { data, error } = await supabase
    .from('medicines')
    .update({
      name: validated.data.name,
      notes: validated.data.notes || null,
      start_date: validated.data.startDate,
      end_date: validated.data.endDate,
      updated_at: new Date().toISOString(),
    } as any)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/medicines')
  revalidatePath(`/medicines/${id}`)
  revalidatePath('/dashboard')
  return { success: true, data: data as Medicine }
}

export async function toggleArchiveMedicineAction(id: string, currentStatus: boolean): Promise<ActionResponse> {
  const supabase = await createClient()
  const authCheck = await verifyAuthUser(supabase)
  if (!authCheck.isAllowed || !authCheck.user) {
    return { success: false, error: authCheck.error }
  }
  const user = authCheck.user

  const { error } = await supabase
    .from('medicines')
    .update({
      is_active: !currentStatus,
      updated_at: new Date().toISOString(),
    } as any)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/medicines')
  revalidatePath(`/medicines/${id}`)
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteMedicineAction(id: string): Promise<ActionResponse> {
  const supabase = await createClient()
  const authCheck = await verifyAuthUser(supabase)
  if (!authCheck.isAllowed || !authCheck.user) {
    return { success: false, error: authCheck.error }
  }
  const user = authCheck.user

  const { error } = await supabase
    .from('medicines')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/medicines')
  revalidatePath('/dashboard')
  return { success: true }
}

// ==========================================
// SCHEDULE ACTIONS
// ==========================================

export async function getSchedulesAction(): Promise<ActionResponse<(MedicineSchedule & { medicines?: Medicine })[]>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'অননুমোদিত অনুরোধ' }
  }

  const { data, error } = await supabase
    .from('medicine_schedules')
    .select('*, medicines(*)')
    .eq('user_id', user.id)
    .order('reminder_time', { ascending: true })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: (data as unknown as (MedicineSchedule & { medicines?: Medicine })[]) || [] }
}

export async function createScheduleAction(formData: FormData): Promise<ActionResponse<MedicineSchedule>> {
  const supabase = await createClient()
  const authCheck = await verifyAuthUser(supabase)
  if (!authCheck.isAllowed || !authCheck.user) {
    return { success: false, error: authCheck.error }
  }
  const user = authCheck.user

  const repeatDaysRaw = formData.getAll('repeatDays')
  const repeatDays = repeatDaysRaw.map((d) => parseInt(d as string, 10))

  const rawData = {
    medicineId: formData.get('medicineId') as string,
    reminderTime: formData.get('reminderTime') as string,
    repeatDays: repeatDays.length > 0 ? repeatDays : [0, 1, 2, 3, 4, 5, 6],
    startDate: formData.get('startDate') as string,
    endDate: (formData.get('endDate') as string) || null,
  }

  const validated = scheduleSchema.safeParse(rawData)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message }
  }

  let formattedTime = validated.data.reminderTime
  if (formattedTime.length === 5) {
    formattedTime = `${formattedTime}:00`
  }

  const { data, error } = await supabase
    .from('medicine_schedules')
    .insert({
      user_id: user.id,
      medicine_id: validated.data.medicineId,
      reminder_time: formattedTime,
      repeat_days: validated.data.repeatDays,
      start_date: validated.data.startDate,
      end_date: validated.data.endDate,
      is_active: true,
    } as any)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/schedule')
  revalidatePath(`/medicines/${validated.data.medicineId}`)
  revalidatePath('/dashboard')
  return { success: true, data: data as MedicineSchedule }
}

export async function toggleScheduleAction(id: string, currentStatus: boolean): Promise<ActionResponse> {
  const supabase = await createClient()
  const authCheck = await verifyAuthUser(supabase)
  if (!authCheck.isAllowed || !authCheck.user) {
    return { success: false, error: authCheck.error }
  }
  const user = authCheck.user

  const { error } = await supabase
    .from('medicine_schedules')
    .update({
      is_active: !currentStatus,
      updated_at: new Date().toISOString(),
    } as any)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/schedule')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteScheduleAction(id: string): Promise<ActionResponse> {
  const supabase = await createClient()
  const authCheck = await verifyAuthUser(supabase)
  if (!authCheck.isAllowed || !authCheck.user) {
    return { success: false, error: authCheck.error }
  }
  const user = authCheck.user

  const { error } = await supabase
    .from('medicine_schedules')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/schedule')
  revalidatePath('/dashboard')
  return { success: true }
}
