import type { Difficulty } from "./quiz";

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string;
          username: string;
          device_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          device_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          device_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      runs: {
        Row: {
          id: string;
          run_id: string;
          player_id: string;
          difficulty: Difficulty;
          score: number;
          correct_count: number;
          total_count: number;
          health_remaining: number;
          outcome: "success" | "failed";
          started_at: string;
          finished_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          run_id: string;
          player_id: string;
          difficulty: Difficulty;
          score: number;
          correct_count: number;
          total_count: number;
          health_remaining: number;
          outcome: "success" | "failed";
          started_at: string;
          finished_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          run_id?: string;
          player_id?: string;
          difficulty?: Difficulty;
          score?: number;
          correct_count?: number;
          total_count?: number;
          health_remaining?: number;
          outcome?: "success" | "failed";
          started_at?: string;
          finished_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "runs_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          },
        ];
      };
      unlock_progress: {
        Row: {
          id: string;
          player_id: string;
          difficulty: "Hacker" | "Elite";
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          difficulty: "Hacker" | "Elite";
          unlocked_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          difficulty?: "Hacker" | "Elite";
          unlocked_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "unlock_progress_player_id_fkey";
            columns: ["player_id"];
            isOneToOne: false;
            referencedRelation: "players";
            referencedColumns: ["id"];
          },
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
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type PlayerRow = Database["public"]["Tables"]["players"]["Row"];
export type RunRow = Database["public"]["Tables"]["runs"]["Row"];
export type UnlockRow = Database["public"]["Tables"]["unlock_progress"]["Row"];
