"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { PainPoints } from "@/components/landing/PainPoints";
import { IntakeSection } from "@/components/landing/IntakeSection";
import { WhatWeDo } from "@/components/landing/WhatWeDo";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { WhyUs } from "@/components/landing/WhyUs";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <ThemeProvider>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <PainPoints />
        <IntakeSection />
        <WhatWeDo />
        <HowItWorks />
        <WhyUs />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
