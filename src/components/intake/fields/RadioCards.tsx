"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface RadioOption {
  value: string;
  label: string;
  description: string;
  icon: ReactNode;
}

interface RadioCardsProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function RadioCards({ options, value, onChange, error }: RadioCardsProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-secondary">
        How would you like to proceed?
      </label>
      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "group flex items-start gap-4 rounded-xl border p-4 text-left",
              "transition-all duration-200",
              "hover:border-brand/50 hover:shadow-[0_0_20px_rgba(242,86,35,0.1)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
              "active:scale-[0.98]",
              value === option.value
                ? "border-brand bg-brand/5 shadow-[0_0_20px_rgba(242,86,35,0.1)]"
                : "border-surface-border bg-surface-floating",
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
                value === option.value
                  ? "bg-brand/20 text-brand"
                  : "bg-surface-elevated text-text-muted group-hover:text-text-secondary",
              )}
            >
              {option.icon}
            </div>
            <div className="flex flex-col gap-0.5">
              <span
                className={cn(
                  "text-sm font-medium transition-colors duration-200",
                  value === option.value
                    ? "text-text-primary"
                    : "text-text-secondary group-hover:text-text-primary",
                )}
              >
                {option.label}
              </span>
              <span className="text-xs text-text-muted leading-relaxed">
                {option.description}
              </span>
            </div>
            <div
              className={cn(
                "ml-auto mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200",
                value === option.value
                  ? "border-brand bg-brand"
                  : "border-surface-border",
              )}
            >
              {value === option.value && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
