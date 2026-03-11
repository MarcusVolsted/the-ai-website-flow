"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MessageSquare, Layers, Rocket, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Tell us your vision",
    description:
      "Fill out our quick intake form. Share your brand, your goals, and the vibe you are going for. Takes about 5 minutes.",
  },
  {
    number: "02",
    icon: CalendarCheck,
    title: "Optional strategy call",
    description:
      "Want to talk it through? Book a free call with our team. Not required, but always available if you want a more personal touch.",
    optional: true,
  },
  {
    number: "03",
    icon: Layers,
    title: "We design and build",
    description:
      "We create a free design mockup tailored to your brand. No commitment until you love it. Once approved, we build it out and your subscription begins.",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Launch and iterate",
    description:
      "Your site goes live. Need changes? Queue up a revision anytime. Your website evolves with your business.",
  },
];

export function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isInView]);

  return (
    <section ref={sectionRef} id="how-it-works" className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-brand font-medium">
            How it works
          </span>
          <h2 className="font-[family-name:var(--font-plus-jakarta)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mt-4 mb-5">
            Four simple steps.
            <br />
            <span className="text-text-secondary">That is it.</span>
          </h2>
        </motion.div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {/* Connecting line (desktop only) */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-[1px] bg-gradient-to-r from-transparent via-surface-border to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: i * 0.15,
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94] as const,
              }}
              className={cn(
                "relative text-center rounded-2xl p-6 transition-all duration-500",
                activeIndex === i
                  ? "border border-brand/20 bg-brand/[0.04] scale-[1.03]"
                  : "border border-transparent bg-transparent scale-100",
              )}
            >
              <div
                className={cn(
                  "relative z-10 mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border transition-colors duration-500",
                  activeIndex === i
                    ? "border-brand/30 bg-brand/10"
                    : "border-surface-border bg-surface-elevated",
                )}
              >
                <step.icon
                  className={cn(
                    "h-5 w-5 transition-colors duration-500",
                    activeIndex === i ? "text-brand" : "text-brand/60",
                  )}
                />
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-xs font-mono text-text-muted tracking-wider">
                  {step.number}
                </span>
                {step.optional && (
                  <span className="text-[10px] uppercase tracking-wider text-brand/70 font-medium">
                    Optional
                  </span>
                )}
              </div>
              <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-semibold tracking-[-0.02em] mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
