export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      analyses: {
        Row: {
          action_plan: Json;
          ai_model: string | null;
          budget_range: string | null;
          category: string | null;
          created_at: string;
          email: string | null;
          id: string;
          image_url: string;
          improvements: Json;
          is_public: boolean;
          overall_score: number;
          professional_profile: string | null;
          recommended_products: Json;
          scores: Json;
          strengths: Json;
          summary: string | null;
          user_id: string;
        };
        Insert: {
          action_plan?: Json;
          ai_model?: string | null;
          budget_range?: string | null;
          category?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          image_url: string;
          improvements?: Json;
          is_public?: boolean;
          overall_score: number;
          professional_profile?: string | null;
          recommended_products?: Json;
          scores?: Json;
          strengths?: Json;
          summary?: string | null;
          user_id: string;
        };
        Update: {
          action_plan?: Json;
          ai_model?: string | null;
          budget_range?: string | null;
          category?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          image_url?: string;
          improvements?: Json;
          is_public?: boolean;
          overall_score?: number;
          professional_profile?: string | null;
          recommended_products?: Json;
          scores?: Json;
          strengths?: Json;
          summary?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      credit_transactions: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          kind: Database["public"]["Enums"]["credit_tx_kind"];
          metadata: Json | null;
          reference: string | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: string;
          kind: Database["public"]["Enums"]["credit_tx_kind"];
          metadata?: Json | null;
          reference?: string | null;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: string;
          kind?: Database["public"]["Enums"]["credit_tx_kind"];
          metadata?: Json | null;
          reference?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          created_at: string;
          event_name: string;
          id: string;
          props: Json;
          session_id: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          event_name: string;
          id?: string;
          props?: Json;
          session_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          event_name?: string;
          id?: string;
          props?: Json;
          session_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      idea_photo_prompts: {
        Row: {
          anti_artifact_override: string | null;
          base_override: string | null;
          floor: string;
          light: string;
          materials: string;
          mood: string;
          palette: string;
          scene_extra: string;
          style_slug: string;
          updated_at: string;
          window_view: string;
        };
        Insert: {
          anti_artifact_override?: string | null;
          base_override?: string | null;
          floor?: string;
          light?: string;
          materials?: string;
          mood?: string;
          palette?: string;
          scene_extra?: string;
          style_slug: string;
          updated_at?: string;
          window_view?: string;
        };
        Update: {
          anti_artifact_override?: string | null;
          base_override?: string | null;
          floor?: string;
          light?: string;
          materials?: string;
          mood?: string;
          palette?: string;
          scene_extra?: string;
          style_slug?: string;
          updated_at?: string;
          window_view?: string;
        };
        Relationships: [];
      };
      ideas: {
        Row: {
          badge: string | null;
          budget_range: string | null;
          category: string | null;
          created_at: string;
          description: string | null;
          hero_image_url: string | null;
          id: string;
          is_active: boolean;
          level: string | null;
          pain_point: string | null;
          products: Json;
          professional_profile: string | null;
          slug: string;
          sort_order: number;
          style_slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          badge?: string | null;
          budget_range?: string | null;
          category?: string | null;
          created_at?: string;
          description?: string | null;
          hero_image_url?: string | null;
          id?: string;
          is_active?: boolean;
          level?: string | null;
          pain_point?: string | null;
          products?: Json;
          professional_profile?: string | null;
          slug: string;
          sort_order?: number;
          style_slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          badge?: string | null;
          budget_range?: string | null;
          category?: string | null;
          created_at?: string;
          description?: string | null;
          hero_image_url?: string | null;
          id?: string;
          is_active?: boolean;
          level?: string | null;
          pain_point?: string | null;
          products?: Json;
          professional_profile?: string | null;
          slug?: string;
          sort_order?: number;
          style_slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          clicked_affiliate_url: string | null;
          clicked_at: string | null;
          created_at: string;
          email: string;
          email_message_id: string | null;
          email_opened_at: string | null;
          id: string;
          idea_slug: string;
          name: string;
          pdf_url: string | null;
          source: string;
          user_agent: string | null;
        };
        Insert: {
          clicked_affiliate_url?: string | null;
          clicked_at?: string | null;
          created_at?: string;
          email: string;
          email_message_id?: string | null;
          email_opened_at?: string | null;
          id?: string;
          idea_slug: string;
          name: string;
          pdf_url?: string | null;
          source?: string;
          user_agent?: string | null;
        };
        Update: {
          clicked_affiliate_url?: string | null;
          clicked_at?: string | null;
          created_at?: string;
          email?: string;
          email_message_id?: string | null;
          email_opened_at?: string | null;
          id?: string;
          idea_slug?: string;
          name?: string;
          pdf_url?: string | null;
          source?: string;
          user_agent?: string | null;
        };
        Relationships: [];
      };
      product_clicks: {
        Row: {
          analysis_id: string | null;
          clicked_at: string;
          id: string;
          product_category: string | null;
          product_name: string | null;
          product_url: string | null;
          user_id: string | null;
        };
        Insert: {
          analysis_id?: string | null;
          clicked_at?: string;
          id?: string;
          product_category?: string | null;
          product_name?: string | null;
          product_url?: string | null;
          user_id?: string | null;
        };
        Update: {
          analysis_id?: string | null;
          clicked_at?: string;
          id?: string;
          product_category?: string | null;
          product_name?: string | null;
          product_url?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "product_clicks_analysis_id_fkey";
            columns: ["analysis_id"];
            isOneToOne: false;
            referencedRelation: "analyses";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          affiliate_url: string | null;
          category: string | null;
          created_at: string;
          description: string | null;
          id: string;
          image_url: string | null;
          is_active: boolean;
          name: string;
          price_cents: number | null;
          style_slug: string | null;
        };
        Insert: {
          affiliate_url?: string | null;
          category?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          name: string;
          price_cents?: number | null;
          style_slug?: string | null;
        };
        Update: {
          affiliate_url?: string | null;
          category?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          name?: string;
          price_cents?: number | null;
          style_slug?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          credits: number;
          display_name: string | null;
          id: string;
          plan: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          credits?: number;
          display_name?: string | null;
          id: string;
          plan?: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          credits?: number;
          display_name?: string | null;
          id?: string;
          plan?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          after_url: string | null;
          ai_model: string | null;
          ai_prompt: string | null;
          ai_response: Json | null;
          before_url: string | null;
          created_at: string;
          id: string;
          is_public: boolean;
          style_slug: string;
          title: string | null;
          user_id: string;
        };
        Insert: {
          after_url?: string | null;
          ai_model?: string | null;
          ai_prompt?: string | null;
          ai_response?: Json | null;
          before_url?: string | null;
          created_at?: string;
          id?: string;
          is_public?: boolean;
          style_slug: string;
          title?: string | null;
          user_id: string;
        };
        Update: {
          after_url?: string | null;
          ai_model?: string | null;
          ai_prompt?: string | null;
          ai_response?: Json | null;
          before_url?: string | null;
          created_at?: string;
          id?: string;
          is_public?: boolean;
          style_slug?: string;
          title?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      stripe_subscriptions: {
        Row: {
          cancel_at_period_end: boolean;
          created_at: string;
          current_period_end: string | null;
          current_period_start: string | null;
          environment: string;
          id: string;
          price_id: string;
          product_id: string;
          status: string;
          stripe_customer_id: string;
          stripe_subscription_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          cancel_at_period_end?: boolean;
          created_at?: string;
          current_period_end?: string | null;
          current_period_start?: string | null;
          environment?: string;
          id?: string;
          price_id: string;
          product_id: string;
          status?: string;
          stripe_customer_id: string;
          stripe_subscription_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          cancel_at_period_end?: boolean;
          created_at?: string;
          current_period_end?: string | null;
          current_period_start?: string | null;
          environment?: string;
          id?: string;
          price_id?: string;
          product_id?: string;
          status?: string;
          stripe_customer_id?: string;
          stripe_subscription_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      styles_admin: {
        Row: {
          category: string | null;
          created_at: string;
          description: string | null;
          hero_image_url: string | null;
          is_active: boolean;
          name: string;
          prompt_template: string | null;
          slug: string;
          sort_order: number;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          description?: string | null;
          hero_image_url?: string | null;
          is_active?: boolean;
          name: string;
          prompt_template?: string | null;
          slug: string;
          sort_order?: number;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          description?: string | null;
          hero_image_url?: string | null;
          is_active?: boolean;
          name?: string;
          prompt_template?: string | null;
          slug?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean;
          created_at: string;
          current_period_end: string | null;
          current_period_start: string | null;
          id: string;
          plan: Database["public"]["Enums"]["plan_tier"];
          provider: string | null;
          provider_subscription_id: string | null;
          status: Database["public"]["Enums"]["subscription_status"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          cancel_at_period_end?: boolean;
          created_at?: string;
          current_period_end?: string | null;
          current_period_start?: string | null;
          id?: string;
          plan: Database["public"]["Enums"]["plan_tier"];
          provider?: string | null;
          provider_subscription_id?: string | null;
          status?: Database["public"]["Enums"]["subscription_status"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          cancel_at_period_end?: boolean;
          created_at?: string;
          current_period_end?: string | null;
          current_period_start?: string | null;
          id?: string;
          plan?: Database["public"]["Enums"]["plan_tier"];
          provider?: string | null;
          provider_subscription_id?: string | null;
          status?: Database["public"]["Enums"]["subscription_status"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_credits: {
        Row: {
          balance: number;
          created_at: string;
          plan: Database["public"]["Enums"]["plan_tier"];
          renews_at: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          balance?: number;
          created_at?: string;
          plan?: Database["public"]["Enums"]["plan_tier"];
          renews_at?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          balance?: number;
          created_at?: string;
          plan?: Database["public"]["Enums"]["plan_tier"];
          renews_at?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      waitlist: {
        Row: {
          budget_range: string | null;
          created_at: string;
          email: string;
          id: string;
          main_goal: string | null;
          name: string;
          professional_profile: string | null;
        };
        Insert: {
          budget_range?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          main_goal?: string | null;
          name: string;
          professional_profile?: string | null;
        };
        Update: {
          budget_range?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          main_goal?: string | null;
          name?: string;
          professional_profile?: string | null;
        };
        Relationships: [];
      };
      wishlist: {
        Row: {
          affiliate_tag: string | null;
          created_at: string;
          id: string;
          image_url: string | null;
          price_cents: number | null;
          product_name: string;
          product_url: string | null;
          project_id: string | null;
          user_id: string;
        };
        Insert: {
          affiliate_tag?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          price_cents?: number | null;
          product_name: string;
          product_url?: string | null;
          project_id?: string | null;
          user_id: string;
        };
        Update: {
          affiliate_tag?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          price_cents?: number | null;
          product_name?: string;
          product_url?: string | null;
          project_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wishlist_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      consume_credit: {
        Args: { _reference?: string; _user_id: string };
        Returns: number;
      };
      has_active_stripe_subscription: {
        Args: { check_env?: string; user_uuid: string };
        Returns: boolean;
      };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      topup_monthly_credits: {
        Args: {
          _amount: number;
          _plan: string;
          _reference: string;
          _user_id: string;
        };
        Returns: number;
      };
    };
    Enums: {
      app_role: "admin" | "user";
      credit_tx_kind:
        | "signup_bonus"
        | "generation"
        | "subscription_grant"
        | "admin_adjust"
        | "refund";
      plan_tier: "free" | "premium" | "pro";
      subscription_status: "active" | "canceled" | "past_due" | "trialing";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      credit_tx_kind: [
        "signup_bonus",
        "generation",
        "subscription_grant",
        "admin_adjust",
        "refund",
      ],
      plan_tier: ["free", "premium", "pro"],
      subscription_status: ["active", "canceled", "past_due", "trialing"],
    },
  },
} as const;
