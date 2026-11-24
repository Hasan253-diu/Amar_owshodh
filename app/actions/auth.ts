'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const loginSchema = z.object({
  email: z.string().email({ message: 'সঠিক ইমেইল এড্রেস লিখুন' }),
  password: z.string().min(6, { message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' }),
})

const registerSchema = z.object({
  fullName: z.string().min(2, { message: 'নাম কমপক্ষে ২ অক্ষরের হতে হবে' }),
  email: z.string().email({ message: 'সঠিক ইমেইল এড্রেস লিখুন' }),
  password: z.string().min(6, { message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' }),
})

export type AuthResponse = {
  success: boolean
  error?: string
}

export async function loginAction(formData: FormData): Promise<AuthResponse> {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const validated = loginSchema.safeParse(rawData)
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || 'ভুল তথ্য প্রদান করা হয়েছে',
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: validated.data.email,
    password: validated.data.password,
  })

  if (error) {
    return {
      success: false,
      error: error.message === 'Invalid login credentials' 
        ? 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।' 
        : error.message,
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function registerAction(formData: FormData): Promise<AuthResponse> {
  const rawData = {
    fullName: formData.get('fullName') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const validated = registerSchema.safeParse(rawData)
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || 'ভুল তথ্য প্রদান করা হয়েছে',
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
    options: {
      data: {
        full_name: validated.data.fullName,
        role: 'user',
      },
    },
  })

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

const updateProfileSchema = z.object({
  fullName: z.string().min(2, { message: 'নাম কমপক্ষে ২ অক্ষরের হতে হবে' }),
})

export async function updateProfileAction(formData: FormData): Promise<AuthResponse> {
  const rawData = {
    fullName: (formData.get('fullName') as string)?.trim() || '',
  }

  const validated = updateProfileSchema.safeParse(rawData)
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || 'ভুল তথ্য প্রদান করা হয়েছে',
    }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'অননুমোদিত অনুরোধ' }
  }

  // Update profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      full_name: validated.data.fullName,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (profileError) {
    return { success: false, error: profileError.message }
  }

  // Keep Supabase auth user_metadata in sync
  try {
    await supabase.auth.updateUser({
      data: {
        full_name: validated.data.fullName,
      },
    })
  } catch {
    // Non-critical if user_metadata update fails
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    user,
    profile,
  }
}
