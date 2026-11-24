'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pill, Calendar, FileText, AlertCircle, Loader2 } from 'lucide-react'
import { createMedicineAction, updateMedicineAction, type Medicine } from '@/app/actions/medicines'
import { useLanguage } from '@/context/LanguageContext'

interface MedicineFormProps {
  initialData?: Medicine
  isEdit?: boolean
}

export const MedicineForm: React.FC<MedicineFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter()
  const { t, lang } = useLanguage()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [startDate, setStartDate] = useState(initialData?.start_date || '')

  React.useEffect(() => {
    if (!initialData?.start_date) {
      setStartDate(new Date().toISOString().split('T')[0])
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      if (isEdit && initialData) {
        const res = await updateMedicineAction(initialData.id, formData)
        if (!res.success) {
          setError(res.error || t.medicines.updateMedicine)
          setIsLoading(false)
          return
        }
        router.push(`/medicines/${initialData.id}`)
      } else {
        const res = await createMedicineAction(formData)
        if (!res.success) {
          setError(res.error || t.medicines.saveMedicine)
          setIsLoading(false)
          return
        }
        router.push('/medicines')
      }
    } catch {
      setError(lang === 'bn' ? 'অনাকাঙ্ক্ষিত সমস্যা দেখা দিয়েছে।' : 'An unexpected error occurred.')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 sm:p-8 rounded-xl border border-[#E2E8F0] shadow-xs">
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-[#DC2626] rounded-lg text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Medical Disclaimer Reminder */}
      <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-lg text-xs text-[#2563EB] flex items-center gap-2">
        <Pill className="w-4 h-4 shrink-0" />
        <span>{t.medicines.prescriptionReminder}</span>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">
          {t.medicines.nameLabel} <span className="text-[#DC2626]">{t.medicines.required}</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
            <Pill className="h-4 w-4" />
          </div>
          <input
            type="text"
            name="name"
            required
            defaultValue={initialData?.name || ''}
            placeholder={t.medicines.namePlaceholder}
            className="block w-full pl-9 pr-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#1E293B] bg-white placeholder-[#64748B]/60"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">
            {t.medicines.startDate} <span className="text-[#DC2626]">{t.medicines.required}</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
              <Calendar className="h-4 w-4" />
            </div>
            <input
              type="date"
              name="startDate"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#1E293B] bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">
            {t.medicines.endDate} <span className="text-xs font-normal text-[#64748B]">{t.medicines.optional}</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
              <Calendar className="h-4 w-4" />
            </div>
            <input
              type="date"
              name="endDate"
              defaultValue={initialData?.end_date || ''}
              className="block w-full pl-9 pr-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#1E293B] bg-white"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">
          {t.medicines.notesLabel} <span className="text-xs font-normal text-[#64748B]">{t.medicines.optional}</span>
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none text-[#64748B]">
            <FileText className="h-4 w-4" />
          </div>
          <textarea
            name="notes"
            rows={3}
            defaultValue={initialData?.notes || ''}
            placeholder={t.medicines.notesPlaceholder}
            className="block w-full pl-9 pr-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#1E293B] bg-white placeholder-[#64748B]/60"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#64748B] hover:bg-slate-50 transition-colors cursor-pointer"
        >
          {t.common.cancel}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-xs transition-colors disabled:opacity-70 cursor-pointer"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{isEdit ? t.medicines.updateMedicine : t.medicines.saveMedicine}</span>
        </button>
      </div>
    </form>
  )
}
