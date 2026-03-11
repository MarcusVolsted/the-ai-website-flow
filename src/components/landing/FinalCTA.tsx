"use client";

import { motion } from "framer-motion";
import { GradientOrb } from "@/components/ui/GradientOrb";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <GradientOrb
        className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        color="rgba(242, 86, 35, 0.05)"
        size="800px"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl mx-auto text-center"
      >
        <h2 className="font-[family-name:var(--font-plus-jakarta)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-5">
          Ready to launch
          <br />
          <span className="text-text-secondary">your next website?</span>
        </h2>
        <p className="text-text-secondary max-w-lg mx-auto mb-10">
          It takes 5 minutes to get started. Tell us about your brand and
          we will handle the rest.
        </p>
        <a
          href="#get-started"
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-8 py-4 text-sm font-semibold text-white transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:shadow-[0_0_30px_rgba(242,86,35,0.4)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Start your project
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </a>
      </motion.div>
    </section>
  );
}
