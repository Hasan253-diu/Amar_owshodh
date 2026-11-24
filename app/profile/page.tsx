import React from 'react'
import { redirect } from 'next/navigation'
import { ProfileView } from '@/components/ProfileView'
import { getCurrentUser } from '@/app/actions/auth'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const auth = await getCurrentUser()

  if (!auth?.user) {
    redirect('/login')
  }

  return <ProfileView />
}
