"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium",
          "transition-transform transition-opacity duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          "disabled:pointer-events-none disabled:opacity-50",
          "active:scale-[0.97]",
          variant === "primary" && [
            "bg-brand text-white",
            "hover:bg-brand-light hover:shadow-[0_0_20px_rgba(242,86,35,0.3)]",
          ],
          variant === "secondary" && [
            "bg-surface-elevated text-text-primary border border-surface-border",
            "hover:bg-surface-floating hover:border-text-muted",
          ],
          variant === "ghost" && [
            "text-text-secondary",
            "hover:text-text-primary hover:bg-surface-elevated",
          ],
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
