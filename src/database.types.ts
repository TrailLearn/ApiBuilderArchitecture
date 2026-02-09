export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      scholarships: {
        Row: {
          id: string
          title: string
          amount: string | null
          description: string | null
          source_url: string
          status: 'PENDING' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED' | 'NEEDS_REVIEW'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          amount?: string | null
          description?: string | null
          source_url: string
          status?: 'PENDING' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED' | 'NEEDS_REVIEW'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          amount?: string | null
          description?: string | null
          source_url?: string
          status?: 'PENDING' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED' | 'NEEDS_REVIEW'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      scholarship_status: 'PENDING' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED' | 'NEEDS_REVIEW'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}