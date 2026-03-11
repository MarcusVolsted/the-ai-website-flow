import { NextResponse } from "next/server";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase";

// DELETE THIS FILE before deploying to production
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      status: "not_configured",
      message: "NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from .env.local",
    });
  }

  try {
    const supabase = createServerClient();

    // Check if the table exists and get column info
    const { data, error } = await supabase
      .from("intake_submissions")
      .select("id, created_at, full_name, email, status")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      return NextResponse.json({
        status: "error",
        message: error.message,
        code: error.code,
        hint: error.hint,
        details: error.details,
      });
    }

    return NextResponse.json({
      status: "ok",
      table_exists: true,
      row_count: data.length,
      recent_submissions: data,
    });
  } catch (err) {
    return NextResponse.json({
      status: "exception",
      message: err instanceof Error ? err.message : String(err),
    });
  }
}
