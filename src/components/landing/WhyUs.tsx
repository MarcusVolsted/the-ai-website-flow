"use client";

import { motion } from "framer-motion";
import { Timer, RefreshCw, Shield, Zap } from "lucide-react";

const guarantees = [
  {
    icon: Timer,
    title: "1-3 day turnaround",
    description:
      "Your first design draft is ready within days, not months. Once you are a client, every revision request is turned around in 1-3 business days. Guaranteed.",
    highlight: true,
  },
  {
    icon: RefreshCw,
    title: "Unlimited revisions",
    description:
      "Need a new banner? Updated copy? A seasonal redesign? Queue it up. One request at a time, as many as you need. Your site evolves with your business.",
  },
  {
    icon: Shield,
    title: "Simple 6-month commitment",
    description:
      "Commit to 6 months and let us prove the value. After that, continue month-to-month or walk away with all your site files. No hidden fees.",
  },
  {
    icon: Zap,
    title: "Built for your business",
    description:
      "From landing pages to full multi-page sites with animations, forms, and integrations. We handle the design and the technical details so you can focus on what you do best.",
  },
];

export function WhyUs() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-brand font-medium">
            Why subscription
          </span>
          <h2 className="font-[family-name:var(--font-plus-jakarta)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mt-4 mb-5">
            Stop switching agencies.
            <br />
            <span className="text-text-secondary">Start actually growing.</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Traditional agencies charge thousands upfront, take months to deliver,
            then disappear. Every small change becomes a new invoice. So you switch
            to the next one, and the cycle repeats. With us, you get a dedicated team
            that keeps your site fresh, optimized, and working for you. Same people,
            flat fee, no surprises.
          </p>
        </motion.div>

        {/* Guarantees grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {guarantees.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                delay: i * 0.08,
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94] as const,
              }}
              className={
                item.highlight
                  ? "relative flex gap-4 rounded-2xl border border-brand/20 bg-brand/[0.04] p-6 transition-transform duration-200 hover:scale-[1.01]"
                  : "flex gap-4 rounded-2xl border border-surface-border/50 bg-surface-elevated/30 p-6 transition-transform duration-200 hover:scale-[1.01] hover:border-surface-border"
              }
            >
              {item.highlight && (
                <div className="absolute -top-2.5 left-6 px-2 py-0.5 rounded-md bg-brand text-[10px] font-semibold text-white uppercase tracking-wider">
                  Guarantee
                </div>
              )}
              <div className="shrink-0 mt-0.5">
                <item.icon className="h-5 w-5 text-brand" />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-semibold tracking-[-0.01em] mb-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
