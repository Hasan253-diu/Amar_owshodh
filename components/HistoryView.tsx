'use client'

import React, { useState } from 'react'
import { FileDown, Loader2, AlertCircle } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { generateHistoryPDF } from '@/lib/pdf/generateHistoryPDF'
import type { IntakeLog } from '@/app/actions/intake'
import type { Medicine } from '@/app/actions/medicines'

interface HistoryViewProps {
  initialLogs: IntakeLog[]
  medicines: Medicine[]
}

export const HistoryView: React.FC<HistoryViewProps> = ({ initialLogs, medicines }) => {
  const { t, language, formatTime, formatDate, formatNumber } = useLanguage()
  const { profile, user } = useAuth()
  const [selectedMedicine, setSelectedMedicine] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchDate, setSearchDate] = useState<string>('')
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [exportMessage, setExportMessage] = useState<string | null>(null)

  const filteredLogs = initialLogs.filter((log) => {
    if (selectedMedicine && log.medicine_id !== selectedMedicine) return false
    if (selectedStatus !== 'all' && log.status !== selectedStatus) return false
    if (searchDate && log.scheduled_date !== searchDate) return false
    return true
  })

  const handleDownloadPDF = async () => {
    if (filteredLogs.length === 0) {
      setExportMessage(t.history.noRecordsForPDF)
      return
    }

    setExportMessage(null)
    setIsGeneratingPDF(true)

    try {
      const selectedMedObj = medicines.find((m) => m.id === selectedMedicine)
      let statusLabel: string | undefined = undefined
      if (selectedStatus === 'taken') statusLabel = t.common.taken
      else if (selectedStatus === 'skipped') statusLabel = t.common.skipped
      else if (selectedStatus === 'pending') statusLabel = t.common.pending

      const patientName = profile?.full_name || user?.email?.split('@')[0] || t.common.user

      const res = await generateHistoryPDF({
        logs: filteredLogs,
        medicines,
        patientName,
        patientEmail: user?.email || undefined,
        language,
        filterSummary: {
          medicineName: selectedMedObj ? `${t.history.filterMedicine}: ${selectedMedObj.name}` : undefined,
          statusLabel: statusLabel ? `${t.history.filterStatus}: ${statusLabel}` : undefined,
          dateLabel: searchDate ? `${t.history.filterDate}: ${formatDate(searchDate)}` : undefined,
        },
        formatDate,
        formatTime,
        formatNumber,
      })

      if (!res.success && res.error === 'no_records') {
        setExportMessage(t.history.noRecordsForPDF)
      }
    } catch {
      setExportMessage(language === 'bn' ? 'PDF তৈরিতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।' : 'Failed to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t.history.title}
        description={t.history.description}
      >
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF || filteredLogs.length === 0}
          className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          title={filteredLogs.length === 0 ? t.history.noRecordsForPDF : t.history.downloadPDF}
        >
          {isGeneratingPDF ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileDown className="w-4 h-4" />
          )}
          <span>{isGeneratingPDF ? t.history.generatingPDF : t.history.downloadPDF}</span>
        </button>
      </PageHeader>

      {exportMessage && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{exportMessage}</span>
          </div>
          <button
            onClick={() => setExportMessage(null)}
            className="text-xs font-semibold text-amber-800 hover:underline cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[#64748B] mb-1">{t.history.filterMedicine}</label>
          <select
            value={selectedMedicine}
            onChange={(e) => setSelectedMedicine(e.target.value)}
            className="w-full px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-xs bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          >
            <option value="">{t.history.allMedicines}</option>
            {medicines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#64748B] mb-1">{t.history.filterStatus}</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-xs bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          >
            <option value="all">{t.history.allStatuses}</option>
            <option value="taken">{t.common.taken} (Taken)</option>
            <option value="skipped">{t.common.skipped} (Skipped)</option>
            <option value="pending">{t.common.pending} (Pending)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#64748B] mb-1">{t.history.filterDate}</label>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="w-full px-3 py-1.5 border border-[#E2E8F0] rounded-lg text-xs bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>
      </div>

      {/* History Data Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-xs">
        {filteredLogs.length === 0 ? (
          <EmptyState
            title={t.history.noHistory}
            description={t.history.noHistoryDesc}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">{t.history.tableMedicine}</th>
                  <th className="py-3 px-4">{t.history.tableSchedule}</th>
                  <th className="py-3 px-4">{t.history.tableStatus}</th>
                  <th className="py-3 px-4">{t.history.tableRecordedAt}</th>
                  <th className="py-3 px-4">{t.history.tableNotes}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#1E293B]">
                      {log.medicines?.name || t.navigation.medicines}
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B]">
                      {formatDate(log.scheduled_date)} • {formatTime(log.scheduled_time)}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B]">
                      {log.recorded_at ? (
                        <span>{new Date(log.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B] max-w-xs truncate">
                      {log.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
