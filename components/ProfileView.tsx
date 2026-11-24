'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  User,
  Mail,
  Calendar,
  Shield,
  Edit3,
  Check,
  X,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  KeyRound,
} from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { updateProfileAction } from '@/app/actions/auth'

export const ProfileView: React.FC = () => {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const { t, language, formatDate } = useLanguage()

  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || user?.user_metadata?.full_name || '')
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Sync state if profile loads asynchronously
  React.useEffect(() => {
    if (profile?.full_name && !isEditing) {
      setFullName(profile.full_name)
    }
  }, [profile, isEditing])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage(null)
    setErrorMessage(null)

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage(language === 'bn' ? 'নাম কমপক্ষে ২ অক্ষরের হতে হবে।' : 'Full name must be at least 2 characters.')
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('fullName', fullName.trim())

    try {
      const res = await updateProfileAction(formData)
      if (!res.success) {
        setErrorMessage(res.error || t.profile.updateError)
      } else {
        await refreshProfile()
        setSuccessMessage(t.profile.updateSuccess)
        setIsEditing(false)
      }
    } catch {
      setErrorMessage(t.profile.updateError)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setFullName(profile?.full_name || user?.user_metadata?.full_name || '')
    setIsEditing(false)
    setErrorMessage(null)
  }

  const userEmail = user?.email || profile?.email || t.profile.unspecified
  const displayName = profile?.full_name || user?.user_metadata?.full_name || userEmail.split('@')[0]
  const accountRole = profile?.role === 'admin' ? t.profile.adminRole : t.profile.userRole
  const createdAtFormatted = user?.created_at
    ? formatDate(user.created_at.split('T')[0])
    : profile?.created_at
    ? formatDate(profile.created_at.split('T')[0])
    : t.profile.unspecified

  // First letter for avatar placeholder
  const initialLetter = displayName ? displayName.charAt(0).toUpperCase() : 'U'

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header with Quick Return */}
      <PageHeader
        title={t.profile.title}
        description={t.profile.description}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#1E293B] rounded-lg text-xs font-semibold transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{t.profile.backToDashboard}</span>
          </Link>
          <button
            onClick={() => signOut()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-[#DC2626] border border-rose-200 rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.profile.logout}</span>
          </button>
        </div>
      </PageHeader>

      {/* Notifications / Alerts */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-700 hover:underline">
            ✕
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-[#DC2626] rounded-xl text-xs flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-700 hover:underline">
            ✕
          </button>
        </div>
      )}

      {/* Hero Profile Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar Area */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#2563EB] to-teal-500 text-white flex items-center justify-center font-extrabold text-3xl sm:text-4xl shadow-md border-4 border-white ring-2 ring-blue-100">
              {initialLetter}
            </div>
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-[#16A34A] border-2 border-white rounded-full" title="Active" />
          </div>

          {/* Profile Identity Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1E293B]">
                  {displayName}
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>{userEmail}</span>
                </p>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#2563EB] border border-blue-200 rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer self-center sm:self-start"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t.profile.editProfile}</span>
                </button>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-[#2563EB] border border-blue-200 rounded-full text-[11px] font-bold">
                <Shield className="w-3 h-3" />
                {accountRole}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-[#64748B] border border-[#E2E8F0] rounded-full text-[11px]">
                <Calendar className="w-3 h-3" />
                {createdAtFormatted}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-[#0D9488] border border-teal-200 rounded-full text-[11px] font-medium">
                <Sparkles className="w-3 h-3" />
                {t.common.appNameBn}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information / Edit Form */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs">
        <div className="border-b border-[#E2E8F0] pb-4 mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1E293B]">
              {t.profile.personalInfo}
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              {t.profile.personalInfoDesc}
            </p>
          </div>
          <User className="w-5 h-5 text-[#2563EB]" />
        </div>

        {isEditing ? (
          /* Edit Form */
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                {t.profile.fullName} <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.profile.fullNamePlaceholder}
                  className="block w-full pl-9 pr-3 py-2 border border-[#CBD5E1] rounded-lg text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1.5">
                  {t.profile.emailAddress}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={userEmail}
                    className="block w-full pl-9 pr-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#64748B] bg-[#F8FAFC] cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-[#64748B] mt-1">
                  {language === 'bn' ? 'ইমেইল অ্যাড্রেস পরিবর্তন করতে নিরাপত্তা যাচাই প্রয়োজন।' : 'Email address is locked to your Supabase Auth identity.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1.5">
                  {t.profile.accountRole}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
                    <Shield className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    disabled
                    value={accountRole}
                    className="block w-full pl-9 pr-3 py-2 border border-[#E2E8F0] rounded-lg text-sm text-[#64748B] bg-[#F8FAFC] cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t.profile.cancel}</span>
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>{isLoading ? t.profile.saving : t.profile.saveChanges}</span>
              </button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
              <span className="text-[#64748B] font-semibold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#2563EB]" />
                {t.profile.fullName}
              </span>
              <p className="font-bold text-sm text-[#1E293B]">
                {displayName}
              </p>
            </div>

            <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
              <span className="text-[#64748B] font-semibold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
                {t.profile.emailAddress}
              </span>
              <p className="font-bold text-sm text-[#1E293B]">
                {userEmail}
              </p>
            </div>

            <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
              <span className="text-[#64748B] font-semibold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#2563EB]" />
                {t.profile.accountRole}
              </span>
              <p className="font-bold text-sm text-[#1E293B]">
                {accountRole}
              </p>
            </div>

            <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
              <span className="text-[#64748B] font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                {t.profile.createdAt}
              </span>
              <p className="font-bold text-sm text-[#1E293B]">
                {createdAtFormatted}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Account Security & Quick Actions */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-[#2563EB] rounded-xl">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#1E293B]">
              {language === 'bn' ? 'সিস্টেম সেটিংস ও নিরাপত্তা' : 'System Settings & Security'}
            </h4>
            <p className="text-xs text-[#64748B]">
              {language === 'bn' ? 'ব্রাউজার নোটিফিকেশন অনুমতি ও ডাটা ব্যাকআপ ব্যবস্থাপনা করুন।' : 'Configure browser notifications and medication history backup.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/settings"
            className="w-full sm:w-auto text-center px-4 py-2 bg-slate-50 hover:bg-slate-100 text-[#1E293B] border border-[#CBD5E1] rounded-lg text-xs font-semibold transition-colors"
          >
            {language === 'bn' ? 'সেটিংসে যান' : 'Go to Settings'}
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto text-center px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
          >
            {t.profile.backToDashboard}
          </Link>
        </div>
      </div>
    </div>
  )
}
