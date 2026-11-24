'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Pill, Calendar, MoreVertical, Archive, Trash2, Edit } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { toggleArchiveMedicineAction, deleteMedicineAction, type Medicine } from '@/app/actions/medicines'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'

interface MedicineCardProps {
  medicine: Medicine
  onUpdate?: () => void
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ medicine, onUpdate }) => {
  const { t, formatDate } = useLanguage()
  const { isGuest } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleToggleArchive = async () => {
    if (isGuest) {
      window.location.href = '/login?message=guest_restricted'
      return
    }
    setIsProcessing(true)
    setShowMenu(false)
    await toggleArchiveMedicineAction(medicine.id, medicine.is_active)
    setIsProcessing(false)
    if (onUpdate) onUpdate()
  }

  const handleDelete = async () => {
    if (isGuest) {
      window.location.href = '/login?message=guest_restricted'
      return
    }
    if (!window.confirm(t.medicines.confirmDelete)) return
    setIsProcessing(true)
    setShowMenu(false)
    await deleteMedicineAction(medicine.id)
    setIsProcessing(false)
    if (onUpdate) onUpdate()
  }

  return (
    <div className={`bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs hover:border-slate-300 transition-all ${
      !medicine.is_active ? 'opacity-75 bg-slate-50/50' : ''
    } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-blue-50 text-[#2563EB] rounded-lg border border-blue-100 shrink-0">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <Link
              href={`/medicines/${medicine.id}`}
              className="font-bold text-base text-[#1E293B] hover:text-[#2563EB] transition-colors"
            >
              {medicine.name}
            </Link>
            {medicine.notes && (
              <p className="text-xs text-[#64748B] mt-1 line-clamp-2">{medicine.notes}</p>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC] rounded-lg transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-md border border-[#E2E8F0] py-1 z-20 text-xs">
              <Link
                href={`/medicines/${medicine.id}`}
                className="flex items-center gap-2 px-3 py-2 text-[#1E293B] hover:bg-[#F8FAFC]"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>{t.common.edit}</span>
              </Link>
              <button
                onClick={handleToggleArchive}
                className="w-full flex items-center gap-2 px-3 py-2 text-[#1E293B] hover:bg-[#F8FAFC] text-left cursor-pointer"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>{medicine.is_active ? t.common.archive : t.common.activate}</span>
              </button>
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2 px-3 py-2 text-[#DC2626] hover:bg-rose-50 text-left cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.common.delete}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{t.medicines.startDate}: {formatDate(medicine.start_date)}</span>
        </div>
        <StatusBadge status={medicine.is_active ? 'active' : 'archived'} />
      </div>
    </div>
  )
}
