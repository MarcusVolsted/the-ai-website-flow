"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-xl border border-surface-border bg-surface-floating px-4 py-3 text-sm text-text-primary",
          "placeholder:text-text-muted",
          "focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors duration-200",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
