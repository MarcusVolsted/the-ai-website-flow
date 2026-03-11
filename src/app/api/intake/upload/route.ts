import { NextResponse } from "next/server";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }

  // Generate a unique path: intake-files/{timestamp}_{sanitized-name}
  const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${Date.now()}_${sanitized}`;

  const supabase = createServerClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from("intake-files")
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  // Generate a signed URL (valid for 10 days to match our expiry)
  const { data: urlData } = await supabase.storage
    .from("intake-files")
    .createSignedUrl(storagePath, 60 * 60 * 24 * 10); // 10 days

  return NextResponse.json({
    storage_path: storagePath,
    signed_url: urlData?.signedUrl || null,
    name: file.name,
    type: file.type,
    size: file.size,
  });
}
