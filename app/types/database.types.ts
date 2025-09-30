export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      budgets: {
        Row: {
          budget: Budget;
          created_at: string | null;
          id: string;
          month: number;
          user_id: string;
          year: number;
        };
        Insert: {
          budget: Budget;
          created_at?: string | null;
          id?: string;
          month: number;
          user_id?: string;
          year: number;
        };
        Update: {
          budget: Budget;
          created_at?: string | null;
          id?: string;
          month?: number;
          user_id?: string;
          year?: number;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          created_at: string | null;
          icon: string | null;
          id: number;
          name: string;
          type: Database["public"]["Enums"]["transaction_type"];
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          icon?: string | null;
          id?: number;
          name: string;
          type: Database["public"]["Enums"]["transaction_type"];
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          icon?: string | null;
          id?: number;
          name?: string;
          type?: Database["public"]["Enums"]["transaction_type"];
          user_id?: string | null;
        };
        Relationships: [];
      };
      payment_methods: {
        Row: {
          created_at: string | null;
          icon: string | null;
          id: number;
          name: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          icon?: string | null;
          id?: number;
          name: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          icon?: string | null;
          id?: number;
          name?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      sub_categories: {
        Row: {
          category_id: number | null;
          created_at: string | null;
          icon: string | null;
          id: number;
          name: string;
          user_id: string | null;
        };
        Insert: {
          category_id?: number | null;
          created_at?: string | null;
          icon?: string | null;
          id?: number;
          name: string;
          user_id?: string | null;
        };
        Update: {
          category_id?: number | null;
          created_at?: string | null;
          icon?: string | null;
          id?: number;
          name?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "sub_categories_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      transactions: {
        Row: {
          amount: number;
          category_id: number | null;
          created_at: string | null;
          date: string;
          description: string | null;
          id: number;
          payment_method_id: number | null;
          sub_category_id: number | null;
          type: Database["public"]["Enums"]["transaction_type"];
          user_id: string | null;
        };
        Insert: {
          amount: number;
          category_id?: number | null;
          created_at?: string | null;
          date: string;
          description?: string | null;
          id?: number;
          payment_method_id?: number | null;
          sub_category_id?: number | null;
          type: Database["public"]["Enums"]["transaction_type"];
          user_id?: string | null;
        };
        Update: {
          amount?: number;
          category_id?: number | null;
          created_at?: string | null;
          date?: string;
          description?: string | null;
          id?: number;
          payment_method_id?: number | null;
          sub_category_id?: number | null;
          type?: Database["public"]["Enums"]["transaction_type"];
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_payment_method_id_fkey";
            columns: ["payment_method_id"];
            isOneToOne: false;
            referencedRelation: "payment_methods";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_sub_category_id_fkey";
            columns: ["sub_category_id"];
            isOneToOne: false;
            referencedRelation: "sub_categories";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      transaction_type: "income" | "expense";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
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
    : never = never
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
    : never = never
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      transaction_type: ["income", "expense"],
    },
  },
} as const;

export type Budgets = Database["public"]["Tables"]["budgets"];
export type Budget = {
  income: {
    [category_id: number]: {
      [sub_category_id: number]: number;
    };
  };
  expense: {
    [category_id: number]: {
      [sub_category_id: number]: number;
    };
  };
} | null;
export type Categories = Database["public"]["Tables"]["categories"];
export type SubCategories = Database["public"]["Tables"]["sub_categories"];
export type PaymentMethods = Database["public"]["Tables"]["payment_methods"];
export type Transactions = Database["public"]["Tables"]["transactions"];
