"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contentDetailsSchema,
  type ContentDetailsData,
  CTA_OPTIONS,
} from "@/lib/schemas";
import { useIntakeState, useIntakeDispatch } from "../IntakeContext";
import { Button } from "@/components/ui/Button";
import { submitIntake } from "@/lib/actions";
import { cn } from "@/lib/utils";

export function ContentDetailsStep() {
  const state = useIntakeState();
  const dispatch = useIntakeDispatch();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContentDetailsData>({
    resolver: zodResolver(contentDetailsSchema),
    defaultValues: state.contentDetailsData || {
      tagline: "",
      mainCta: "" as ContentDetailsData["mainCta"],
      targetAudience: "",
      anythingElse: "",
    },
  });

  const selectedCta = watch("mainCta");

  async function onSubmit(data: ContentDetailsData) {
    dispatch({ type: "SET_SUBMITTING", payload: true });

    try {
      const result = await submitIntake({
        fullName: state.contactInfoData!.fullName,
        email: state.contactInfoData!.email,
        phone: state.contactInfoData!.phone,
        companyName: state.contactInfoData!.companyName,
        currentWebsiteUrl: state.contactInfoData?.currentWebsiteUrl || undefined,
        siteType: state.projectScopeData!.siteType,
        pageCount: state.projectScopeData!.pageCount,
        pageDescriptions: state.projectScopeData!.pageDescriptions,
        features: state.projectScopeData!.features,
        primaryGoal: state.projectScopeData!.primaryGoal,
        inspirationUrls: state.brandStyleData?.inspirationUrls || [],
        stylePreference: state.brandStyleData!.stylePreference,
        hasLogo: state.brandStyleData!.hasLogo,
        brandColors: state.brandStyleData?.brandColors || [],
        letUsChooseColors: state.brandStyleData?.letUsChooseColors || false,
        toneOfVoice: state.brandStyleData!.toneOfVoice,
        tagline: data.tagline || undefined,
        mainCta: data.mainCta,
        targetAudience: data.targetAudience,
        anythingElse: data.anythingElse || undefined,
      });

      dispatch({ type: "COMPLETE_CONTENT_DETAILS", payload: data });
      dispatch({ type: "SET_SUBMISSION_ID", payload: result.id });
    } catch (error) {
      console.error("Submit failed:", error);
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  }

  function handleBack() {
    dispatch({ type: "GO_BACK" });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-4">
      {/* Tagline */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="tagline" className="text-sm font-medium text-text-secondary">
          Tagline or Headline
          <span className="text-text-muted font-normal ml-1">(optional)</span>
        </label>
        <input
          id="tagline"
          type="text"
          placeholder="e.g. Build better websites, faster."
          className={cn(
            "w-full rounded-xl border border-surface-border bg-surface-floating px-4 py-2.5 text-sm text-text-primary",
            "placeholder:text-text-muted",
            "transition-colors duration-200",
            "hover:border-text-muted",
            "focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30",
          )}
          {...register("tagline")}
        />
      </div>

      {/* Main CTA */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-secondary">
          What should visitors do on your site?
        </label>
        <div className="flex flex-wrap gap-2">
          {CTA_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setValue("mainCta", opt.value, { shouldValidate: true })}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium",
                "transition-all duration-200",
                "hover:border-brand/50",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                "active:scale-[0.95]",
                selectedCta === opt.value
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-surface-border bg-surface-floating text-text-secondary hover:text-text-primary",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {errors.mainCta && (
          <p className="text-xs text-red-400">{errors.mainCta.message}</p>
        )}
      </div>

      {/* Target audience */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="targetAudience" className="text-sm font-medium text-text-secondary">
          Who is your target audience?
        </label>
        <textarea
          id="targetAudience"
          rows={2}
          placeholder="e.g. Small business owners aged 30-50 looking for premium web design"
          className={cn(
            "w-full resize-none rounded-xl border bg-surface-floating px-4 py-3 text-sm text-text-primary",
            "placeholder:text-text-muted",
            "transition-colors duration-200",
            "hover:border-text-muted",
            "focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30",
            errors.targetAudience ? "border-red-500/50" : "border-surface-border",
          )}
          {...register("targetAudience")}
        />
        {errors.targetAudience && (
          <p className="text-xs text-red-400">{errors.targetAudience.message}</p>
        )}
      </div>

      {/* Anything else */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="anythingElse" className="text-sm font-medium text-text-secondary">
          Anything else we should know?
          <span className="text-text-muted font-normal ml-1">(optional)</span>
        </label>
        <textarea
          id="anythingElse"
          rows={3}
          placeholder="Special requirements, deadlines, existing content, specific pages you need..."
          className={cn(
            "w-full resize-none rounded-xl border border-surface-border bg-surface-floating px-4 py-3 text-sm text-text-primary",
            "placeholder:text-text-muted",
            "transition-colors duration-200",
            "hover:border-text-muted",
            "focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30",
          )}
          {...register("anythingElse")}
        />
      </div>

      <div className="mt-2 flex gap-3">
        <Button type="button" variant="ghost" onClick={handleBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-1">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </Button>
        <Button type="submit" isLoading={state.isSubmitting}>
          Submit
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ml-1">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
      </div>
    </form>
  );
}
