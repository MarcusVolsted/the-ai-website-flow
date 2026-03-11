"use server";

import { sendConfirmationEmail } from "./resend";
import { notifyOwner } from "./telegram";
import { createServerClient, isSupabaseConfigured } from "./supabase";

interface SubmitIntakeParams {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  currentWebsiteUrl?: string;
  siteType: string;
  pageCount: number;
  pageDescriptions: string;
  features: string[];
  primaryGoal: string;
  inspirationUrls: string[];
  stylePreference: string;
  hasLogo: boolean;
  brandColors: string[];
  letUsChooseColors: boolean;
  toneOfVoice: string;
  tagline?: string;
  mainCta: string;
  targetAudience: string;
  anythingElse?: string;
}

export async function submitIntake(data: SubmitIntakeParams) {
  let submissionId: string;

  try {
    if (isSupabaseConfigured()) {
      const supabase = createServerClient();
      const { data: row, error } = await supabase
        .from("intake_submissions")
        .insert({
          full_name: data.fullName,
          email: data.email,
          phone: data.phone,
          company_name: data.companyName,
          current_website_url: data.currentWebsiteUrl || null,
          site_type: data.siteType,
          page_count: data.pageCount,
          page_descriptions: data.pageDescriptions,
          features: data.features,
          primary_goal: data.primaryGoal,
          inspiration_urls: data.inspirationUrls.filter((u) => u.trim()),
          style_preference: data.stylePreference,
          has_logo: data.hasLogo,
          brand_colors: data.brandColors.filter((c) =>
            /^#[0-9A-Fa-f]{6}$/.test(c),
          ),
          let_us_choose_colors: data.letUsChooseColors,
          tone_of_voice: data.toneOfVoice,
          tagline: data.tagline || null,
          main_cta: data.mainCta,
          target_audience: data.targetAudience,
          anything_else: data.anythingElse || null,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Supabase insert failed:", error);
        submissionId = crypto.randomUUID();
      } else {
        submissionId = row.id;
        console.log("Saved to Supabase:", submissionId);
      }
    } else {
      submissionId = crypto.randomUUID();
      console.log("=== NEW INTAKE SUBMISSION (no Supabase) ===");
      console.log(JSON.stringify(data, null, 2));
      console.log("ID:", submissionId);
      console.log("============================================");
    }
  } catch (error) {
    console.error("Supabase error (continuing with notifications):", error);
    submissionId = crypto.randomUUID();
  }

  // Send notifications in parallel
  try {
    const results = await Promise.allSettled([
      sendConfirmationEmail({
        to: data.email,
        fullName: data.fullName,
        companyName: data.companyName,
      }),
      notifyOwner({
        submissionId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        currentWebsiteUrl: data.currentWebsiteUrl,
        siteType: data.siteType,
        pageCount: data.pageCount,
        features: data.features,
        primaryGoal: data.primaryGoal,
        stylePreference: data.stylePreference,
        toneOfVoice: data.toneOfVoice,
        targetAudience: data.targetAudience,
        mainCta: data.mainCta,
      }),
    ]);

    results.forEach((r, i) => {
      if (r.status === "rejected") {
        const service = i === 0 ? "Resend" : "Telegram";
        console.error(`${service} notification failed:`, r.reason);
      }
    });
  } catch (error) {
    console.error("Notification dispatch failed:", error);
  }

  return { success: true, id: submissionId };
}
