"use client";

import { motion } from "framer-motion";
import { Monitor, Paintbrush, TrendingUp, Layers } from "lucide-react";

const cards = [
  {
    icon: Paintbrush,
    title: "Designed from scratch",
    description:
      "No templates. Every site is custom-built to match your brand, your audience, and your goals. You get a site that feels like yours.",
  },
  {
    icon: Monitor,
    title: "Built for performance",
    description:
      "Lightning-fast load times, fully responsive, and SEO-optimized out of the box. Your site works as hard as you do.",
  },
  {
    icon: TrendingUp,
    title: "Optimized to convert",
    description:
      "Strategic layouts, compelling copy placement, and clear calls to action. We build sites that turn visitors into paying customers.",
  },
  {
    icon: Layers,
    title: "Endlessly flexible",
    description:
      "New season, new offer, new direction? Queue up a revision and we will have it live in 1-3 days. Your site never falls behind your business.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export function WhatWeDo() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-brand font-medium">
            What we do
          </span>
          <h2 className="font-[family-name:var(--font-plus-jakarta)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] mt-4 mb-5">
            Your website, always current.
            <br />
            <span className="text-text-secondary">Always converting.</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            We handle design, development, and ongoing updates so your site never goes stale.
            Instead of one delivery and a goodbye, you get a team that keeps your online
            presence sharp, relevant, and performing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="group relative rounded-2xl border border-surface-border bg-surface-elevated/50 p-8 backdrop-blur-sm transition-transform duration-200 hover:scale-[1.02] hover:border-brand/20 hover:shadow-[0_0_40px_rgba(242,86,35,0.06)] focus-within:outline-2 focus-within:outline-brand"
            >
              <div className="mb-5 inline-flex items-center justify-center rounded-xl bg-brand/10 p-3">
                <card.icon className="h-5 w-5 text-brand" />
              </div>
              <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-semibold tracking-[-0.02em] mb-3">
                {card.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
