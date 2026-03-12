import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function createServerClient() {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Types
export interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  skin_type: string | null;
  undertone: string | null;
  season_palette: string | null;
  special_condition: string;
  trimester: number | null;
  allergies: string[] | null;
  birth_year: number | null;
  is_public: boolean;
  preferred_language: string;
  created_at: string;
  updated_at: string;
}
