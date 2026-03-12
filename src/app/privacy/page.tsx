"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <ThemeProvider>
      <main className="min-h-screen py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-brand transition-colors duration-200 mb-12 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>

          <h1 className="font-[family-name:var(--font-plus-jakarta)] text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-text-primary mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-text-muted mb-12">
            Last updated: March 12, 2026
          </p>

          <div className="space-y-10">
            <section>
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-semibold tracking-[-0.02em] text-text-primary mb-3">
                1. Introduction
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Weblio (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) respects your privacy and is committed to
                protecting your personal data. This policy explains how we collect, use,
                and safeguard your information when you visit our website or use our services.
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-semibold tracking-[-0.02em] text-text-primary mb-3">
                2. Information We Collect
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-3">
                We collect information you provide directly to us, including:
              </p>
              <ul className="space-y-2 text-sm text-text-secondary leading-relaxed list-disc list-inside">
                <li>Name, email address, and phone number when you fill out our intake form</li>
                <li>Business details and website preferences you share during onboarding</li>
                <li>Payment information processed securely through our payment provider</li>
                <li>Communications you send to us via email or our website</li>
              </ul>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-semibold tracking-[-0.02em] text-text-primary mb-3">
                3. How We Use Your Information
              </h2>
              <ul className="space-y-2 text-sm text-text-secondary leading-relaxed list-disc list-inside">
                <li>To design, build, and maintain your website</li>
                <li>To communicate with you about your project and subscription</li>
                <li>To process payments and manage your account</li>
                <li>To improve our services and develop new features</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-semibold tracking-[-0.02em] text-text-primary mb-3">
                4. Data Sharing
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                We do not sell your personal data. We may share your information with
                trusted third-party service providers who assist us in operating our
                business (such as hosting, payment processing, and email delivery). These
                providers are contractually obligated to protect your data and only use it
                for the purposes we specify.
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-semibold tracking-[-0.02em] text-text-primary mb-3">
                5. Data Retention
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                We retain your personal data for as long as your subscription is active and
                for a reasonable period afterward to fulfill legal obligations, resolve
                disputes, and enforce our agreements. If you cancel your subscription, we
                will retain your site files for reactivation purposes unless you request
                deletion.
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-semibold tracking-[-0.02em] text-text-primary mb-3">
                6. Your Rights
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-3">
                Depending on your location, you may have the right to:
              </p>
              <ul className="space-y-2 text-sm text-text-secondary leading-relaxed list-disc list-inside">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to or restrict processing of your data</li>
                <li>Request data portability</li>
              </ul>
              <p className="text-sm text-text-secondary leading-relaxed mt-3">
                To exercise any of these rights, please contact us at the email below.
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-semibold tracking-[-0.02em] text-text-primary mb-3">
                7. Cookies
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Our website may use essential cookies to ensure proper functionality. We do
                not use tracking or advertising cookies. Third-party services integrated
                into our site may set their own cookies according to their respective
                privacy policies.
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-semibold tracking-[-0.02em] text-text-primary mb-3">
                8. Security
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                We implement appropriate technical and organizational measures to protect
                your personal data against unauthorized access, alteration, disclosure, or
                destruction. However, no method of transmission over the internet is 100%
                secure.
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-semibold tracking-[-0.02em] text-text-primary mb-3">
                9. Changes to This Policy
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                We may update this Privacy Policy from time to time. Any changes will be
                posted on this page with an updated revision date. We encourage you to
                review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-semibold tracking-[-0.02em] text-text-primary mb-3">
                10. Contact Us
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                If you have any questions about this Privacy Policy or your personal data,
                please reach out to us at{" "}
                <a
                  href="mailto:hello@weblio.dev"
                  className="text-brand hover:underline focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded"
                >
                  hello@weblio.dev
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}
