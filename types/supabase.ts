// Supabase 데이터베이스 타입 정의
// 이 파일은 Supabase CLI로 자동 생성하거나 수동으로 관리할 수 있습니다.
// 자동 생성 명령어: npx supabase gen types typescript --project-id [project-id] > types/supabase.ts

import type { QuoteItem, QuoteStatus } from "./database"

/**
 * Supabase 데이터베이스 스키마 타입
 */
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          company_name: string
          notion_api_key: string | null
          notion_database_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          company_name: string
          notion_api_key?: string | null
          notion_database_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          company_name?: string
          notion_api_key?: string | null
          notion_database_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      quotes: {
        Row: {
          id: string
          user_id: string
          notion_page_id: string
          quote_number: string
          client_name: string
          client_contact: string | null
          client_phone: string | null
          client_email: string | null
          items: QuoteItem[]
          total_amount: number
          issue_date: string
          valid_until: string | null
          notes: string | null
          share_id: string
          status: QuoteStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          notion_page_id: string
          quote_number: string
          client_name: string
          client_contact?: string | null
          client_phone?: string | null
          client_email?: string | null
          items?: QuoteItem[]
          total_amount?: number
          issue_date: string
          valid_until?: string | null
          notes?: string | null
          share_id?: string
          status?: QuoteStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          notion_page_id?: string
          quote_number?: string
          client_name?: string
          client_contact?: string | null
          client_phone?: string | null
          client_email?: string | null
          items?: QuoteItem[]
          total_amount?: number
          issue_date?: string
          valid_until?: string | null
          notes?: string | null
          share_id?: string
          status?: QuoteStatus
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_shared_quote: {
        Args: {
          p_share_id: string
        }
        Returns: {
          id: string
          quote_number: string
          client_name: string
          client_contact: string | null
          client_phone: string | null
          client_email: string | null
          items: QuoteItem[]
          total_amount: number
          issue_date: string
          valid_until: string | null
          notes: string | null
          status: QuoteStatus
          company_name: string
        }[]
      }
      mark_quote_as_viewed: {
        Args: {
          p_share_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      quote_status: QuoteStatus
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

/**
 * 테이블 타입 헬퍼
 */
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]

/**
 * 함수 타입 헬퍼
 */
export type Functions<T extends keyof Database["public"]["Functions"]> =
  Database["public"]["Functions"][T]
