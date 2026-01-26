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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      detected_biomarkers: {
        Row: {
          category: string | null
          created_at: string
          id: string
          is_descriptive: boolean | null
          is_normal: boolean | null
          lab_result_id: string
          name: string
          reference_max: number | null
          reference_min: number | null
          unit: string | null
          value: number | null
          value_text: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          is_descriptive?: boolean | null
          is_normal?: boolean | null
          lab_result_id: string
          name: string
          reference_max?: number | null
          reference_min?: number | null
          unit?: string | null
          value?: number | null
          value_text?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          is_descriptive?: boolean | null
          is_normal?: boolean | null
          lab_result_id?: string
          name?: string
          reference_max?: number | null
          reference_min?: number | null
          unit?: string | null
          value?: number | null
          value_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "detected_biomarkers_lab_result_id_fkey"
            columns: ["lab_result_id"]
            isOneToOne: false
            referencedRelation: "lab_results"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_results: {
        Row: {
          ai_recommendations: string[] | null
          alt: number | null
          ast: number | null
          biological_age: number | null
          created_at: string | null
          creatinine: number | null
          crp: number | null
          file_name: string | null
          file_url: string | null
          ggt: number | null
          glucose: number | null
          hdl: number | null
          hemoglobin: number | null
          id: string
          inflammation_score: string | null
          ldl: number | null
          metabolic_risk_score: string | null
          total_cholesterol: number | null
          triglycerides: number | null
          tsh: number | null
          upload_date: string | null
          user_id: string
          vitamin_d: number | null
        }
        Insert: {
          ai_recommendations?: string[] | null
          alt?: number | null
          ast?: number | null
          biological_age?: number | null
          created_at?: string | null
          creatinine?: number | null
          crp?: number | null
          file_name?: string | null
          file_url?: string | null
          ggt?: number | null
          glucose?: number | null
          hdl?: number | null
          hemoglobin?: number | null
          id?: string
          inflammation_score?: string | null
          ldl?: number | null
          metabolic_risk_score?: string | null
          total_cholesterol?: number | null
          triglycerides?: number | null
          tsh?: number | null
          upload_date?: string | null
          user_id: string
          vitamin_d?: number | null
        }
        Update: {
          ai_recommendations?: string[] | null
          alt?: number | null
          ast?: number | null
          biological_age?: number | null
          created_at?: string | null
          creatinine?: number | null
          crp?: number | null
          file_name?: string | null
          file_url?: string | null
          ggt?: number | null
          glucose?: number | null
          hdl?: number | null
          hemoglobin?: number | null
          id?: string
          inflammation_score?: string | null
          ldl?: number | null
          metabolic_risk_score?: string | null
          total_cholesterol?: number | null
          triglycerides?: number | null
          tsh?: number | null
          upload_date?: string | null
          user_id?: string
          vitamin_d?: number | null
        }
        Relationships: []
      }
      onboarding_data: {
        Row: {
          age: number | null
          alcohol_consumption: string | null
          biological_sex: string | null
          completed: boolean | null
          created_at: string | null
          current_medications: string | null
          daily_water_intake: number | null
          health_goals: string[] | null
          height: number | null
          id: string
          medical_history: string | null
          mental_health_level: number | null
          sleep_quality: string | null
          training_frequency: string | null
          updated_at: string | null
          user_id: string
          weight: number | null
        }
        Insert: {
          age?: number | null
          alcohol_consumption?: string | null
          biological_sex?: string | null
          completed?: boolean | null
          created_at?: string | null
          current_medications?: string | null
          daily_water_intake?: number | null
          health_goals?: string[] | null
          height?: number | null
          id?: string
          medical_history?: string | null
          mental_health_level?: number | null
          sleep_quality?: string | null
          training_frequency?: string | null
          updated_at?: string | null
          user_id: string
          weight?: number | null
        }
        Update: {
          age?: number | null
          alcohol_consumption?: string | null
          biological_sex?: string | null
          completed?: boolean | null
          created_at?: string | null
          current_medications?: string | null
          daily_water_intake?: number | null
          health_goals?: string[] | null
          height?: number | null
          id?: string
          medical_history?: string | null
          mental_health_level?: number | null
          sleep_quality?: string | null
          training_frequency?: string | null
          updated_at?: string | null
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          language: string | null
          name: string | null
          theme: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          language?: string | null
          name?: string | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          language?: string | null
          name?: string | null
          theme?: string | null
          updated_at?: string | null
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
