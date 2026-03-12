"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-40 border-b transition-[background-color,border-color,backdrop-filter,height] duration-300",
        scrolled
          ? "bg-surface-base/80 backdrop-blur-xl border-surface-border/50"
          : "bg-transparent border-transparent",
      )}
    >
      <div className={cn(
        "max-w-6xl mx-auto px-6 flex items-center justify-between transition-[height] duration-300",
        scrolled ? "h-14" : "h-20",
      )}>
        <a
          href="#"
          className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <Image
            src="/logos/full-logo.svg"
            alt="Weblio"
            width={140}
            height={38}
            className={cn(
              "w-auto transition-[height] duration-300",
              scrolled ? "h-6" : "h-8",
            )}
            priority
          />
        </a>

        <div className="hidden sm:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-xs text-text-secondary hover:text-text-primary transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            How it works
          </a>
          <a
            href="#pricing"
            className="text-xs text-text-secondary hover:text-text-primary transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              "text-text-secondary transition-colors duration-200",
              "hover:text-text-primary hover:bg-surface-elevated/50",
              "active:scale-[0.95]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
            )}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          <a
            href="#get-started"
            className="inline-flex items-center rounded-lg bg-brand/10 px-4 py-2 text-xs font-medium text-brand transition-transform duration-200 hover:bg-brand/20 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Get started
          </a>
        </div>
      </div>
    </nav>
  );
}
