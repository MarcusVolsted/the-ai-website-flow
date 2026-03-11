"use client";

import { motion } from "framer-motion";

// Logo pairs: dark mode uses "light" SVGs (white logos), light mode uses "black" SVGs (dark logos)
// Skipping 6 as there is no light variant
const logoIds = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

function Logo({ id }: { id: number }) {
  return (
    <div className="shrink-0 flex items-center justify-center px-6 sm:px-8 py-3 select-none pointer-events-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/logos/light${id}.svg`}
        alt=""
        className="h-8 sm:h-10 w-auto"
        style={{ display: "var(--logo-dark-display, block)" }}
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/logos/black${id}.svg`}
        alt=""
        className="h-8 sm:h-10 w-auto"
        style={{ display: "var(--logo-light-display, none)" }}
        draggable={false}
      />
    </div>
  );
}

export function TrustBar() {
  const allLogos = [...logoIds, ...logoIds];

  return (
    <section className="py-16 px-6 overflow-hidden">
      <style>{`
        :root {
          --logo-dark-display: block;
          --logo-light-display: none;
        }
        html.light {
          --logo-dark-display: none;
          --logo-light-display: block;
        }
      `}</style>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="text-center text-xs uppercase tracking-[0.2em] text-text-muted mb-10"
      >
        More than 200+ happy customers
      </motion.p>

      <div className="relative w-full overflow-hidden">
        {/* Scrolling track */}
        <div
          className="flex items-center gap-12 sm:gap-16 w-max"
          style={{ animation: "scroll 48s linear infinite" }}
        >
          {allLogos.map((id, i) => (
            <Logo key={`${id}-${i}`} id={id} />
          ))}
        </div>
      </div>
    </section>
  );
}
