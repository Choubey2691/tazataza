import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase ENV variables");
}

console.log("Supabase URL Loaded:", supabaseUrl ? "YES" : "NO");

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
