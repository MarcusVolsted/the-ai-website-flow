"use client";

import { cn } from "@/lib/utils";
import { getVisibleSteps, type Step } from "./IntakeContext";

interface ProgressIndicatorProps {
  currentStep: Step;
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const visibleSteps = getVisibleSteps();
  const currentIndex = visibleSteps.indexOf(currentStep);

  return (
    <div className="flex items-center justify-center gap-1.5 py-4">
      {visibleSteps.map((step, i) => (
        <div
          key={step}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i <= currentIndex
              ? "w-6 bg-brand"
              : "w-1.5 bg-surface-border",
          )}
        />
      ))}
    </div>
  );
}
