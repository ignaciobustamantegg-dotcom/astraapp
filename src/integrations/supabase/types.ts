export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_progress: {
        Row: {
          created_at: string
          current_day: number
          day_1_completed_at: string | null
          day_1_rating: number | null
          day_1_started_at: string | null
          day_2_completed_at: string | null
          day_2_rating: number | null
          day_2_started_at: string | null
          day_3_completed_at: string | null
          day_3_rating: number | null
          day_3_started_at: string | null
          day_4_completed_at: string | null
          day_4_rating: number | null
          day_4_started_at: string | null
          day_5_completed_at: string | null
          day_5_rating: number | null
          day_5_started_at: string | null
          day_6_completed_at: string | null
          day_6_rating: number | null
          day_6_started_at: string | null
          day_7_completed_at: string | null
          day_7_rating: number | null
          day_7_started_at: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_day?: number
          day_1_completed_at?: string | null
          day_1_rating?: number | null
          day_1_started_at?: string | null
          day_2_completed_at?: string | null
          day_2_rating?: number | null
          day_2_started_at?: string | null
          day_3_completed_at?: string | null
          day_3_rating?: number | null
          day_3_started_at?: string | null
          day_4_completed_at?: string | null
          day_4_rating?: number | null
          day_4_started_at?: string | null
          day_5_completed_at?: string | null
          day_5_rating?: number | null
          day_5_started_at?: string | null
          day_6_completed_at?: string | null
          day_6_rating?: number | null
          day_6_started_at?: string | null
          day_7_completed_at?: string | null
          day_7_rating?: number | null
          day_7_started_at?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_day?: number
          day_1_completed_at?: string | null
          day_1_rating?: number | null
          day_1_started_at?: string | null
          day_2_completed_at?: string | null
          day_2_rating?: number | null
          day_2_started_at?: string | null
          day_3_completed_at?: string | null
          day_3_rating?: number | null
          day_3_started_at?: string | null
          day_4_completed_at?: string | null
          day_4_rating?: number | null
          day_4_started_at?: string | null
          day_5_completed_at?: string | null
          day_5_rating?: number | null
          day_5_started_at?: string | null
          day_6_completed_at?: string | null
          day_6_rating?: number | null
          day_6_started_at?: string | null
          day_7_completed_at?: string | null
          day_7_rating?: number | null
          day_7_started_at?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          event_name: string
          event_payload: Json | null
          id: string
          session_id: string
        }
        Insert: {
          created_at?: string
          event_name: string
          event_payload?: Json | null
          id?: string
          session_id: string
        }
        Update: {
          created_at?: string
          event_name?: string
          event_payload?: Json | null
          id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string
          day_number: number
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          day_number: number
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          day_number?: number
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          email: string | null
          id: string
          session_id: string
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          session_id: string
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          session_id?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          access_token: string | null
          amount_net: string | null
          campaignkey: string | null
          cid: string | null
          country: string | null
          created_at: string
          customer_email: string | null
          external_order_id: string
          gclid: string | null
          id: string
          paid_at: string | null
          provider: string
          session_id: string | null
          status: string
          token_expires_at: string | null
          updated_at: string
          user_id: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          access_token?: string | null
          amount_net?: string | null
          campaignkey?: string | null
          cid?: string | null
          country?: string | null
          created_at?: string
          customer_email?: string | null
          external_order_id: string
          gclid?: string | null
          id?: string
          paid_at?: string | null
          provider?: string
          session_id?: string | null
          status?: string
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          access_token?: string | null
          amount_net?: string | null
          campaignkey?: string | null
          cid?: string | null
          country?: string | null
          created_at?: string
          customer_email?: string | null
          external_order_id?: string
          gclid?: string | null
          id?: string
          paid_at?: string | null
          provider?: string
          session_id?: string | null
          status?: string
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_submissions: {
        Row: {
          answers_json: Json
          completed_at: string
          id: string
          session_id: string
        }
        Insert: {
          answers_json: Json
          completed_at?: string
          id?: string
          session_id: string
        }
        Update: {
          answers_json?: Json
          completed_at?: string
          id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_submissions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string
          id: string
          landing_path: string | null
          referrer: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          variant: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          landing_path?: string | null
          referrer?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          variant?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          landing_path?: string | null
          referrer?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          variant?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          checkout_session_id: string | null
          created_at: string
          id: string
          is_trial: boolean
          plan: string
          status: string
          trial_ends_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          checkout_session_id?: string | null
          created_at?: string
          id?: string
          is_trial?: boolean
          plan?: string
          status?: string
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          checkout_session_id?: string | null
          created_at?: string
          id?: string
          is_trial?: boolean
          plan?: string
          status?: string
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
