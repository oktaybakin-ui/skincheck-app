import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Build-time guard: env eksikse sessizce "placeholder.supabase.co"ya düşüp
// bozuk bir build üretmek yerine derlemeyi açıkça durdur.
// (App Store 2.1(a) reddinin asıl sebebi buydu: kayıt isteği placeholder
// adrese gidip "An error occurred while signing up" hatası veriyordu.)
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "[supabase] NEXT_PUBLIC_SUPABASE_URL veya NEXT_PUBLIC_SUPABASE_ANON_KEY tanımlı değil. " +
      ".env.local dosyasını kontrol edip build'i tekrar alın."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  favorite_brands: string[] | null;
  birth_year: number | null;
  is_public: boolean;
  preferred_language: string;
  created_at: string;
  updated_at: string;
}
