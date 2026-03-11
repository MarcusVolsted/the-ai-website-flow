"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const pains = [
  {
    pain: "Paid thousands upfront for a site that looked nothing like what you were promised.",
    fix: "Free mockup first. You see exactly what you get before spending a cent.",
  },
  {
    pain: "Every small text change or image swap came with a surprise invoice.",
    fix: "Unlimited revisions included. Change anything, anytime. No extra fees.",
  },
  {
    pain: "Locked into a multi-year contract with an agency that stopped responding.",
    fix: "6-month commitment, then month-to-month. We respond within 24 hours.",
  },
  {
    pain: "The \"final\" website took 3-6 months and still needed work.",
    fix: "Your first mockup is ready in 1-3 days. Build and launch within a week.",
  },
];

export function PainPoints() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-brand font-medium">
            Sound familiar?
          </span>
          <h2 className="font-[family-name:var(--font-plus-jakarta)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mt-4 mb-5">
            Tired of agencies
            <br />
            <span className="text-text-secondary">that overpromise and underdeliver?</span>
          </h2>
        </motion.div>

        {/* Column headers */}
        <div className="hidden sm:grid grid-cols-2 gap-8 mb-4 px-6">
          <span className="text-xs uppercase tracking-[0.15em] text-red-400/80 font-medium">
            Traditional agencies
          </span>
          <span className="text-xs uppercase tracking-[0.15em] text-emerald-400/80 font-medium">
            With us
          </span>
        </div>

        <div className="space-y-4">
          {pains.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                delay: i * 0.08,
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94] as const,
              }}
              className="rounded-2xl border border-surface-border/50 bg-surface-elevated/30 p-5 sm:p-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                {/* Pain */}
                <div>
                  <span className="sm:hidden text-[10px] uppercase tracking-[0.15em] text-red-400/80 font-medium mb-2 block">
                    Traditional agencies
                  </span>
                  <div className="flex gap-3">
                    <div className="shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/10">
                      <X className="h-3 w-3 text-red-400" />
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {item.pain}
                    </p>
                  </div>
                </div>
                {/* Fix */}
                <div>
                  <span className="sm:hidden text-[10px] uppercase tracking-[0.15em] text-emerald-400/80 font-medium mb-2 block">
                    With us
                  </span>
                  <div className="flex gap-3">
                    <div className="shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
                      <Check className="h-3 w-3 text-emerald-400" />
                    </div>
                    <p className="text-sm text-text-primary leading-relaxed font-medium">
                      {item.fix}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
