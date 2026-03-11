import { NextResponse } from "next/server";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase";
import { sendConfirmationEmail } from "@/lib/resend";
import { notifyOwnerConversation } from "@/lib/telegram";

interface ConversationMessage {
  role: "assistant" | "user";
  content: string;
  attachments?: { name: string; type: string }[];
}

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  storage_path: string;
}

interface SubmitBody {
  messages: ConversationMessage[];
  uploaded_files?: UploadedFile[];
}

// Prompt that extracts structured data from the conversation
const EXTRACTION_PROMPT = `You are a data extraction assistant. Given the following conversation between a web design consultant ("assistant") and a potential client ("user"), extract ALL client information into a JSON object.

Return ONLY valid JSON - no markdown, no explanation, no code fences. Every field must be present (use null if not mentioned).

Required JSON shape:
{
  "full_name": string | null,
  "email": string | null,
  "phone": string | null,
  "company_name": string | null,
  "company_location": string | null,
  "business_description": string | null,
  "is_new_site": boolean,
  "site_type": string | null,
  "page_count": number | null,
  "page_descriptions": string | null,
  "primary_goal": string | null,
  "features": string[],
  "target_audience": string | null,
  "current_website_url": string | null,
  "website_language": string | null,
  "brand_colors": string[],
  "font_preferences": string | null,
  "contact_info_for_site": string | null,
  "has_images": boolean,
  "image_details": string | null,
  "inspiration_urls": string[],
  "style_preference": string | null,
  "has_logo": boolean,
  "tone_of_voice": string | null,
  "tagline": string | null,
  "preferred_cta": string | null,
  "deadline": string | null,
  "additional_notes": string | null
}

Conversation:
`;

// Generates a Claude Code prompt from the extracted data
function buildClaudePrompt(data: Record<string, unknown>): string {
  const lines: string[] = [
    `You are building a website for ${data.company_name || "a client"}.`,
    ``,
    `## Client`,
    `- **Name:** ${data.full_name || "Unknown"}`,
    `- **Company:** ${data.company_name || "Unknown"}`,
    `- **Business:** ${data.business_description || "Not specified"}`,
    `- **Location:** ${data.company_location || "Not specified"}`,
    `- **Contact:** ${data.email || "N/A"} / ${data.phone || "N/A"}`,
    ``,
    `## Website Requirements`,
    `- **Site type:** ${data.site_type || "Not specified"}`,
  ];

  if (data.page_count) lines.push(`- **Pages:** ${data.page_count}`);
  if (data.page_descriptions) lines.push(`- **Page details:** ${data.page_descriptions}`);
  lines.push(`- **Primary goal:** ${data.primary_goal || "Not specified"}`);

  const features = data.features as string[] | undefined;
  if (features && features.length > 0) {
    lines.push(`- **Features:** ${features.join(", ")}`);
  }

  lines.push(`- **Target audience:** ${data.target_audience || "Not specified"}`);
  lines.push(`- **Website language:** ${data.website_language || "Not specified"}`);

  if (data.preferred_cta) lines.push(`- **Main CTA:** ${data.preferred_cta}`);

  if (data.contact_info_for_site) lines.push(`- **Contact info for site:** ${data.contact_info_for_site}`);

  if (data.has_images) {
    lines.push(`- **Has images:** Yes${data.image_details ? ` - ${data.image_details}` : ""}`);
  } else {
    lines.push(`- **Has images:** No`);
  }

  lines.push(``, `## Brand & Style`);
  lines.push(`- **Style:** ${data.style_preference || "Not specified"}`);
  lines.push(`- **Tone:** ${data.tone_of_voice || "Not specified"}`);
  if (data.font_preferences) lines.push(`- **Font preferences:** ${data.font_preferences}`);

  const colors = data.brand_colors as string[] | undefined;
  if (colors && colors.length > 0) {
    lines.push(`- **Brand colors:** ${colors.join(", ")}`);
  } else {
    lines.push(`- **Brand colors:** Let us choose`);
  }

  lines.push(`- **Has logo:** ${data.has_logo ? "Yes" : "No"}`);
  if (data.tagline) lines.push(`- **Tagline:** ${data.tagline}`);

  const inspiration = data.inspiration_urls as string[] | undefined;
  if (inspiration && inspiration.length > 0) {
    lines.push(`- **Inspiration sites:** ${inspiration.join(", ")}`);
  }

  if (data.current_website_url) {
    lines.push(`- **Current website:** ${data.current_website_url}`);
  }

  if (data.deadline) lines.push(``, `## Timeline`, `- **Deadline:** ${data.deadline}`);
  if (data.additional_notes) lines.push(``, `## Additional Notes`, data.additional_notes as string);

  lines.push(
    ``,
    `## Instructions`,
    `Build a production-ready Next.js website using the App Router, TypeScript, and Tailwind CSS.`,
    `The design should match the client's style preference and brand. Make it responsive, fast, and SEO-optimized.`,
    `Include all requested features. Use placeholder content where real content wasn't provided.`,
  );

  return lines.join("\n");
}

