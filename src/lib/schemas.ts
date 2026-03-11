import { z } from "zod/v4";

// Step 1 — Contact Info
export const contactInfoSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(5, "Please enter a valid phone number"),
  companyName: z.string().min(1, "Company name is required"),
  currentWebsiteUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

// Step 2 — Project Scope
export const projectScopeSchema = z
  .object({
    siteType: z.enum(["one-pager", "multi-page", "ecommerce", "other"]),
    pageCount: z.number().min(1, "At least 1 page").max(50, "Max 50 pages"),
    pageDescriptions: z.string(),
    features: z.array(z.string()).min(1, "Select at least one feature"),
    primaryGoal: z.enum([
      "generate-leads",
      "sell-products",
      "showcase-work",
      "inform-visitors",
    ]),
  })
  .refine(
    (d) => d.siteType === "one-pager" || d.pageDescriptions.length >= 5,
    { path: ["pageDescriptions"], message: "Describe the pages you need" },
  );

// Step 3 — Brand & Style
export const brandStyleSchema = z.object({
  inspirationUrls: z.array(z.string()),
  stylePreference: z.enum(["minimal", "bold", "playful", "corporate", "luxury"]),
  hasLogo: z.boolean(),
  logoFile: z.instanceof(File).optional(),
  brandColors: z.array(z.string()),
  letUsChooseColors: z.boolean(),
  toneOfVoice: z.enum(["professional", "casual", "friendly", "luxury"]),
});

// Step 4 — Content & Details
export const contentDetailsSchema = z.object({
  tagline: z.string().optional().or(z.literal("")),
  mainCta: z.enum(["call", "fill-form", "book-appointment", "buy", "other"]),
  targetAudience: z
    .string()
    .min(5, "Tell us a bit about who you're trying to reach"),
  anythingElse: z.string().optional().or(z.literal("")),
});

export type ContactInfoData = z.infer<typeof contactInfoSchema>;
export type ProjectScopeData = z.infer<typeof projectScopeSchema>;
export type BrandStyleData = z.infer<typeof brandStyleSchema>;
export type ContentDetailsData = z.infer<typeof contentDetailsSchema>;

export type IntakeFormData = ContactInfoData &
  Omit<BrandStyleData, "logoFile"> &
  ProjectScopeData &
  ContentDetailsData & {
    logoUrl?: string;
  };

export const SITE_TYPE_OPTIONS = [
  { value: "one-pager", label: "One-Pager", description: "Single scrollable page with all key sections" },
  { value: "multi-page", label: "Multi-Page", description: "Multiple pages (About, Services, Contact, etc.)" },
  { value: "ecommerce", label: "Online Store", description: "Sell products online with cart and payments" },
  { value: "other", label: "Other / Not Sure", description: "Something else or you'd like our recommendation" },
] as const;

export const FEATURE_OPTIONS = [
  { value: "contact-form", label: "Contact Form" },
  { value: "booking-system", label: "Booking / Scheduling" },
  { value: "blog", label: "Blog" },
  { value: "gallery", label: "Photo Gallery" },
  { value: "testimonials", label: "Testimonials" },
  { value: "pricing", label: "Pricing Table" },
  { value: "newsletter", label: "Newsletter Signup" },
  { value: "social-feed", label: "Social Media Feed" },
  { value: "maps", label: "Map / Location" },
  { value: "faq", label: "FAQ Section" },
  { value: "team", label: "Team Section" },
  { value: "portfolio", label: "Portfolio / Case Studies" },
] as const;

export const GOAL_OPTIONS = [
  { value: "generate-leads", label: "Generate Leads", description: "Get people to reach out or sign up" },
  { value: "sell-products", label: "Sell Products", description: "Drive purchases and transactions" },
  { value: "showcase-work", label: "Showcase Work", description: "Display your portfolio or projects" },
  { value: "inform-visitors", label: "Inform Visitors", description: "Share information and build trust" },
] as const;

export const STYLE_OPTIONS = [
  { value: "minimal", label: "Minimal", description: "Clean, whitespace-driven, understated" },
  { value: "bold", label: "Bold", description: "High contrast, big type, attention-grabbing" },
  { value: "playful", label: "Playful", description: "Rounded, colorful, friendly vibe" },
  { value: "corporate", label: "Corporate", description: "Professional, structured, trustworthy" },
  { value: "luxury", label: "Luxury", description: "Dark tones, refined, premium feel" },
] as const;

export const TONE_OPTIONS = [
  { value: "professional", label: "Professional", description: "Polished and authoritative" },
  { value: "casual", label: "Casual", description: "Relaxed and approachable" },
  { value: "friendly", label: "Friendly", description: "Warm and conversational" },
  { value: "luxury", label: "Luxury", description: "Exclusive and refined" },
] as const;

export const CTA_OPTIONS = [
  { value: "call", label: "Call Us" },
  { value: "fill-form", label: "Fill Out a Form" },
  { value: "book-appointment", label: "Book an Appointment" },
  { value: "buy", label: "Buy / Purchase" },
  { value: "other", label: "Other" },
] as const;
