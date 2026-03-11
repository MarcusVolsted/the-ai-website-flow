"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useIntakeState, type Step } from "./IntakeContext";
import { ContactInfoStep } from "./steps/ContactInfoStep";
import { ProjectScopeStep } from "./steps/ProjectScopeStep";
import { BrandStyleStep } from "./steps/BrandStyleStep";
import { ContentDetailsStep } from "./steps/ContentDetailsStep";
import { SuccessStep } from "./steps/SuccessStep";

const STEP_COMPONENTS: Record<Step, React.ComponentType> = {
  "contact-info": ContactInfoStep,
  "project-scope": ProjectScopeStep,
  "brand-style": BrandStyleStep,
  "content-details": ContentDetailsStep,
  success: SuccessStep,
};

const stepVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? 24 : -24,
    scale: 0.97,
  }),
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? -16 : 16,
    scale: 0.97,
    transition: { duration: 0.15 },
  }),
};

export function StepRenderer() {
  const { currentStep, direction } = useIntakeState();
  const StepComponent = STEP_COMPONENTS[currentStep];

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={currentStep}
        custom={direction}
        variants={stepVariants}
        initial="enter"
        animate="center"
        exit="exit"
      >
        <StepComponent />
      </motion.div>
    </AnimatePresence>
  );
}
