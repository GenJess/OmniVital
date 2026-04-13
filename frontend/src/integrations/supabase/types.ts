export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ov_email_signups: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      ov_products: {
        Row: {
          id: string
          name: string
          slug: string
          tagline: string
          category: string
          schedule_slot: string
          description: string
          short_description: string | null
          price: number
          image_url: string | null
          hero_ingredient: string | null
          dosage_text: string | null
          directions_text: string | null
          benefit_bullets: Json
          bio_availability_text: string | null
          sourcing_text: string | null
          daily_ritual_text: string | null
          color_tag: Json
          display_order: number
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          tagline: string
          category: string
          schedule_slot?: string
          description: string
          short_description?: string | null
          price?: number
          image_url?: string | null
          hero_ingredient?: string | null
          dosage_text?: string | null
          directions_text?: string | null
          benefit_bullets?: Json
          bio_availability_text?: string | null
          sourcing_text?: string | null
          daily_ritual_text?: string | null
          color_tag?: Json
          display_order?: number
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          tagline?: string
          category?: string
          schedule_slot?: string
          description?: string
          short_description?: string | null
          price?: number
          image_url?: string | null
          hero_ingredient?: string | null
          dosage_text?: string | null
          directions_text?: string | null
          benefit_bullets?: Json
          bio_availability_text?: string | null
          sourcing_text?: string | null
          daily_ritual_text?: string | null
          color_tag?: Json
          display_order?: number
          active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      ov_profiles: {
        Row: {
          id: string
          full_name: string | null
          ritual_summary: string | null
          avatar_color: string | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          ritual_summary?: string | null
          avatar_color?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          ritual_summary?: string | null
          avatar_color?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      ov_user_rituals: {
        Row: {
          id: string
          user_id: string
          product_id: string
          schedule_slot: string | null
          is_paused: boolean
          display_order: number
          added_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          schedule_slot?: string | null
          is_paused?: boolean
          display_order?: number
          added_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          schedule_slot?: string | null
          is_paused?: boolean
          display_order?: number
          added_at?: string
        }
        Relationships: []
      }
      ov_ritual_logs: {
        Row: {
          id: string
          user_id: string
          product_id: string
          feeling_score: number
          notes: string | null
          logged_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          feeling_score?: number
          notes?: string | null
          logged_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          feeling_score?: number
          notes?: string | null
          logged_at?: string
        }
        Relationships: []
      }
      ov_community_threads: {
        Row: {
          id: string
          author_id: string
          title: string
          body: string
          color_tag: string
          color_hex: string
          product_tags: string[]
          reply_count: number
          like_count: number
          pinned: boolean
          is_team_post: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id: string
          title: string
          body: string
          color_tag?: string
          color_hex?: string
          product_tags?: string[]
          reply_count?: number
          like_count?: number
          pinned?: boolean
          is_team_post?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          title?: string
          body?: string
          color_tag?: string
          color_hex?: string
          product_tags?: string[]
          reply_count?: number
          like_count?: number
          pinned?: boolean
          is_team_post?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      ov_community_replies: {
        Row: {
          id: string
          thread_id: string
          author_id: string
          body: string
          like_count: number
          created_at: string
        }
        Insert: {
          id?: string
          thread_id: string
          author_id: string
          body: string
          like_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          thread_id?: string
          author_id?: string
          body?: string
          like_count?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ov_community_replies_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "ov_community_threads"
            referencedColumns: ["id"]
          }
        ]
      }
      ov_community_likes: {
        Row: {
          id: string
          user_id: string
          thread_id: string | null
          reply_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          thread_id?: string | null
          reply_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          thread_id?: string | null
          reply_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      ov_orders: {
        Row: {
          id: string
          user_id: string
          status: string
          billing_interval: string
          product_ids: string[]
          subtotal: number
          discount_pct: number
          total: number
          stripe_subscription_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: string
          billing_interval?: string
          product_ids?: string[]
          subtotal?: number
          discount_pct?: number
          total?: number
          stripe_subscription_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          billing_interval?: string
          product_ids?: string[]
          subtotal?: number
          discount_pct?: number
          total?: number
          stripe_subscription_id?: string | null
          notes?: string | null
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
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][PublicCompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
