"use client";

import { motion } from "framer-motion";
import { useIntakeState } from "../IntakeContext";

const checkVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" as const, delay: 0.2 },
  },
};

const containerVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
};

export function SuccessStep() {
  const state = useIntakeState();
  const name = state.contactInfoData?.fullName?.split(" ")[0] || "there";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center gap-6 py-8 text-center"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand/10">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <motion.path
            d="M20 6L9 17l-5-5"
            stroke="#F25623"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={checkVariants}
            initial="hidden"
            animate="visible"
          />
        </svg>
      </div>

      <div className="flex flex-col gap-2">
        <h2
          className="text-2xl font-bold tracking-tight text-text-primary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          We're on it, {name}!
        </h2>

        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <p className="text-sm text-text-secondary leading-relaxed">
            We've received everything we need. Our team will review your
            submission and get back to you at{" "}
            <strong className="text-text-primary">
              {state.contactInfoData?.email}
            </strong>{" "}
            within{" "}
            <strong className="text-text-primary">24 hours</strong>.
          </p>

          <div className="flex flex-col gap-2 rounded-xl border border-surface-border bg-surface-floating p-4 text-left w-full">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
              What happens next
            </p>
            <div className="flex flex-col gap-3">
              {[
                { step: "1", text: "We review your brand & project details" },
                { step: "2", text: "Our team crafts your website" },
                { step: "3", text: "You receive a live preview link" },
                { step: "4", text: "Love it? We finalize and launch" },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                    {item.step}
                  </span>
                  <span className="text-sm text-text-secondary">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {state.submissionId && (
        <p className="text-xs text-text-muted mt-4">
          Reference: {state.submissionId.slice(0, 8).toUpperCase()}
        </p>
      )}
    </motion.div>
  );
}
