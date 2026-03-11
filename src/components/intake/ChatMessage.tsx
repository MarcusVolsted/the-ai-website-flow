"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ChatMessageProps {
  role: "assistant" | "user";
  children: ReactNode;
  animate?: boolean;
}

const messageVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
};

export function ChatMessage({
  role,
  children,
  animate = true,
}: ChatMessageProps) {
  const bubbleClasses = cn(
    "max-w-[85%] rounded-2xl px-5 py-4",
    role === "assistant" && [
      "bg-surface-elevated border border-surface-border",
      "text-text-primary",
    ],
    role === "user" && [
      "bg-brand/10 border border-brand/20",
      "text-text-primary",
    ],
  );

  return (
    <div
      className={cn(
        "flex w-full gap-3",
        role === "user" ? "justify-end" : "justify-start",
      )}
    >
      {role === "assistant" && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 mt-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="text-brand"
          >
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {animate ? (
        <motion.div
          variants={messageVariants}
          initial="hidden"
          animate="visible"
          className={bubbleClasses}
        >
          {children}
        </motion.div>
      ) : (
        <div className={bubbleClasses}>{children}</div>
      )}
    </div>
  );
}
