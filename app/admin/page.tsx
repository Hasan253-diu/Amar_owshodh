import React from 'react'
import { getAdminAggregateStatsAction } from '@/app/actions/admin'
import { AdminView } from '@/components/AdminView'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const res = await getAdminAggregateStatsAction()

  return (
    <AdminView
      data={res.success ? (res.data ?? null) : null}
      error={res.error}
    />
  )
}
