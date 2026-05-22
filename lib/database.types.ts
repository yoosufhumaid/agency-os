export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    enums: {
      user_role: "owner" | "employee" | "client";
    };
    tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          company: string | null;
          role: Database["public"]["enums"]["user_role"];
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name?: string | null;
          company?: string | null;
          role?: Database["public"]["enums"]["user_role"];
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          full_name?: string | null;
          company?: string | null;
          role?: Database["public"]["enums"]["user_role"];
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          owner_id: string;
          client_id: string;
          name: string;
          description: string | null;
          status: string;
          budget: number | null;
          start_date: string | null;
          due_date: string | null;
          progress: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          client_id: string;
          name: string;
          description?: string | null;
          status?: string;
          budget?: number | null;
          start_date?: string | null;
          due_date?: string | null;
          progress?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          owner_id?: string;
          client_id?: string;
          name?: string;
          description?: string | null;
          status?: string;
          budget?: number | null;
          start_date?: string | null;
          due_date?: string | null;
          progress?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          project_id: string;
          assigned_to: string | null;
          title: string;
          description: string | null;
          status: string;
          priority: string;
          due_date: string | null;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          assigned_to?: string | null;
          title: string;
          description?: string | null;
          status?: string;
          priority?: string;
          due_date?: string | null;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          project_id?: string;
          assigned_to?: string | null;
          title?: string;
          description?: string | null;
          status?: string;
          priority?: string;
          due_date?: string | null;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          project_id: string | null;
          sender_id: string;
          receiver_id: string;
          content: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id?: string | null;
          sender_id: string;
          receiver_id: string;
          content: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          project_id?: string | null;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
      attendance: {
        Row: {
          id: string;
          employee_id: string;
          day: string;
          check_in: string | null;
          check_out: string | null;
          status: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          day: string;
          check_in?: string | null;
          check_out?: string | null;
          status?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          employee_id?: string;
          day?: string;
          check_in?: string | null;
          check_out?: string | null;
          status?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
    views: {};
    functions: {};
  };
}
