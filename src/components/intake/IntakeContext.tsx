"use client";

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react";
import type {
  ContactInfoData,
  ProjectScopeData,
  BrandStyleData,
  ContentDetailsData,
} from "@/lib/schemas";

export type Step =
  | "contact-info"
  | "project-scope"
  | "brand-style"
  | "content-details"
  | "success";

const STEPS: Step[] = [
  "contact-info",
  "project-scope",
  "brand-style",
  "content-details",
  "success",
];

export interface ChatMessageData {
  id: string;
  role: "assistant" | "user";
  content: string;
  stepId: Step;
}

interface IntakeState {
  currentStep: Step;
  direction: 1 | -1;
  contactInfoData: ContactInfoData | null;
  projectScopeData: ProjectScopeData | null;
  brandStyleData:
    | (Omit<BrandStyleData, "logoFile"> & { logoPreviewUrl?: string })
    | null;
  contentDetailsData: ContentDetailsData | null;
  isSubmitting: boolean;
  submissionId: string | null;
  messages: ChatMessageData[];
}

type IntakeAction =
  | { type: "COMPLETE_CONTACT_INFO"; payload: ContactInfoData }
  | { type: "COMPLETE_PROJECT_SCOPE"; payload: ProjectScopeData }
  | {
      type: "COMPLETE_BRAND_STYLE";
      payload: Omit<BrandStyleData, "logoFile"> & { logoPreviewUrl?: string };
    }
  | { type: "COMPLETE_CONTENT_DETAILS"; payload: ContentDetailsData }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_SUBMISSION_ID"; payload: string }
  | { type: "GO_BACK" };

const ASSISTANT_MESSAGES: Record<Step, string> = {
  "contact-info":
    "Hey there! Let's start with your contact details so we can get in touch.",
  "project-scope":
    "Nice to meet you! Now tell us about your project — what kind of site do you need?",
  "brand-style":
    "Looking good! Let's nail down the visual direction — your style, colors, and any inspiration.",
  "content-details":
    "Almost done! A few final details about your content and who you're trying to reach.",
  success: "",
};

function nextStep(step: Step): Step {
  const idx = STEPS.indexOf(step);
  return STEPS[Math.min(idx + 1, STEPS.length - 1)];
}

function prevStep(step: Step): Step {
  const idx = STEPS.indexOf(step);
  return STEPS[Math.max(idx - 1, 0)];
}

function summarizeContactInfo(data: ContactInfoData): string {
  const parts = [`${data.fullName} from ${data.companyName}`, data.email, data.phone];
  if (data.currentWebsiteUrl) parts.push(`Website: ${data.currentWebsiteUrl}`);
  return parts.join("\n");
}

function summarizeProjectScope(data: ProjectScopeData): string {
  const typeLabels: Record<string, string> = {
    "one-pager": "One-Pager",
    "multi-page": "Multi-Page",
    ecommerce: "Online Store",
    other: "Other",
  };
  const goalLabels: Record<string, string> = {
    "generate-leads": "Generate Leads",
    "sell-products": "Sell Products",
    "showcase-work": "Showcase Work",
    "inform-visitors": "Inform Visitors",
  };
  return [
    `Type: ${typeLabels[data.siteType] || data.siteType}`,
    `Pages: ${data.pageCount}`,
    `Pages needed: ${data.pageDescriptions}`,
    `Features: ${data.features.join(", ")}`,
    `Goal: ${goalLabels[data.primaryGoal] || data.primaryGoal}`,
  ].join("\n");
}

function summarizeBrandStyle(
  data: Omit<BrandStyleData, "logoFile"> & { logoPreviewUrl?: string },
): string {
  const parts: string[] = [];
  parts.push(`Style: ${data.stylePreference}`);
  parts.push(`Tone: ${data.toneOfVoice}`);
  if (data.letUsChooseColors) {
    parts.push("Colors: Let us choose");
  } else {
    const validColors = data.brandColors.filter((c) =>
      /^#[0-9A-Fa-f]{6}$/.test(c),
    );
    if (validColors.length > 0) parts.push(`Colors: ${validColors.join(", ")}`);
  }
  parts.push(`Logo: ${data.hasLogo ? "Uploaded" : "None yet"}`);
  const urls = data.inspirationUrls.filter((u) => u.trim());
  if (urls.length > 0) parts.push(`Inspiration: ${urls.join(", ")}`);
  return parts.join("\n");
}

