import { NextRequest, NextResponse } from "next/server";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("intake_submissions")
    .select("id, full_name, company_name, status")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!["delivered", "done"].includes(data.status)) {
    return NextResponse.json({ error: "Offer not available yet" }, { status: 403 });
  }

  return NextResponse.json(data);
}
