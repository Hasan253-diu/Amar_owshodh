'use client'

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { IntakeLog } from '@/app/actions/intake'
import type { Medicine } from '@/app/actions/medicines'

export interface GenerateHistoryPDFParams {
  logs: IntakeLog[]
  medicines: Medicine[]
  patientName: string
  patientEmail?: string
  language: 'bn' | 'en'
  filterSummary?: {
    medicineName?: string
    statusLabel?: string
    dateLabel?: string
  }
  formatDate: (date: Date | string) => string
  formatTime: (timeStr: string) => string
  formatNumber: (num: number | string) => string
}

export async function generateHistoryPDF(params: GenerateHistoryPDFParams): Promise<{ success: boolean; error?: string }> {
  const {
    logs,
    medicines,
    patientName,
    patientEmail,
    language,
    filterSummary,
    formatDate,
    formatTime,
    formatNumber,
  } = params

  if (!logs || logs.length === 0) {
    return { success: false, error: 'no_records' }
  }

  // Create lookup map for medicines
  const medMap = new Map<string, Medicine>()
  medicines.forEach((m) => medMap.set(m.id, m))

  const isBn = language === 'bn'

  // Labels dictionary
  const labels = {
    reportTitle: isBn ? 'ঔষধ গ্রহণের ইতিহাস ও পর্যবেক্ষণ বিবরণী' : 'Medication Intake History & Tracking Report',
    patientName: isBn ? 'রোগীর নাম' : 'Patient Name',
    patientEmail: isBn ? 'ইমেইল এড্রেস' : 'Email Address',
    generatedDate: isBn ? 'রিপোর্ট তৈরির তারিখ ও সময়' : 'Report Generated At',
    totalRecords: isBn ? 'মোট রেকর্ড সংখ্যা' : 'Total Records',
    filterCriteria: isBn ? 'ফিল্টার প্রয়োগ' : 'Filter Applied',
    colMedicine: isBn ? 'ঔষধের নাম' : 'Medicine Name',
    colDosage: isBn ? 'ডোজ' : 'Dosage',
    colStartDate: isBn ? 'শুরুর তারিখ' : 'Start Date',
    colEndDate: isBn ? 'সমাপ্তির তারিখ' : 'End Date',
    colFrequency: isBn ? 'ফ্রিকোয়েন্সি / সময়' : 'Frequency / Time',
    colInstructions: isBn ? 'নির্দেশনা / নোট' : 'Instructions / Notes',
    colStatus: isBn ? 'স্ট্যাটাস' : 'Status',
    statusTaken: isBn ? 'গৃহীত (Taken)' : 'Taken',
    statusSkipped: isBn ? 'বাদ দেওয়া (Skipped)' : 'Skipped',
    statusPending: isBn ? 'অপেক্ষমান (Pending)' : 'Pending',
    ongoing: isBn ? 'চলমান' : 'Ongoing',
    unspecified: isBn ? 'উল্লেখ্য নেই' : 'Not specified',
    disclaimerTitle: isBn ? 'জরুরি চিকিৎসাগত দায়মুক্তি ও সতর্কতা:' : 'Medical Disclaimer & Safety Notice:',
    disclaimerText: isBn
      ? 'এই রিপোর্টটি শুধুমাত্র রোগীর ব্যক্তিগত রেকর্ড ব্যবস্থাপনা ও ট্র্যাকিং সহায়িকা। এটি কোনো প্রকার রোগ নির্ণয়, প্রেসক্রিপশন প্রদান বা চিকিৎসাগত পরামর্শ হিসেবে গণ্য হবে না। সর্বদা রেজিস্টার্ড চিকিৎসকের পরামর্শ ও নির্দেশ অনুযায়ী ঔষধ সেবন করুন।'
      : 'This report is for personal medication intake tracking and patient self-management only. It does not constitute a prescription, medical diagnosis, or physician advice. Always follow the explicit instructions of your registered healthcare provider.',
    pagePrefix: isBn ? 'পৃষ্ঠা' : 'Page',
    pageOf: isBn ? 'এর' : 'of',
    systemBranding: isBn ? 'আমার ঔষধ (Amar Owshodh) • স্বাস্থ্য সহায়িকা' : 'Amar Owshodh (আমার ঔষধ) • Healthcare Assistant',
    allRecords: isBn ? 'সকল রেকর্ড (All Records)' : 'All Records',
  }

  // Chunk logs into pages so tables never break awkwardly
  // Page 1 has patient summary header, so fits ~8-10 rows
  // Subsequent pages fit ~12-14 rows
  const PAGE_1_ROWS = 9
  const SUBSEQUENT_PAGE_ROWS = 13

  const pages: IntakeLog[][] = []
  if (logs.length <= PAGE_1_ROWS) {
    pages.push(logs)
  } else {
    pages.push(logs.slice(0, PAGE_1_ROWS))
    let remaining = logs.slice(PAGE_1_ROWS)
    while (remaining.length > 0) {
      pages.push(remaining.slice(0, SUBSEQUENT_PAGE_ROWS))
      remaining = remaining.slice(SUBSEQUENT_PAGE_ROWS)
    }
  }

  const totalPages = pages.length

  // Construct off-screen wrapper container
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.top = '-99999px'
  container.style.left = '-99999px'
  container.style.width = '1000px'
  container.style.backgroundColor = '#FFFFFF'
  container.style.fontFamily = "'Hind Siliguri', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  container.style.color = '#1E293B'
  container.style.zIndex = '-9999'

  document.body.appendChild(container)

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    })

    const currentDateFormatted = `${formatDate(new Date())} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

    // Filter text string
    const filterParts: string[] = []
    if (filterSummary?.medicineName) filterParts.push(filterSummary.medicineName)
    if (filterSummary?.statusLabel) filterParts.push(filterSummary.statusLabel)
    if (filterSummary?.dateLabel) filterParts.push(filterSummary.dateLabel)
    const filterDisplay = filterParts.length > 0 ? filterParts.join(' • ') : labels.allRecords

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      const pageLogs = pages[pageIndex]
      const pageNum = pageIndex + 1
      const isFirstPage = pageIndex === 0
      const isLastPage = pageIndex === totalPages - 1

      // Create page DOM element with exact A4 proportion (1000px width x ~1414px height)
      const pageElem = document.createElement('div')
      pageElem.style.width = '1000px'
      pageElem.style.minHeight = '1414px'
      pageElem.style.padding = '36px 44px'
      pageElem.style.boxSizing = 'border-box'
      pageElem.style.display = 'flex'
      pageElem.style.flexDirection = 'column'
      pageElem.style.justifyContent = 'space-between'
      pageElem.style.backgroundColor = '#FFFFFF'
      pageElem.style.position = 'relative'

      // ==================== PAGE HEADER ====================
      let headerHTML = ''
      if (isFirstPage) {
        headerHTML = `
          <div>
            <!-- Top Logo & Title Bar -->
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2563EB; padding-bottom: 16px; margin-bottom: 20px;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <img src="/logo.png" alt="Amar Owshodh" style="height: 60px; width: auto; object-fit: contain;" />
              </div>
              <div style="text-align: right;">
                <span style="display: inline-block; background-color: #EFF6FF; color: #1D4ED8; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; border: 1px solid #BFDBFE; margin-bottom: 6px;">
                  ${labels.systemBranding}
                </span>
                <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #1E3A8A; line-height: 1.2;">
                  ${labels.reportTitle}
                </h1>
              </div>
            </div>

            <!-- Patient & Report Metadata Box -->
            <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px 20px; margin-bottom: 22px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; font-size: 12px;">
              <div>
                <span style="color: #64748B; font-weight: 600; display: block; margin-bottom: 2px;">${labels.patientName}</span>
                <strong style="color: #0F172A; font-size: 13px;">${patientName || labels.unspecified}</strong>
              </div>
              <div>
                <span style="color: #64748B; font-weight: 600; display: block; margin-bottom: 2px;">${labels.generatedDate}</span>
                <span style="color: #0F172A; font-weight: 600;">${currentDateFormatted}</span>
              </div>
              <div>
                <span style="color: #64748B; font-weight: 600; display: block; margin-bottom: 2px;">${labels.filterCriteria}</span>
                <span style="color: #2563EB; font-weight: 600;">${filterDisplay}</span>
              </div>
              <div>
                <span style="color: #64748B; font-weight: 600; display: block; margin-bottom: 2px;">${labels.totalRecords}</span>
                <strong style="color: #16A34A; font-size: 14px;">${formatNumber(logs.length)} ${isBn ? 'টি' : 'records'}</strong>
              </div>
            </div>
          </div>
        `
      } else {
        headerHTML = `
          <!-- Subsequent Page Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E2E8F0; padding-bottom: 12px; margin-bottom: 18px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="/logo.png" alt="Amar Owshodh" style="height: 38px; width: auto; object-fit: contain;" />
            </div>
            <div style="text-align: right; font-size: 11px; color: #64748B;">
              <strong style="color: #1E3A8A; font-size: 12px;">${labels.reportTitle}</strong> • ${patientName} (${currentDateFormatted})
            </div>
          </div>
        `
      }

      // ==================== TABLE ROWS ====================
      const rowsHTML = pageLogs.map((log, index) => {
        const med = medMap.get(log.medicine_id)
        const medName = med?.name || log.medicines?.name || labels.unspecified
        const dosage = med?.notes || log.notes || '—'
        const startDate = med?.start_date ? formatDate(med.start_date) : formatDate(log.scheduled_date)
        const endDate = med?.end_date ? formatDate(med.end_date) : labels.ongoing
        const frequency = `${formatDate(log.scheduled_date)} • ${formatTime(log.scheduled_time)}`
        const instructions = log.notes || med?.notes || '—'

        // Status badge styling
        let statusText = labels.statusPending
        let badgeBg = '#FEF3C7'
        let badgeColor = '#B45309'
        let badgeBorder = '#FDE68A'

        if (log.status === 'taken') {
          statusText = labels.statusTaken
          badgeBg = '#DCFCE7'
          badgeColor = '#15803D'
          badgeBorder = '#86EFAC'
        } else if (log.status === 'skipped') {
          statusText = labels.statusSkipped
          badgeBg = '#FEE2E2'
          badgeColor = '#B91C1C'
          badgeBorder = '#FCA5A5'
        }

        const isEven = index % 2 === 1
        const rowBg = isEven ? '#F8FAFC' : '#FFFFFF'

        return `
          <tr style="background-color: ${rowBg}; border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 10px 12px; font-weight: 700; color: #1E293B; font-size: 12px; vertical-align: middle;">
              ${medName}
            </td>
            <td style="padding: 10px 10px; color: #475569; font-size: 11.5px; vertical-align: middle;">
              ${dosage}
            </td>
            <td style="padding: 10px 10px; color: #64748B; font-size: 11px; vertical-align: middle; white-space: nowrap;">
              ${startDate}
            </td>
            <td style="padding: 10px 10px; color: #64748B; font-size: 11px; vertical-align: middle; white-space: nowrap;">
              ${endDate}
            </td>
            <td style="padding: 10px 10px; color: #2563EB; font-weight: 600; font-size: 11.5px; vertical-align: middle; white-space: nowrap;">
              ${frequency}
            </td>
            <td style="padding: 10px 10px; color: #475569; font-size: 11.5px; vertical-align: middle; max-width: 170px;">
              ${instructions}
            </td>
            <td style="padding: 10px 12px; text-align: center; vertical-align: middle; white-space: nowrap;">
              <span style="display: inline-block; padding: 3px 8px; font-size: 10.5px; font-weight: 700; border-radius: 6px; background-color: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeBorder};">
                ${statusText}
              </span>
            </td>
          </tr>
        `
      }).join('')

      const tableHTML = `
        <div style="flex: 1; margin-bottom: 18px;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 12px; border: 1px solid #CBD5E1; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background-color: #1E40AF; color: #FFFFFF;">
                <th style="padding: 11px 12px; font-weight: 700; font-size: 11.5px; border-right: 1px solid #3B82F6;">${labels.colMedicine}</th>
                <th style="padding: 11px 10px; font-weight: 700; font-size: 11.5px; border-right: 1px solid #3B82F6;">${labels.colDosage}</th>
                <th style="padding: 11px 10px; font-weight: 700; font-size: 11.5px; border-right: 1px solid #3B82F6;">${labels.colStartDate}</th>
                <th style="padding: 11px 10px; font-weight: 700; font-size: 11.5px; border-right: 1px solid #3B82F6;">${labels.colEndDate}</th>
                <th style="padding: 11px 10px; font-weight: 700; font-size: 11.5px; border-right: 1px solid #3B82F6;">${labels.colFrequency}</th>
                <th style="padding: 11px 10px; font-weight: 700; font-size: 11.5px; border-right: 1px solid #3B82F6;">${labels.colInstructions}</th>
                <th style="padding: 11px 12px; font-weight: 700; font-size: 11.5px; text-align: center;">${labels.colStatus}</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHTML}
            </tbody>
          </table>
        </div>
      `

      // ==================== PAGE FOOTER ====================
      let disclaimerHTML = ''
      if (isLastPage) {
        disclaimerHTML = `
          <div style="background-color: #FEF3C7; border: 1px solid #FDE68A; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; font-size: 10.5px; color: #78350F; line-height: 1.5;">
            <strong>${labels.disclaimerTitle}</strong> ${labels.disclaimerText}
          </div>
        `
      }

      const footerHTML = `
        <div>
          ${disclaimerHTML}
          <div style="border-top: 1px solid #E2E8F0; padding-top: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 10.5px; color: #64748B;">
            <span>${labels.systemBranding}</span>
            <span>${labels.pagePrefix} ${formatNumber(pageNum)} ${labels.pageOf} ${formatNumber(totalPages)}</span>
          </div>
        </div>
      `

      pageElem.innerHTML = `
        ${headerHTML}
        ${tableHTML}
        ${footerHTML}
      `

      container.appendChild(pageElem)

      // Convert page element to canvas via html2canvas
      const canvas = await html2canvas(pageElem, {
        scale: 2, // High resolution for crystal clear Bengali rendering
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      if (pageIndex > 0) {
        pdf.addPage('a4', 'portrait')
      }

      // Add to PDF matching A4 page (210mm x 297mm)
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST')

      // Clean up DOM element for current page
      container.removeChild(pageElem)
    }

    // Download PDF
    const timestamp = new Date().toISOString().split('T')[0]
    const fileName = `amar_owshodh_medication_history_${timestamp}.pdf`
    pdf.save(fileName)

    return { success: true }
  } catch (err: any) {
    console.error('PDF Generation Error:', err)
    return { success: false, error: err?.message || 'Failed to generate PDF' }
  } finally {
    // Clean up container
    if (document.body.contains(container)) {
      document.body.removeChild(container)
    }
  }
}
