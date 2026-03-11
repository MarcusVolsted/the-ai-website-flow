"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ShowcaseItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

const showcaseItems: ShowcaseItem[] = [
  { id: 1, title: "Warberg", category: "Cosmetic Clinic", image: "/websites/warberg.png" },
  { id: 2, title: "VillaVie", category: "Cruise Lifestyle", image: "/websites/villavie.png" },
  { id: 3, title: "Nordic Refrigeration", category: "B2B / HVAC", image: "/websites/nordic.png" },
  { id: 4, title: "Cult Fitness", category: "Fitness Studio", image: "/websites/cult.png" },
  { id: 5, title: "GMKA", category: "Healthcare", image: "/websites/gmka.png" },
  { id: 6, title: "Formuepleje", category: "Real Estate", image: "/websites/formuepleje.png" },
  { id: 7, title: "Fabled Voyages", category: "Residential Cruise", image: "/websites/fabled.png" },
  { id: 8, title: "Mc Marketing", category: "Marketing Agency", image: "/websites/mcmarketing.png" },
  { id: 9, title: "Nonsense", category: "Streetwear", image: "/websites/nonsense.png" },
];

function WebsiteFrame({ item }: { item: ShowcaseItem }) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-white/[0.06] bg-[#111] shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-[#1a1a1a] border-b border-white/[0.06]">
        <div className="flex gap-1.5">
          <div className="h-2 w-2 rounded-full bg-[#ff5f56]" />
          <div className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
          <div className="h-2 w-2 rounded-full bg-[#27c93f]" />
        </div>
        <div className="ml-3 flex-1 h-5 rounded-md bg-[#0d0d0d] flex items-center px-2">
          <span className="text-[8px] text-[#555] truncate">
            {item.title.toLowerCase().replace(/\s+/g, "")}.com
          </span>
        </div>
      </div>

      {/* Screenshot */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={`${item.title} website`}
          className="w-full h-full object-cover object-top"
          draggable={false}
        />
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

export function ShowcaseSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const navigate = useCallback(
    (dir: number) => {
      setDirection(dir);
      setActiveIndex((prev) => {
        const next = prev + dir;
        if (next < 0) return showcaseItems.length - 1;
        if (next >= showcaseItems.length) return 0;
        return next;
      });
    },
    [],
  );

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => navigate(1), 4000);
    return () => clearInterval(timer);
  }, [navigate]);

  const getItemStyle = (index: number) => {
    const total = showcaseItems.length;
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const isActive = diff === 0;
    const absOffset = Math.abs(diff);

    if (absOffset > 2) return { display: "none" as const };

    return {
      zIndex: 10 - absOffset,
      x: `${diff * 30}%`,
      scale: isActive ? 1 : 0.8 - absOffset * 0.04,
      rotateY: diff * -10,
      opacity: 1,
      brightness: isActive ? 1 : 0.4 - (absOffset - 1) * 0.15,
    };
  };

  return (
    <div className="relative w-full">
      {/* 3D Carousel */}
      <div
        className="relative mx-auto w-full max-w-5xl"
        style={{ perspective: "1200px" }}
      >
        <div className="relative aspect-[16/9] w-full">
          {showcaseItems.map((item, index) => {
            const style = getItemStyle(index);
            if (style.display === "none") return null;

            return (
              <motion.div
                key={item.id}
                className="absolute inset-0 cursor-pointer"
                animate={{
                  x: style.x,
                  scale: style.scale,
                  rotateY: style.rotateY,
                  opacity: style.opacity,
                  filter: `brightness(${style.brightness})`,
                  zIndex: style.zIndex,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.32, 0.72, 0, 1] as const,
                }}
                style={{ transformStyle: "preserve-3d" }}
                onClick={() => {
                  const diff = index - activeIndex;
                  if (diff !== 0) {
                    setDirection(diff > 0 ? 1 : -1);
                    setActiveIndex(index);
                  }
                }}
              >
                <WebsiteFrame item={item} />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Labels */}
      <div className="mt-8 flex items-center justify-center gap-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-border bg-surface-elevated/50 text-text-secondary transition-transform duration-200 hover:text-text-primary hover:border-brand/30 active:scale-[0.95] focus-visible:outline-2 focus-visible:outline-brand"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="text-center min-w-[160px]"
          >
            <p className="font-[family-name:var(--font-plus-jakarta)] text-sm font-semibold text-text-primary">
              {showcaseItems[activeIndex].title}
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              {showcaseItems[activeIndex].category}
            </p>
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => navigate(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-surface-border bg-surface-elevated/50 text-text-secondary transition-transform duration-200 hover:text-text-primary hover:border-brand/30 active:scale-[0.95] focus-visible:outline-2 focus-visible:outline-brand"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Dots */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {showcaseItems.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setDirection(i > activeIndex ? 1 : -1);
              setActiveIndex(i);
            }}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              "focus-visible:outline-2 focus-visible:outline-brand",
              i === activeIndex
                ? "w-6 bg-brand"
                : "w-1.5 bg-surface-border hover:bg-text-muted",
            )}
          />
        ))}
      </div>
    </div>
  );
}