// Builds a human-readable summary
function buildSummary(data: Record<string, unknown>): string {
  const parts: string[] = [
    `Project for ${data.company_name || "Unknown Company"} (${data.full_name || "Unknown"})`,
    data.company_location ? `Location: ${data.company_location}` : "",
    `${data.business_description || "No description"}`,
    ``,
    `Site: ${data.site_type || "?"} — Goal: ${data.primary_goal || "?"}`,
  ];

  const features = data.features as string[] | undefined;
  if (features && features.length > 0) {
    parts.push(`Features: ${features.join(", ")}`);
  }

  parts.push(`Audience: ${data.target_audience || "Not specified"}`);
  parts.push(`Language: ${data.website_language || "Not specified"}`);
  parts.push(`Style: ${data.style_preference || "?"} / Tone: ${data.tone_of_voice || "?"}`);

  if (data.font_preferences) parts.push(`Fonts: ${data.font_preferences}`);
  if (data.contact_info_for_site) parts.push(`Contact on site: ${data.contact_info_for_site}`);
  parts.push(`Images: ${data.has_images ? "Yes" : "No"}${data.image_details ? ` - ${data.image_details}` : ""}`);

  if (data.deadline) parts.push(`Deadline: ${data.deadline}`);
  if (data.additional_notes) parts.push(`Notes: ${data.additional_notes}`);

  return parts.join("\n");
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
  }

  const body: SubmitBody = await request.json();

  if (!body.messages || body.messages.length === 0) {
    return NextResponse.json({ error: "No conversation provided" }, { status: 400 });
  }

  // Step 1: Extract structured data from the conversation via AI
  const conversationText = body.messages
    .map((m) => `${m.role === "user" ? "Client" : "Consultant"}: ${m.content}`)
    .join("\n\n");

  let extractedData: Record<string, unknown> = {};

  try {
    const extractRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: EXTRACTION_PROMPT + conversationText },
        ],
        max_tokens: 1000,
        temperature: 0,
      }),
    });

    if (extractRes.ok) {
      const extractJson = await extractRes.json();
      const raw = extractJson.choices?.[0]?.message?.content || "";
      // Strip any accidental markdown fences
      const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      extractedData = JSON.parse(cleaned);
    } else {
      console.error("Extraction AI call failed:", extractRes.status);
    }
  } catch (err) {
    console.error("Failed to extract structured data:", err);
  }

  const projectSummary = buildSummary(extractedData);
  const claudePrompt = buildClaudePrompt(extractedData);

  // Step 2: Save to Supabase
  let submissionId = crypto.randomUUID();

  try {
    if (isSupabaseConfigured()) {
      const supabase = createServerClient();
      // Core fields that exist in the base migration
      const insertData: Record<string, unknown> = {
        full_name: extractedData.full_name || null,
        email: extractedData.email || null,
        phone: extractedData.phone || null,
        company_name: extractedData.company_name || null,
        business_description: extractedData.business_description || null,
        site_type: extractedData.site_type || null,
        page_count: extractedData.page_count || null,
        page_descriptions: extractedData.page_descriptions || null,
        primary_goal: extractedData.primary_goal || null,
        features: extractedData.features || [],
        target_audience: extractedData.target_audience || null,
        current_website_url: extractedData.current_website_url || null,
        inspiration_urls: extractedData.inspiration_urls || [],
        style_preference: extractedData.style_preference || null,
        brand_colors: extractedData.brand_colors || [],
        has_logo: extractedData.has_logo || false,
        tone_of_voice: extractedData.tone_of_voice || null,
        tagline: extractedData.tagline || null,
        preferred_cta: extractedData.preferred_cta || null,
        deadline: extractedData.deadline || null,
        additional_notes: extractedData.additional_notes || null,
        conversation: body.messages,
        project_summary: projectSummary,
        claude_prompt: claudePrompt,
        status: "submitted",
        // Store new fields + uploaded files in the notes JSONB column
        // so they're saved even before running the new SQL migration
        notes: {
          is_new_site: extractedData.is_new_site ?? true,
          website_language: extractedData.website_language || null,
          font_preferences: extractedData.font_preferences || null,
          contact_info_for_site: extractedData.contact_info_for_site || null,
          has_images: extractedData.has_images || false,
          image_details: extractedData.image_details || null,
          uploaded_files: body.uploaded_files && body.uploaded_files.length > 0 ? body.uploaded_files : [],
        },
      };

      // Try inserting with optional columns first (in case migrations have been run)
      // Fall back to base insert if it fails
      let row = null;
      let error = null;

      // Attempt with optional columns
      const fullInsert = {
        ...insertData,
        company_location: extractedData.company_location || null,
        uploaded_files: body.uploaded_files && body.uploaded_files.length > 0 ? body.uploaded_files : null,
        files_expire_at: body.uploaded_files && body.uploaded_files.length > 0
          ? new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
          : null,
      };

      const fullResult = await supabase
        .from("intake_submissions")
        .insert(fullInsert)
        .select("id")
        .single();

      if (fullResult.error) {
        console.warn("Full insert failed, trying base insert:", fullResult.error.message);
        // Retry with only base columns
        const baseResult = await supabase
          .from("intake_submissions")
          .insert(insertData)
          .select("id")
          .single();

        row = baseResult.data;
        error = baseResult.error;
      } else {
        row = fullResult.data;
        error = null;
      }

      if (error) {
        console.error("Supabase insert failed:", error);
      } else if (row) {
        submissionId = row.id;
        console.log("Submission saved to Supabase:", submissionId);
      }
    } else {
      console.log("=== INTAKE SUBMISSION (no Supabase) ===");
      console.log("ID:", submissionId);
      console.log("Extracted:", JSON.stringify(extractedData, null, 2));
      console.log("Summary:", projectSummary);
      console.log("Claude Prompt:", claudePrompt);
      console.log("=== END SUBMISSION ===");
    }
  } catch (err) {
    console.error("Supabase error:", err);
  }

  // Step 3: Send notifications in parallel
  try {
    const email = extractedData.email as string | undefined;
    const fullName = extractedData.full_name as string | undefined;
    const companyName = extractedData.company_name as string | undefined;

    await Promise.allSettled([
      // Confirmation email (only if we have an email)
      email && fullName
        ? sendConfirmationEmail({
            to: email,
            fullName: fullName,
            companyName: companyName || "your company",
          })
        : Promise.resolve(),

      // Telegram notification
      notifyOwnerConversation({
        submissionId,
        summary: projectSummary,
        fullName: fullName || "Unknown",
        email: email || "Not provided",
        phone: (extractedData.phone as string) || "Not provided",
        companyName: companyName || "Unknown",
        companyLocation: (extractedData.company_location as string) || undefined,
      }),
    ]);
  } catch (err) {
    console.error("Notification error:", err);
  }

  return NextResponse.json({ success: true, id: submissionId });
}
