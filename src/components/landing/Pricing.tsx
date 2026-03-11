"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Info, Coffee, ChevronDown, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Growth",
    badge: "Most Popular",
    price: "$399",
    description:
      "Best for most businesses that want continuous improvements and updates to their website.",
    features: [
      "Hosting included",
      "Domain management (optional)",
      "Security updates and backups",
      "Unlimited website requests",
      "One active request at a time",
      "24-48 hour turnaround",
      "Landing page builds",
      "Design improvements",
      "Performance optimization",
      "Bug fixes",
      "Mobile optimization",
    ],
    comparison: {
      amount: "$13/day",
      label: "about the cost of lunch.",
    },
    highlighted: true,
  },
  {
    name: "Pro",
    badge: null,
    price: "$799",
    description:
      "For businesses that rely heavily on their website and need faster execution.",
    features: [
      "Everything in Growth",
      "Two active requests at once",
      "Priority queue",
      "Faster turnaround",
      "Integrations",
      "Advanced development tasks",
    ],
    comparison: {
      amount: "$26/day",
      label: "less than hiring a developer for a single hour.",
    },
    highlighted: false,
  },
];

export function Pricing() {
  const [scopeOpen, setScopeOpen] = useState(false);

  return (
    <section id="pricing" className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-brand font-medium">
            Simple pricing
          </span>
          <h2 className="font-[family-name:var(--font-plus-jakarta)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mt-4 mb-5">
            Your own web team.
            <br />
            <span className="text-text-secondary">A fraction of the cost.</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Two plans. No hidden fees. Free mockup before you commit.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={cn(
                "relative rounded-3xl border p-8 sm:p-10 backdrop-blur-sm",
                plan.highlighted
                  ? "border-brand/30 bg-surface-elevated/60"
                  : "border-surface-border bg-surface-elevated/40",
              )}
            >
              {/* Glow effect on highlighted plan */}
              {plan.highlighted && (
                <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-brand/20 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100 pointer-events-none" />
              )}

              <div className="relative">
                {/* Badge + name */}
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-bold tracking-[-0.02em]">
                    {plan.name}
                  </h3>
                  {plan.badge && (
                    <span className="px-2.5 py-0.5 rounded-full bg-brand text-[10px] font-semibold text-white uppercase tracking-wider">
                      {plan.badge}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="font-[family-name:var(--font-plus-jakarta)] text-4xl sm:text-5xl font-bold text-text-primary">
                    {plan.price}
                  </span>
                  <span className="text-text-secondary text-base font-medium">/mo</span>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                  {plan.description}
                </p>

                {/* Value comparison */}
                <div className="mb-8 rounded-xl border border-surface-border/50 bg-surface-floating/50 px-4 py-3 flex items-center gap-3">
                  <Coffee className="h-4 w-4 text-brand shrink-0" />
                  <p className="text-sm text-text-secondary">
                    <span className="font-medium text-text-primary">{plan.comparison.amount}</span>
                    {" "}{plan.comparison.label}
                  </p>
                </div>

                <div className="border-t border-surface-border/50 pt-6 mb-8" />

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-brand shrink-0" />
                      <span className="text-sm text-text-secondary">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href="#get-started"
                  className={cn(
                    "w-full inline-flex items-center justify-center rounded-xl px-8 py-4 text-sm font-semibold transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                    plan.highlighted
                      ? "bg-brand text-white hover:shadow-[0_0_30px_rgba(242,86,35,0.4)]"
                      : "bg-surface-floating border border-surface-border text-text-primary hover:border-brand/30 hover:bg-surface-floating/80",
                  )}
                >
                  Get started
                </a>
                <p className="text-center text-xs text-text-muted mt-3">
                  No credit card required to start
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Shared fine print below both cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10 max-w-3xl mx-auto space-y-4"
        >
          {/* Expandable scope details */}
          <button
            type="button"
            onClick={() => setScopeOpen(!scopeOpen)}
            className={cn(
              "w-full flex items-center gap-2 text-left group",
              "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-lg",
            )}
          >
            <Package className="h-3.5 w-3.5 text-text-muted shrink-0" />
            <span className="text-xs text-text-muted group-hover:text-text-secondary transition-colors duration-200">
              What about custom functionality?
            </span>
            <ChevronDown
              className={cn(
                "h-3 w-3 text-text-muted ml-auto transition-transform duration-200",
                scopeOpen && "rotate-180",
              )}
            />
          </button>

          <AnimatePresence>
            {scopeOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl border border-surface-border/50 bg-surface-floating/30 p-4 space-y-3">
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Your subscription covers design, content, and layout changes to your
                    website. This includes new pages, copy updates, image swaps, style
                    changes, and anything visual. We also build and maintain functional
                    elements like contact forms, newsletter sign-ups, and basic
                    integrations as part of your plan.
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    <span className="font-medium text-text-primary">Highly technical builds</span> like
                    custom price calculators, booking systems, dashboards, or complex API
                    integrations go beyond the standard subscription. We absolutely build
                    these, but they are scoped and quoted as separate add-on packages so
                    you only pay for what you need.
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    <span className="font-medium text-text-primary">E-commerce sites?</span> We
                    build online stores too. Because e-commerce has different requirements and
                    scope, we will reach out personally after you sign up to discuss your
                    needs and put together the right package for you.
                  </p>
                  <p className="text-xs text-text-muted">
                    Not sure if something is included? Just ask. We will always be transparent
                    about scope before any work starts.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fine print */}
          <div className="flex items-start gap-2">
            <Info className="h-3.5 w-3.5 text-text-muted shrink-0 mt-0.5" />
            <p className="text-[11px] text-text-muted leading-relaxed">
              Unlimited requests means you can queue as many as you like. Requests are
              processed based on your plan (one or two at a time). Free mockup first,
              then month-to-month after commitment. Full details in our terms of service.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
