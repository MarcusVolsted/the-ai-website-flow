import { createClient } from "@supabase/supabase-js";

// Server-side client (uses service_role key — full admin access)
// Only use in server actions and API routes
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

// Check if Supabase is configured (for graceful fallback)
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
