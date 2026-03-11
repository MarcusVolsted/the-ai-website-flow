import { NextRequest, NextResponse } from "next/server";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase";

function checkAuth(req: NextRequest) {
  const cookie = req.cookies.get("admin_auth");
  return cookie?.value === "1";
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json([]);
  }

  const supabase = createServerClient();
  const url = new URL(req.url);
  const status = url.searchParams.get("status");

  // Try full query first, fall back to base columns if some don't exist yet
  let query = supabase
    .from("intake_submissions")
    .select("id, created_at, full_name, email, phone, company_name, company_location, site_type, status, project_summary, client_type, deal_type, deal_amount, deal_recurring")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  let { data, error } = await query;

  // If query fails (likely missing columns), retry with only base columns
  if (error) {
    console.warn("Full query failed, trying base columns:", error.message);
    let fallbackQuery = supabase
      .from("intake_submissions")
      .select("id, created_at, full_name, email, phone, company_name, site_type, status, project_summary")
      .order("created_at", { ascending: false });

    if (status) {
      fallbackQuery = fallbackQuery.eq("status", status);
    }

    const fallback = await fallbackQuery;
    data = fallback.data as typeof data;
    error = fallback.error;
  }

  if (error) {
    console.error("Admin submissions query error:", error);
    return NextResponse.json([]);
  }

  return NextResponse.json(data ?? []);
}
