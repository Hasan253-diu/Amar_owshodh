'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row'] & {
  is_guest?: boolean
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  isGuest: boolean
  isLoading: boolean
  signOut: () => Promise<void>
  exitGuestMode: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isGuest: false,
  isLoading: true,
  signOut: async () => {},
  exitGuestMode: async () => {},
  refreshProfile: async () => {},
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  const fetchProfile = async (userId: string, currentUser?: User | null) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (!error && data) {
        setProfile({
          ...data,
          // Sync with user metadata if profile table doesn't have phone or avatar yet
          avatar_url: data.avatar_url || currentUser?.user_metadata?.avatar_url || null,
          phone_number: data.phone_number || currentUser?.user_metadata?.phone_number || null,
          is_guest: false,
        })
      } else if (currentUser && !currentUser.is_anonymous && currentUser.id !== 'guest-preview-user') {
        // Automatic profile creation if missing
        try {
          const newProf = {
            id: currentUser.id,
            email: currentUser.email || '',
            full_name: currentUser.user_metadata?.full_name || '',
            phone_number: currentUser.user_metadata?.phone_number || null,
            avatar_url: currentUser.user_metadata?.avatar_url || null,
            role: (currentUser.user_metadata?.role as 'user' | 'admin') || 'user',
          }
          const { data: inserted } = await supabase
            .from('profiles')
            .insert(newProf as any)
            .select()
            .single()

          if (inserted) {
            setProfile({ ...inserted, is_guest: false })
          } else {
            setProfile({
              ...newProf,
              created_at: currentUser.created_at,
              updated_at: currentUser.created_at,
              is_guest: false,
            } as any)
          }
        } catch {
          setProfile({
            id: currentUser.id,
            email: currentUser.email || '',
            full_name: currentUser.user_metadata?.full_name || null,
            phone_number: currentUser.user_metadata?.phone_number || null,
            avatar_url: currentUser.user_metadata?.avatar_url || null,
            role: 'user',
            created_at: currentUser.created_at,
            updated_at: currentUser.created_at,
            is_guest: false,
          } as any)
        }
      }
    } catch {
      // In case of error or placeholder
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user && !session.user.is_anonymous) {
          setUser(session.user)
          await fetchProfile(session.user.id, session.user)
        } else {
          // Check for active guest session
          const hasGuestCookie = typeof document !== 'undefined' && document.cookie.includes('amar_owshodh_guest=true')
          if (hasGuestCookie || session?.user?.is_anonymous) {
            setUser({
              id: 'guest-preview-user',
              email: 'guest@amarowshodh.local',
              is_anonymous: true,
              user_metadata: {
                full_name: 'গেস্ট ব্যবহারকারী (Guest)',
                role: 'user',
              },
            } as any)
            setProfile({
              id: 'guest-preview-user',
              email: 'guest@amarowshodh.local',
              full_name: 'গেস্ট ব্যবহারকারী (Guest)',
              phone_number: null,
              avatar_url: null,
              role: 'user',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              is_guest: true,
            })
          }
        }
      } catch {
        // Fallback
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser && !currentUser.is_anonymous) {
        await fetchProfile(currentUser.id, currentUser)
      } else {
        const hasGuestCookie = typeof document !== 'undefined' && document.cookie.includes('amar_owshodh_guest=true')
        if (hasGuestCookie || currentUser?.is_anonymous) {
          setUser({
            id: 'guest-preview-user',
            email: 'guest@amarowshodh.local',
            is_anonymous: true,
            user_metadata: {
              full_name: 'গেস্ট ব্যবহারকারী (Guest)',
              role: 'user',
            },
          } as any)
          setProfile({
            id: 'guest-preview-user',
            email: 'guest@amarowshodh.local',
            full_name: 'গেস্ট ব্যবহারকারী (Guest)',
            phone_number: null,
            avatar_url: null,
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_guest: true,
          })
        } else {
          setProfile(null)
        }
      }
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const exitGuestMode = async () => {
    try {
      await supabase.auth.signOut()
    } catch {}
    if (typeof document !== 'undefined') {
      document.cookie = 'amar_owshodh_guest=; Max-Age=0; path=/;'
    }
    setUser(null)
    setProfile(null)
    window.location.href = '/login'
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch {}
    if (typeof document !== 'undefined') {
      document.cookie = 'amar_owshodh_guest=; Max-Age=0; path=/;'
    }
    setUser(null)
    setProfile(null)
    window.location.href = '/login'
  }

  const refreshProfile = async () => {
    if (user?.id && !user.is_anonymous && user.id !== 'guest-preview-user') {
      await fetchProfile(user.id, user)
    }
  }

  const isGuest =
    profile?.is_guest === true ||
    (typeof document !== 'undefined' && document.cookie.includes('amar_owshodh_guest=true')) ||
    (!!user && (user.is_anonymous || user.id === 'guest-preview-user'))

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isGuest,
        isLoading,
        signOut,
        exitGuestMode,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