function summarizeContentDetails(data: ContentDetailsData): string {
  const ctaLabels: Record<string, string> = {
    call: "Call Us",
    "fill-form": "Fill Out a Form",
    "book-appointment": "Book an Appointment",
    buy: "Buy / Purchase",
    other: "Other",
  };
  const parts: string[] = [];
  if (data.tagline) parts.push(`Tagline: ${data.tagline}`);
  parts.push(`CTA: ${ctaLabels[data.mainCta] || data.mainCta}`);
  parts.push(`Audience: ${data.targetAudience}`);
  if (data.anythingElse) parts.push(`Notes: ${data.anythingElse}`);
  return parts.join("\n");
}

let msgId = 0;
function createMsg(
  role: "assistant" | "user",
  content: string,
  stepId: Step,
): ChatMessageData {
  return { id: `msg-${++msgId}`, role, content, stepId };
}

function intakeReducer(state: IntakeState, action: IntakeAction): IntakeState {
  switch (action.type) {
    case "COMPLETE_CONTACT_INFO": {
      const next = nextStep("contact-info");
      return {
        ...state,
        contactInfoData: action.payload,
        currentStep: next,
        direction: 1,
        messages: [
          ...state.messages,
          createMsg("user", summarizeContactInfo(action.payload), "contact-info"),
          createMsg("assistant", ASSISTANT_MESSAGES[next], next),
        ],
      };
    }
    case "COMPLETE_PROJECT_SCOPE": {
      const next = nextStep("project-scope");
      return {
        ...state,
        projectScopeData: action.payload,
        currentStep: next,
        direction: 1,
        messages: [
          ...state.messages,
          createMsg("user", summarizeProjectScope(action.payload), "project-scope"),
          createMsg("assistant", ASSISTANT_MESSAGES[next], next),
        ],
      };
    }
    case "COMPLETE_BRAND_STYLE": {
      const next = nextStep("brand-style");
      return {
        ...state,
        brandStyleData: action.payload,
        currentStep: next,
        direction: 1,
        messages: [
          ...state.messages,
          createMsg("user", summarizeBrandStyle(action.payload), "brand-style"),
          createMsg("assistant", ASSISTANT_MESSAGES[next], next),
        ],
      };
    }
    case "COMPLETE_CONTENT_DETAILS": {
      return {
        ...state,
        contentDetailsData: action.payload,
        currentStep: "success",
        direction: 1,
        isSubmitting: false,
        messages: [
          ...state.messages,
          createMsg("user", summarizeContentDetails(action.payload), "content-details"),
        ],
      };
    }
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    case "SET_SUBMISSION_ID":
      return { ...state, submissionId: action.payload };
    case "GO_BACK": {
      const prev = prevStep(state.currentStep);
      if (prev === state.currentStep) return state;
      const trimmedMessages = state.messages.filter(
        (m) => m.stepId !== state.currentStep,
      );
      const lastUserIdx = trimmedMessages.findLastIndex(
        (m) => m.role === "user" && m.stepId === prev,
      );
      const finalMessages =
        lastUserIdx >= 0
          ? trimmedMessages.slice(0, lastUserIdx)
          : trimmedMessages;
      return {
        ...state,
        currentStep: prev,
        direction: -1,
        messages: finalMessages,
      };
    }
    default:
      return state;
  }
}

const initialState: IntakeState = {
  currentStep: "contact-info",
  direction: 1,
  contactInfoData: null,
  projectScopeData: null,
  brandStyleData: null,
  contentDetailsData: null,
  isSubmitting: false,
  submissionId: null,
  messages: [
    createMsg("assistant", ASSISTANT_MESSAGES["contact-info"], "contact-info"),
  ],
};

const IntakeStateContext = createContext<IntakeState>(initialState);
const IntakeDispatchContext = createContext<Dispatch<IntakeAction>>(() => {});

export function IntakeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(intakeReducer, initialState);
  return (
    <IntakeStateContext value={state}>
      <IntakeDispatchContext value={dispatch}>
        {children}
      </IntakeDispatchContext>
    </IntakeStateContext>
  );
}

export function useIntakeState() {
  return useContext(IntakeStateContext);
}

export function useIntakeDispatch() {
  return useContext(IntakeDispatchContext);
}

export function getVisibleSteps(): Step[] {
  return STEPS.filter((s) => s !== "success");
}

export { STEPS };
