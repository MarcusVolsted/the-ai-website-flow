"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Info, Coffee, ChevronDown, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const included = [
  "Custom design and development",
  "Fully responsive across all devices",
  "SEO optimization built in",
  "Unlimited revision requests",
  "1-3 day turnaround guarantee",
  "Hosting and maintenance included",
  "Performance monitoring",
  "Priority support",
];

export function Pricing() {
  const [scopeOpen, setScopeOpen] = useState(false);

  return (
    <section id="pricing" className="relative py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-brand font-medium">
            Early access pricing
          </span>
          <h2 className="font-[family-name:var(--font-plus-jakarta)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mt-4 mb-5">
            Your own web team.
            <br />
            <span className="text-text-secondary">A fraction of the cost.</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Imagine having a full-time designer and SEO specialist dedicated to your
            website, your blog, and your online presence. That is exactly what you
            get, for about a coffee a day.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative rounded-3xl border border-surface-border bg-surface-elevated/60 p-8 sm:p-12 backdrop-blur-sm"
        >
          {/* Glow effect */}
          <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-brand/20 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100 pointer-events-none" />

          <div className="relative">
            {/* Price lead */}
            <div className="text-center mb-6">
              {/* Urgency badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 border border-brand/20 px-4 py-1.5 mb-5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
                <span className="text-xs font-semibold text-brand tracking-wide">
                  Only a few spots left at this price
                </span>
              </div>
              <div className="flex items-baseline gap-2 justify-center mb-3">
                <span className="font-[family-name:var(--font-plus-jakarta)] text-2xl sm:text-3xl font-bold text-text-muted line-through decoration-brand/60 decoration-2">
                  &euro;300
                </span>
                <span className="font-[family-name:var(--font-plus-jakarta)] text-5xl sm:text-6xl font-bold text-text-primary">
                  &euro;140
                </span>
                <span className="text-text-secondary text-base font-medium">/mo</span>
              </div>
              <p className="text-sm text-text-secondary max-w-md mx-auto mt-4 mb-2">
                Lock in this price forever, as long as you stay subscribed. Free design mockup first, 6-month commitment, then month-to-month.
              </p>
            </div>

            {/* Coffee comparison */}
            <div className="mb-8 rounded-xl border border-surface-border/50 bg-surface-floating/50 px-5 py-4 flex items-center gap-3">
              <Coffee className="h-4 w-4 text-brand shrink-0" />
              <p className="text-sm text-text-secondary">
                That is about <span className="font-medium text-text-primary">&euro;4.60/day</span>, roughly one coffee.
              </p>
            </div>

            <div className="border-t border-surface-border/50 pt-8 mb-10" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {included.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-brand shrink-0" />
                  <span className="text-sm text-text-secondary">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#get-started"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-brand px-8 py-4 text-sm font-semibold text-white transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:shadow-[0_0_30px_rgba(242,86,35,0.4)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Get started today
              </a>
              <span className="text-xs text-text-muted">
                No credit card required to start
              </span>
            </div>

            {/* Scope info + fine print */}
            <div className="mt-10 pt-6 border-t border-surface-border/50 space-y-4">
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
                  Unlimited revisions covers design and content changes to your
                  existing website. One revision request is processed at a time
                  in your queue. Major structural changes or complete redesigns
                  may be scoped separately. Full details in our terms of service.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
