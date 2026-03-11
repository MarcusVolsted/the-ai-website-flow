"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  brandStyleSchema,
  type BrandStyleData,
  STYLE_OPTIONS,
  TONE_OPTIONS,
} from "@/lib/schemas";
import { useIntakeState, useIntakeDispatch } from "../IntakeContext";
import { ColorPicker } from "../fields/ColorPicker";
import { FileDropzone } from "../fields/FileDropzone";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function BrandStyleStep() {
  const state = useIntakeState();
  const dispatch = useIntakeDispatch();

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BrandStyleData>({
    resolver: zodResolver(brandStyleSchema),
    defaultValues: {
      inspirationUrls: state.brandStyleData?.inspirationUrls || [""],
      stylePreference:
        state.brandStyleData?.stylePreference ||
        ("" as BrandStyleData["stylePreference"]),
      hasLogo: state.brandStyleData?.hasLogo ?? true,
      logoFile: undefined,
      brandColors: state.brandStyleData?.brandColors || ["#"],
      letUsChooseColors: state.brandStyleData?.letUsChooseColors || false,
      toneOfVoice:
        state.brandStyleData?.toneOfVoice ||
        ("" as BrandStyleData["toneOfVoice"]),
    },
  });

  const letUsChoose = watch("letUsChooseColors");
  const hasLogo = watch("hasLogo");
  const selectedStyle = watch("stylePreference");
  const selectedTone = watch("toneOfVoice");

  function onSubmit(data: BrandStyleData) {
    const logoPreviewUrl =
      data.logoFile ? URL.createObjectURL(data.logoFile) : undefined;
    dispatch({
      type: "COMPLETE_BRAND_STYLE",
      payload: {
        inspirationUrls: data.inspirationUrls,
        stylePreference: data.stylePreference,
        hasLogo: data.hasLogo,
        brandColors: data.brandColors,
        letUsChooseColors: data.letUsChooseColors,
        toneOfVoice: data.toneOfVoice,
        logoPreviewUrl,
      },
    });
  }

  function handleBack() {
    dispatch({ type: "GO_BACK" });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-4">
      {/* Inspiration URLs */}
      <Controller
        name="inspirationUrls"
        control={control}
        render={({ field }) => (
          <InspirationUrls value={field.value} onChange={field.onChange} />
        )}
      />

      {/* Style preference */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-secondary">
          Style Preference
        </label>
        <div className="flex flex-wrap gap-2">
          {STYLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setValue("stylePreference", opt.value)}
              className={cn(
                "flex flex-col gap-0.5 rounded-xl border px-4 py-2.5",
                "transition-all duration-200",
                "hover:border-brand/50 hover:shadow-[0_0_20px_rgba(242,86,35,0.1)]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                "active:scale-[0.97]",
                selectedStyle === opt.value
                  ? "border-brand bg-brand/5 shadow-[0_0_20px_rgba(242,86,35,0.1)]"
                  : "border-surface-border bg-surface-floating",
              )}
            >
              <span className="text-xs font-medium text-text-primary">
                {opt.label}
              </span>
              <span className="text-[10px] text-text-muted leading-tight">
                {opt.description}
              </span>
            </button>
          ))}
        </div>
        {errors.stylePreference && (
          <p className="text-xs text-red-400">{errors.stylePreference.message}</p>
        )}
      </div>

      {/* Logo */}
      <Controller
        name="logoFile"
        control={control}
        render={({ field }) => (
          <FileDropzone
            value={field.value}
            onChange={field.onChange}
            noLogo={!hasLogo}
            onNoLogoChange={(checked) => setValue("hasLogo", !checked)}
            error={errors.logoFile?.message}
          />
        )}
      />

      {/* Colors */}
      <Controller
        name="brandColors"
        control={control}
        render={({ field }) => (
          <ColorPicker
            value={field.value}
            onChange={field.onChange}
            letUsChoose={letUsChoose}
            onLetUsChooseChange={(checked) =>
              setValue("letUsChooseColors", checked)
            }
            error={errors.brandColors?.message}
          />
        )}
      />

      {/* Tone of voice */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-secondary">
          Tone of Voice
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TONE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setValue("toneOfVoice", opt.value)}
              className={cn(
                "flex flex-col gap-0.5 rounded-xl border p-3 text-left",
                "transition-all duration-200",
                "hover:border-brand/50 hover:shadow-[0_0_20px_rgba(242,86,35,0.1)]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                "active:scale-[0.97]",
                selectedTone === opt.value
                  ? "border-brand bg-brand/5 shadow-[0_0_20px_rgba(242,86,35,0.1)]"
                  : "border-surface-border bg-surface-floating",
              )}
            >
              <span className="text-xs font-medium text-text-primary">
                {opt.label}
              </span>
              <span className="text-[10px] text-text-muted leading-tight">
                {opt.description}
              </span>
            </button>
          ))}
        </div>
        {errors.toneOfVoice && (
          <p className="text-xs text-red-400">{errors.toneOfVoice.message}</p>
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

function InspirationUrls({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  function updateUrl(index: number, url: string) {
    const updated = [...value];
    updated[index] = url;
    onChange(updated);
  }

  function addUrl() {
    if (value.length < 3) {
      onChange([...value, ""]);
    }
  }

  function removeUrl(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-secondary">
        Websites you love
        <span className="text-text-muted font-normal ml-1">(optional, up to 3)</span>
      </label>
      <div className="flex flex-col gap-2">
        {value.map((url, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => updateUrl(i, e.target.value)}
              placeholder="https://example.com"
              className={cn(
                "flex-1 rounded-xl border border-surface-border bg-surface-floating px-4 py-2.5 text-sm text-text-primary",
                "placeholder:text-text-muted",
                "transition-colors duration-200",
                "hover:border-text-muted",
                "focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30",
              )}
            />
            {value.length > 1 && (
              <button
                type="button"
                onClick={() => removeUrl(i)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-surface-border bg-surface-floating text-text-muted hover:text-red-400 hover:border-red-400/30 transition-colors duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
      {value.length < 3 && (
        <button
          type="button"
          onClick={addUrl}
          className="self-start text-xs text-brand hover:text-brand/80 transition-colors duration-200"
        >
          + Add another site
        </button>
      )}
    </div>
  );
}
