export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface ProfileRow {
  id: string
  email: string
  full_name: string | null
  phone_number: string | null
  avatar_url: string | null
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow
        Insert: Partial<ProfileRow> & { id: string; email: string }
        Update: Partial<ProfileRow>
      }
      medicines: {
        Row: {
          id: string
          user_id: string
          name: string
          notes: string | null
          start_date: string
          end_date: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: any
        Update: any
      }
      medicine_schedules: {
        Row: {
          id: string
          medicine_id: string
          user_id: string
          reminder_time: string
          repeat_days: number[]
          start_date: string
          end_date: string | null
          timezone: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: any
        Update: any
      }
      intake_logs: {
        Row: {
          id: string
          schedule_id: string
          medicine_id: string
          user_id: string
          scheduled_date: string
          scheduled_time: string
          status: 'pending' | 'taken' | 'skipped'
          recorded_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: any
        Update: any
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          intake_log_id: string | null
          title: string
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: any
        Update: any
      }
    }
  }
  [key: string]: any
}
