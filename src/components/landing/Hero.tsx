"use client";

import { motion } from "framer-motion";
import { GradientOrb } from "@/components/ui/GradientOrb";
import { WordRotate } from "@/components/ui/WordRotate";
import { ShowcaseSlider } from "@/components/landing/ShowcaseSlider";
import { ArrowRight } from "lucide-react";

const ROTATE_WORDS = ["brand", "team", "company", "customers"];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export function Hero() {
  return (
    <section className="relative flex flex-col items-center overflow-hidden pt-28 sm:pt-32 pb-20">
      <GradientOrb
        className="-top-40 left-1/2 -translate-x-1/2"
        color="rgba(242, 86, 35, 0.06)"
        size="900px"
      />
      <GradientOrb
        className="top-1/3 -right-40"
        color="rgba(242, 86, 35, 0.03)"
        size="600px"
      />

      {/* Text content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface-elevated/60 px-4 py-1.5 text-xs font-medium tracking-wide text-text-secondary backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            1-3 day delivery guarantee
          </span>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-[family-name:var(--font-plus-jakarta)] text-4xl sm:text-5xl md:text-7xl font-bold tracking-[-0.03em] leading-[1.1] mb-6"
        >
          Your{" "}
          <WordRotate
            words={ROTATE_WORDS}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-[-0.03em] align-bottom"
          />{" "}
          deserves
          <br />
          <span className="text-text-secondary">
            a stunning website.
          </span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-[family-name:var(--font-inter)] text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          We create a free custom design for your website. Love it? We build and
          launch it. No setup fees, just one flat monthly subscription with 1-3 day
          turnaround on any change.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-16 sm:mb-20"
        >
          <a
            href="#get-started"
            className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-8 py-4 text-sm font-semibold text-white transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:shadow-[0_0_30px_rgba(242,86,35,0.4)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Get a free website design
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        </motion.div>
      </div>

      {/* Showcase slider */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full px-6"
      >
        <ShowcaseSlider />
      </motion.div>
    </section>
  );
}
