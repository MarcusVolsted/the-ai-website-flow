"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface WordRotateProps {
  words: string[];
  interval?: number;
  className?: string;
}

export function WordRotate({ words, interval = 3500, className }: WordRotateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <span className={cn("relative inline-flex overflow-hidden", className)}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={words[index]}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{
            y: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
            opacity: { duration: 0.5 },
          }}
          className="inline-block text-brand"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
