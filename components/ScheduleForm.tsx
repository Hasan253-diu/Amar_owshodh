'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Calendar, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { createScheduleAction, type Medicine } from '@/app/actions/medicines'
import { useLanguage } from '@/context/LanguageContext'

interface ScheduleFormProps {
  medicines: Medicine[]
  selectedMedicineId?: string
  onSuccess?: () => void
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  medicines,
  selectedMedicineId,
  onSuccess,
}) => {
  const router = useRouter()
  const { t, lang } = useLanguage()
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6])

  const [startDate, setStartDate] = useState('')
  const [reminderTime, setReminderTime] = useState('08:00')
  const [medicineId, setMedicineId] = useState(selectedMedicineId || (medicines[0]?.id ?? ''))

  React.useEffect(() => {
    setStartDate(new Date().toISOString().split('T')[0])
  }, [])

  React.useEffect(() => {
    if (selectedMedicineId) {
      setMedicineId(selectedMedicineId)
    } else if (medicines[0]?.id) {
      setMedicineId(medicines[0].id)
    }
  }, [selectedMedicineId, medicines])

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length === 1) return
      setSelectedDays(selectedDays.filter((d) => d !== day))
    } else {
      setSelectedDays([...selectedDays, day].sort())
    }
  }

  const selectAllDays = () => setSelectedDays([0, 1, 2, 3, 4, 5, 6])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isLoading) return

    setError(null)
    setSuccessMsg(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.delete('repeatDays')
    selectedDays.forEach((d) => formData.append('repeatDays', d.toString()))

    try {
      const res = await createScheduleAction(formData)
      if (!res.success) {
        setError(res.error || t.schedule.addingScheduleButton)
        return
      }

      setSuccessMsg(t.schedule.successMessage)
      setReminderTime('08:00')
      setSelectedDays([0, 1, 2, 3, 4, 5, 6])
      if (formRef.current) {
        formRef.current.reset()
      }

      router.refresh()

      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      setError(err?.message || (lang === 'bn' ? 'অনাকাঙ্ক্ষিত সমস্যা দেখা দিয়েছে।' : 'An unexpected error occurred.'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-[#DC2626] rounded-lg text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-[#16A34A] rounded-lg text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">
          {t.schedule.selectMedicine} <span className="text-[#DC2626]">*</span>
        </label>
        <select
          name="medicineId"
          required
          value={medicineId}
          onChange={(e) => setMedicineId(e.target.value)}
          className="block w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#1E293B] bg-white"
        >
          {medicines.map((med) => (
            <option key={med.id} value={med.id}>
              {med.name} {med.notes ? `(${med.notes})` : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">
            {t.schedule.reminderTime} <span className="text-[#DC2626]">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
              <Clock className="h-4 w-4" />
            </div>
            <input
              type="time"
              name="reminderTime"
              required
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#1E293B] bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#1E293B] mb-1.5">
            {t.medicines.startDate} <span className="text-[#DC2626]">*</span>
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
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-[#1E293B]">
            {t.schedule.repeatDays} <span className="text-[#DC2626]">*</span>
          </label>
          <button
            type="button"
            onClick={selectAllDays}
            className="text-xs text-[#2563EB] hover:underline font-medium cursor-pointer"
          >
            {t.schedule.everyday}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {t.common.daysOfWeekShort.map((dayLabel, index) => {
            const isSelected = selectedDays.includes(index)
            return (
              <button
                type="button"
                key={index}
                onClick={() => toggleDay(index)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                    : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-slate-50'
                }`}
              >
                {dayLabel}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-xs transition-colors disabled:opacity-70 cursor-pointer"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{isLoading ? t.schedule.addingScheduleButton : t.schedule.addScheduleButton}</span>
        </button>
      </div>
    </form>
  )
}
