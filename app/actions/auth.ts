'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies, headers } from 'next/headers'
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
  emailNotConfirmed?: boolean
  emailVerificationRequired?: boolean
  email?: string
  requiresAuth?: boolean
  avatarUrl?: string
}

function formatAuthError(msg: string): string {
  if (!msg) return 'একটি অনাকাঙ্ক্ষিত সমস্যা দেখা দিয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
  const lower = msg.toLowerCase()
  if (lower.includes('invalid login credentials')) {
    return 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।'
  }
  if (lower.includes('email not confirmed')) {
    return 'আপনার ইমেইল অ্যাড্রেসটি এখনও ভেরিফাই করা হয়নি। অনুগ্রহ করে ইনবক্স চেক করে ভেরিফিকেশন সম্পন্ন করুন।'
  }
  if (lower.includes('user already registered') || lower.includes('already exists')) {
    return 'এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে। অনুগ্রহ করে লগইন করুন।'
  }
  if (lower.includes('rate limit')) {
    return 'ইমেইল পাঠানোর লিমিট অতিক্রম করেছে। অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করে আবার চেষ্টা করুন।'
  }
  if (lower.includes('password should be at least')) {
    return 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।'
  }
  return msg
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
    const isUnconfirmed = error.message.toLowerCase().includes('email not confirmed')
    return {
      success: false,
      error: formatAuthError(error.message),
      emailNotConfirmed: isUnconfirmed,
      email: validated.data.email,
    }
  }

  // Clear guest cookie upon verified login
  try {
    const cookieStore = await cookies()
    cookieStore.delete('amar_owshodh_guest')
  } catch {}

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
  const headerList = await headers()
  const host = headerList.get('host') || 'localhost:3000'
  const protocol = headerList.get('x-forwarded-proto') || 'http'
  const origin = `${protocol}://${host}`

  const { data, error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: validated.data.fullName,
        role: 'user',
      },
    },
  })

  if (error) {
    return {
      success: false,
      error: formatAuthError(error.message),
    }
  }

  // If user is created but waiting for email confirmation
  if (data.user && !data.session) {
    return {
      success: true,
      emailVerificationRequired: true,
      email: validated.data.email,
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function resendVerificationEmailAction(email: string): Promise<AuthResponse> {
  if (!email || !email.includes('@')) {
    return { success: false, error: 'সঠিক ইমেইল ঠিকানা প্রদান করুন।' }
  }

  const supabase = await createClient()
  const headerList = await headers()
  const host = headerList.get('host') || 'localhost:3000'
  const protocol = headerList.get('x-forwarded-proto') || 'http'
  const origin = `${protocol}://${host}`

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return {
      success: false,
      error: formatAuthError(error.message),
    }
  }

  return { success: true }
}

export async function guestLoginAction(): Promise<AuthResponse> {
  const supabase = await createClient()

  // 1. Try Supabase anonymous sign in if enabled
  try {
    const { data, error } = await supabase.auth.signInAnonymously({
      options: {
        data: {
          full_name: 'গেস্ট ব্যবহারকারী (Guest)',
          role: 'user',
        },
      },
    })

    if (!error && data?.session) {
      revalidatePath('/', 'layout')
      redirect('/dashboard')
    }
  } catch {
    // If anonymous sign in disabled on Supabase, fall through to secure guest cookie session
  }

  // 2. Establish a secure guest session cookie
  const cookieStore = await cookies()
  cookieStore.set('amar_owshodh_guest', 'true', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logoutAction() {
  const supabase = await createClient()
  try {
    await supabase.auth.signOut()
  } catch {}

  try {
    const cookieStore = await cookies()
    cookieStore.delete('amar_owshodh_guest')
  } catch {}

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function exitGuestModeAction() {
  const supabase = await createClient()
  try {
    await supabase.auth.signOut()
  } catch {}

  try {
    const cookieStore = await cookies()
    cookieStore.delete('amar_owshodh_guest')
  } catch {}

  revalidatePath('/', 'layout')
  redirect('/login')
}

const updateProfileSchema = z.object({
  fullName: z.string().min(2, { message: 'নাম কমপক্ষে ২ অক্ষরের হতে হবে' }),
  phoneNumber: z.string().optional().nullable(),
})

export async function updateProfileAction(formData: FormData): Promise<AuthResponse> {
  const rawData = {
    fullName: (formData.get('fullName') as string)?.trim() || '',
    phoneNumber: (formData.get('phoneNumber') as string)?.trim() || null,
  }

  const validated = updateProfileSchema.safeParse(rawData)
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || 'ভুল তথ্য প্রদান করা হয়েছে',
    }
  }

  const cookieStore = await cookies()
  const isGuestCookie = cookieStore.get('amar_owshodh_guest')?.value === 'true'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (isGuestCookie || !user || user.is_anonymous || user.id === 'guest-preview-user') {
    return {
      success: false,
      error: 'এই সুবিধাটি ব্যবহার করতে অনুগ্রহ করে লগইন বা রেজিস্ট্রেশন করুন। (Please login or create an account to use this feature.)',
      requiresAuth: true,
    }
  }

  // Update profiles table
  const updatePayload: Record<string, any> = {
    full_name: validated.data.fullName,
    phone_number: validated.data.phoneNumber || null,
    updated_at: new Date().toISOString(),
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update(updatePayload)
    .eq('id', user.id)

  if (profileError) {
    // If phone_number column does not exist yet before migration, update available columns
    if (profileError.code === '42703') {
      await supabase
        .from('profiles')
        .update({
          full_name: validated.data.fullName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
    } else {
      return { success: false, error: profileError.message }
    }
  }

  // Keep Supabase auth user_metadata in sync
  try {
    await supabase.auth.updateUser({
      data: {
        full_name: validated.data.fullName,
        phone_number: validated.data.phoneNumber || null,
      },
    })
  } catch {
    // Non-critical if user_metadata update fails
  }

  revalidatePath('/', 'layout')
  revalidatePath('/profile')
  return { success: true }
}

export async function uploadAvatarAction(formData: FormData): Promise<AuthResponse> {
  const cookieStore = await cookies()
  const isGuestCookie = cookieStore.get('amar_owshodh_guest')?.value === 'true'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (isGuestCookie || !user || user.is_anonymous || user.id === 'guest-preview-user') {
    return {
      success: false,
      error: 'এই সুবিধাটি ব্যবহার করতে অনুগ্রহ করে লগইন বা রেজিস্ট্রেশন করুন। (Please login or create an account to use this feature.)',
      requiresAuth: true,
    }
  }

  const file = formData.get('avatar') as File | null
  if (!file || !(file instanceof File) || file.size === 0) {
    return { success: false, error: 'অনুগ্রহ করে একটি ছবি নির্বাচন করুন।' }
  }

  // Size limit: 2MB
  const MAX_SIZE = 2 * 1024 * 1024
  if (file.size > MAX_SIZE) {
    return { success: false, error: 'ছবির সাইজ সর্বোচ্চ ২ মেগাবাইট (2MB) হতে পারবে।' }
  }

  // Format check
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: 'শুধুমাত্র JPG, PNG অথবা WEBP ফরম্যাটের ছবি আপলোড করা যাবে।' }
  }

  const ext = file.name.split('.').pop() || 'jpg'
  const filePath = `${user.id}/avatar-${Date.now()}.${ext}`

  let avatarUrl = ''

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Attempt upload to Supabase Storage bucket 'avatars'
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (!uploadError) {
      const { data: publicData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)
      avatarUrl = publicData.publicUrl
    } else {
      // Fallback: create optimized base64 data URI if bucket is not yet created
      const base64 = buffer.toString('base64')
      avatarUrl = `data:${file.type};base64,${base64}`
    }
  } catch {
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    avatarUrl = `data:${file.type};base64,${base64}`
  }

  // Save to profiles table
  try {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (profileError && profileError.code === '42703') {
      // Column might not exist yet if SQL migration is pending
    }
  } catch {}

  // Keep auth metadata in sync
  try {
    await supabase.auth.updateUser({
      data: {
        avatar_url: avatarUrl,
      },
    })
  } catch {}

  revalidatePath('/', 'layout')
  revalidatePath('/profile')
  return { success: true, avatarUrl }
}

export async function deleteAvatarAction(): Promise<AuthResponse> {
  const cookieStore = await cookies()
  const isGuestCookie = cookieStore.get('amar_owshodh_guest')?.value === 'true'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (isGuestCookie || !user || user.is_anonymous || user.id === 'guest-preview-user') {
    return {
      success: false,
      error: 'এই সুবিধাটি ব্যবহার করতে অনুগ্রহ করে লগইন বা রেজিস্ট্রেশন করুন।',
      requiresAuth: true,
    }
  }

  try {
    await supabase
      .from('profiles')
      .update({
        avatar_url: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
  } catch {}

  try {
    await supabase.auth.updateUser({
      data: {
        avatar_url: null,
      },
    })
  } catch {}

  revalidatePath('/', 'layout')
  revalidatePath('/profile')
  return { success: true }
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user && !user.is_anonymous && user.id !== 'guest-preview-user') {
    let { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    // Automatic Profile Creation if missing for existing or newly registered user
    if (!profile) {
      try {
        const newProfile = {
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || '',
          phone_number: user.user_metadata?.phone_number || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          role: (user.user_metadata?.role as 'user' | 'admin') || 'user',
        }
        const { data: insertedProfile } = await supabase
          .from('profiles')
          .insert(newProfile as any)
          .select()
          .single()
        if (insertedProfile) {
          profile = insertedProfile
        }
      } catch {
        // Fallback to in-memory representation
      }
    }

    return {
      user,
      profile: {
        id: user.id,
        email: user.email || profile?.email || '',
        full_name: profile?.full_name || user.user_metadata?.full_name || null,
        phone_number: profile?.phone_number || user.user_metadata?.phone_number || null,
        avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || null,
        role: (profile?.role || user.user_metadata?.role || 'user') as 'user' | 'admin',
        created_at: profile?.created_at || user.created_at,
        updated_at: profile?.updated_at || user.created_at,
        is_guest: false,
      },
    }
  }

  // Check guest session
  const cookieStore = await cookies()
  const isGuest = cookieStore.get('amar_owshodh_guest')?.value === 'true'

  if (isGuest || user?.is_anonymous) {
    return {
      user: {
        id: 'guest-preview-user',
        email: 'guest@amarowshodh.local',
        created_at: new Date().toISOString(),
        is_anonymous: true,
        user_metadata: {
          full_name: 'গেস্ট ব্যবহারকারী (Guest)',
          role: 'user',
        },
      } as any,
      profile: {
        id: 'guest-preview-user',
        email: 'guest@amarowshodh.local',
        full_name: 'গেস্ট ব্যবহারকারী (Guest)',
        phone_number: null,
        avatar_url: null,
        role: 'user' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_guest: true,
      },
    }
  }

  return null
}
