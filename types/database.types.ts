export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  // Allows fallback/flexible typings for Supabase client
  [key: string]: any
}
