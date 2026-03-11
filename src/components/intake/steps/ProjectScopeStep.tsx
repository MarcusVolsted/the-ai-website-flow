"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  projectScopeSchema,
  type ProjectScopeData,
  SITE_TYPE_OPTIONS,
  FEATURE_OPTIONS,
  GOAL_OPTIONS,
} from "@/lib/schemas";
import { useIntakeState, useIntakeDispatch } from "../IntakeContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function ProjectScopeStep() {
  const state = useIntakeState();
  const dispatch = useIntakeDispatch();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectScopeData>({
    resolver: zodResolver(projectScopeSchema),
    defaultValues: state.projectScopeData || {
      siteType: "" as ProjectScopeData["siteType"],
      pageCount: undefined as unknown as number,
      pageDescriptions: "",
      features: [],
      primaryGoal: "" as ProjectScopeData["primaryGoal"],
    },
  });

  const selectedType = watch("siteType");
  const selectedGoal = watch("primaryGoal");
  const isOnePager = selectedType === "one-pager";

  // Auto-set page count and descriptions for one-pager
  useEffect(() => {
    if (isOnePager) {
      setValue("pageCount", 1, { shouldValidate: true });
      setValue("pageDescriptions", "Single page with all sections", { shouldValidate: true });
    }
  }, [isOnePager, setValue]);

  function onSubmit(data: ProjectScopeData) {
    dispatch({ type: "COMPLETE_PROJECT_SCOPE", payload: data });
  }

  function handleBack() {
    dispatch({ type: "GO_BACK" });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-4">
      {/* Site type */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-secondary">
          What type of site do you need?
        </label>
        <div className="flex flex-col gap-2">
          {SITE_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setValue("siteType", opt.value, { shouldValidate: true })}
              className={cn(
                "flex flex-col gap-0.5 rounded-xl border p-3 text-left",
                "transition-all duration-200",
                "hover:border-brand/50 hover:shadow-[0_0_20px_rgba(242,86,35,0.1)]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                "active:scale-[0.98]",
                selectedType === opt.value
                  ? "border-brand bg-brand/5 shadow-[0_0_20px_rgba(242,86,35,0.1)]"
                  : "border-surface-border bg-surface-floating",
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium transition-colors duration-200",
                  selectedType === opt.value
                    ? "text-text-primary"
                    : "text-text-secondary",
                )}
              >
                {opt.label}
              </span>
              <span className="text-[11px] text-text-muted leading-tight">
                {opt.description}
              </span>
            </button>
          ))}
        </div>
        {errors.siteType && (
          <p className="text-xs text-red-400">{errors.siteType.message}</p>
        )}
      </div>

      {/* Page count & descriptions — hidden for one-pager */}
      {!isOnePager && (
        <>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pageCount" className="text-sm font-medium text-text-secondary">
              How many pages?
            </label>
            <input
              id="pageCount"
              type="number"
              min={1}
              max={50}
              placeholder="e.g. 5"
              className={cn(
                "w-32 rounded-xl border bg-surface-floating px-4 py-2.5 text-sm text-text-primary",
                "placeholder:text-text-muted",
                "transition-colors duration-200",
                "hover:border-text-muted",
                "focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30",
                errors.pageCount ? "border-red-500/50" : "border-surface-border",
              )}
              {...register("pageCount", { valueAsNumber: true })}
            />
            {errors.pageCount && (
              <p className="text-xs text-red-400">{errors.pageCount.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="pageDescriptions" className="text-sm font-medium text-text-secondary">
              What pages do you need?
            </label>
            <textarea
              id="pageDescriptions"
              rows={3}
              placeholder="e.g. Home, About Us, Services, Portfolio, Contact — describe what each page should cover"
              className={cn(
                "w-full resize-none rounded-xl border bg-surface-floating px-4 py-3 text-sm text-text-primary",
                "placeholder:text-text-muted",
                "transition-colors duration-200",
                "hover:border-text-muted",
                "focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30",
                errors.pageDescriptions ? "border-red-500/50" : "border-surface-border",
              )}
              {...register("pageDescriptions")}
            />
            {errors.pageDescriptions && (
              <p className="text-xs text-red-400">{errors.pageDescriptions.message}</p>
            )}
          </div>
        </>
      )}

      {/* Features */}
      <Controller
        name="features"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">
              What features do you need?
            </label>
            <div className="flex flex-wrap gap-2">
              {FEATURE_OPTIONS.map((feat) => {
                const isSelected = field.value.includes(feat.value);
                return (
                  <button
                    key={feat.value}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        field.onChange(field.value.filter((v: string) => v !== feat.value));
                      } else {
                        field.onChange([...field.value, feat.value]);
                      }
                    }}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-medium",
                      "transition-all duration-200",
                      "hover:border-brand/50",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                      "active:scale-[0.95]",
                      isSelected
                        ? "border-brand bg-brand/10 text-brand"
                        : "border-surface-border bg-surface-floating text-text-secondary hover:text-text-primary",
                    )}
                  >
                    {isSelected && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="inline mr-1 -mt-0.5">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {feat.label}
                  </button>
                );
              })}
            </div>
            {errors.features && (
              <p className="text-xs text-red-400">{errors.features.message}</p>
            )}
          </div>
        )}
      />

      {/* Primary goal */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-secondary">
          What's the site's primary goal?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {GOAL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setValue("primaryGoal", opt.value, { shouldValidate: true })}
              className={cn(
                "flex flex-col gap-0.5 rounded-xl border p-3 text-left",
                "transition-all duration-200",
                "hover:border-brand/50 hover:shadow-[0_0_20px_rgba(242,86,35,0.1)]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                "active:scale-[0.97]",
                selectedGoal === opt.value
                  ? "border-brand bg-brand/5 shadow-[0_0_20px_rgba(242,86,35,0.1)]"
                  : "border-surface-border bg-surface-floating",
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium",
                  selectedGoal === opt.value
                    ? "text-text-primary"
                    : "text-text-secondary",
                )}
              >
                {opt.label}
              </span>
              <span className="text-[10px] text-text-muted leading-tight">
                {opt.description}
              </span>
            </button>
          ))}
        </div>
        {errors.primaryGoal && (
          <p className="text-xs text-red-400">{errors.primaryGoal.message}</p>
        )}
      </div>

      <div className="mt-2 flex gap-3">
        <Button type="button" variant="ghost" onClick={handleBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-1">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </Button>
        <Button type="submit">
          Continue
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ml-1">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
      </div>
    </form>
  );
}
