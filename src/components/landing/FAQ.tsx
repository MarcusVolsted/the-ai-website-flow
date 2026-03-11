"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How long do I have to stay subscribed?",
    answer:
      "The subscription starts with a 6-month commitment. This gives us enough time to design, build, and refine your website properly. After those 6 months, you continue month-to-month and can cancel whenever you like.",
  },
  {
    question: "What happens to my website if I cancel?",
    answer:
      "After your commitment period, you can cancel at any time. Your website stays live until the end of your billing period, and we will provide you with all your site files so you can host it elsewhere or hand it off to another developer. If we are managing your domain, we will help you transfer it to a provider of your choice or we can continue hosting just the domain for you at \u20AC15/mo. You own your content.",
  },
  {
    question: "What counts as a revision?",
    answer:
      "A revision is any design or content change to your website: new pages, copy updates, image swaps, layout changes, adding sections, or style adjustments. Functional elements like contact forms and newsletter sign-ups are also included. One request is processed at a time in your queue.",
  },
  {
    question: "What is NOT included in the subscription?",
    answer:
      "Highly technical builds like custom calculators, booking systems, dashboards, or complex API integrations fall outside the standard subscription. We do build these, but they are scoped and quoted as separate add-on projects. If you are unsure whether something is included, just ask.",
  },
  {
    question: "Do you build e-commerce sites?",
    answer:
      "Yes. Because e-commerce projects have different requirements and scope, we will reach out personally after you sign up to discuss your needs and put together the right package for you.",
  },
  {
    question: "How fast do I get my website?",
    answer:
      "You will receive a free design mockup within 1-3 days after we have all the information we need. There is no cost or commitment at this stage. Once you approve the design, we build and launch it, and your subscription starts. After that, every revision request follows the same 1-3 business day turnaround.",
  },
  {
    question: "Who owns the website?",
    answer:
      "You own all your content, copy, and media. The website code and design are maintained by us as part of your subscription. If you cancel, you receive all source files to use however you like.",
  },
  {
    question: "What about my domain?",
    answer:
      "If you already own a domain, we will connect it to your new site. If we set up and manage your domain for you, it is still yours. Should you ever cancel, we will help you move it to any third-party provider at no extra charge. You can also choose to keep just the domain hosted with us for \u20AC15/mo.",
  },
  {
    question: "Can I pause my subscription instead of cancelling?",
    answer:
      "Not during the initial 6-month period. After that, you can cancel and re-subscribe whenever you are ready. Your site files will be kept on hand for easy reactivation.",
  },
];

function FAQItem({ question, answer, isOpen, onToggle }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-surface-border/50 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between gap-4 py-5 text-left group",
          "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-lg",
        )}
      >
        <span className="font-[family-name:var(--font-plus-jakarta)] text-sm font-semibold tracking-[-0.01em] text-text-primary group-hover:text-brand transition-colors duration-200">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-text-muted shrink-0 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-text-secondary leading-relaxed pb-5">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [expanded, setExpanded] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Collapsed: single button */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "w-full flex items-center justify-center gap-3 py-4 rounded-2xl border transition-colors duration-200",
            "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
            expanded
              ? "border-brand/20 bg-brand/[0.04] text-text-primary"
              : "border-surface-border/50 bg-surface-elevated/30 text-text-secondary hover:border-surface-border hover:text-text-primary",
          )}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 text-text-muted transition-transform duration-200",
              expanded && "-rotate-90",
            )}
          />
          <span className="text-sm font-medium">
            {expanded ? "Hide FAQ" : "Frequently asked questions"}
          </span>
          <ChevronRight
            className={cn(
              "h-4 w-4 text-text-muted transition-transform duration-200",
              expanded && "rotate-90",
            )}
          />
        </button>

        {/* Expanded: FAQ list */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className="overflow-hidden"
            >
              <div className="mt-6 rounded-2xl border border-surface-border/50 bg-surface-elevated/30 px-6">
                {faqs.map((faq, i) => (
                  <FAQItem
                    key={faq.question}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openIndex === i}
                    onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
