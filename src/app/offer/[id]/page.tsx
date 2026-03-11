"use client";

import { useEffect, useState, use } from "react";

interface OfferData {
  id: string;
  full_name: string;
  company_name: string;
  preview_url: string | null;
  status: string;
}

export default function OfferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<OfferData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/offer/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d0d0d" }}>
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#F25623] border-t-transparent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d0d0d" }}>
        <div className="text-center">
          <p className="text-lg font-medium" style={{ color: "#DEDEDE" }}>Offer not found</p>
          <p className="text-sm mt-2" style={{ color: "#4D4D4D" }}>This link may have expired or is invalid.</p>
        </div>
      </div>
    );
  }

  const firstName = data.full_name.split(" ")[0];

  return (
    <div className="min-h-screen" style={{ background: "#0d0d0d", color: "#DEDEDE" }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, #F25623, transparent 70%)" }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-12 flex flex-col gap-12">
        {/* Header */}
        <header className="text-center flex flex-col gap-4">
          <div className="flex items-center justify-center gap-2">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: "#F25623" }}>
              <span className="text-white text-sm font-bold">W</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium tracking-wider uppercase" style={{ color: "#F25623", letterSpacing: "0.1em" }}>
              Your website preview is ready
            </p>
            <h1
              className="text-3xl sm:text-4xl font-bold mt-3 tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "#DEDEDE", letterSpacing: "-0.03em" }}
            >
              {firstName}, here&apos;s your new website
            </h1>
            <p className="text-base mt-3 max-w-lg mx-auto leading-relaxed" style={{ color: "#9a9a9a" }}>
              We&apos;ve built a custom preview for {data.company_name}. Take a look below — once you&apos;re happy, subscribe to launch it live.
            </p>
          </div>
        </header>

        {/* Preview */}
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "#2a2a2a", boxShadow: "0 2px 8px rgba(242, 86, 35, 0.08), 0 8px 24px rgba(0, 0, 0, 0.4)" }}>
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "#2a2a2a", background: "#171717" }}>
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full" style={{ background: "#ff5f57" }} />
              <div className="h-3 w-3 rounded-full" style={{ background: "#febc2e" }} />
              <div className="h-3 w-3 rounded-full" style={{ background: "#28c840" }} />
            </div>
            <div className="flex-1 flex items-center gap-2 rounded-lg px-3 py-1.5 mx-8" style={{ background: "#0d0d0d" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4D4D4D" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <span className="text-xs" style={{ color: "#4D4D4D" }}>
                {data.preview_url || `preview.yoursite.com/${data.company_name.toLowerCase().replace(/\s+/g, "-")}`}
              </span>
            </div>
          </div>

          {/* iframe or placeholder */}
          {data.preview_url ? (
            <iframe
              src={data.preview_url}
              title={`Preview for ${data.company_name}`}
              className="w-full bg-white"
              style={{ height: "540px" }}
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="w-full flex items-center justify-center" style={{ height: "540px", background: "#171717" }}>
              <div className="text-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4D4D4D" strokeWidth="1" className="mx-auto">
                  <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" strokeLinecap="round" />
                </svg>
                <p className="text-sm mt-4" style={{ color: "#4D4D4D" }}>Preview loading...</p>
              </div>
            </div>
          )}
        </div>

        {/* Offer section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* What you get */}
          <div className="rounded-2xl border p-6 flex flex-col gap-4" style={{ borderColor: "#2a2a2a", background: "#171717" }}>
            <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
              What&apos;s included
            </h2>
            <ul className="flex flex-col gap-3">
              {[
                "Custom-designed website tailored to your brand",
                "Fully responsive — looks great on any device",
                "Hosted and maintained — we handle everything",
                "Unlimited revisions (one at a time)",
                "Priority support via email",
                "Your own custom domain",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: "#9a9a9a" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" stroke="#F25623" strokeWidth="1.5" />
                    <path d="M8 12l3 3 5-5" stroke="#F25623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing card */}
          <div className="rounded-2xl border p-6 flex flex-col gap-5" style={{ borderColor: "rgba(242, 86, 35, 0.3)", background: "#171717", boxShadow: "0 0 30px rgba(242, 86, 35, 0.06)" }}>
            <div>
              <p className="text-xs font-medium tracking-wider uppercase" style={{ color: "#F25623" }}>Monthly subscription</p>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#DEDEDE" }}>$299</span>
                <span className="text-sm" style={{ color: "#4D4D4D" }}>/month</span>
              </div>
              <p className="text-xs mt-2" style={{ color: "#9a9a9a" }}>Cancel anytime. No long-term contracts.</p>
            </div>

            <div className="border-t pt-4 flex flex-col gap-2" style={{ borderColor: "#2a2a2a" }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: "#9a9a9a" }}>Website design & build</span>
                <span style={{ color: "#DEDEDE" }}>Included</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "#9a9a9a" }}>Hosting & SSL</span>
                <span style={{ color: "#DEDEDE" }}>Included</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "#9a9a9a" }}>Custom domain setup</span>
                <span style={{ color: "#DEDEDE" }}>Included</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "#9a9a9a" }}>Unlimited revisions</span>
                <span style={{ color: "#DEDEDE" }}>Included</span>
              </div>
            </div>

            <button
              className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "#F25623", boxShadow: "0 0 20px rgba(242, 86, 35, 0.3)" }}
              onClick={() => {
                // Stripe checkout will go here
                alert("Stripe checkout coming soon — this will redirect to a payment page.");
              }}
            >
              Subscribe & Launch My Website
            </button>

            <p className="text-[11px] text-center" style={{ color: "#4D4D4D" }}>
              Secure payment via Stripe. You&apos;ll be redirected to complete payment.
            </p>
          </div>
        </div>

        {/* FAQ / Reassurance */}
        <div className="rounded-2xl border p-6 flex flex-col gap-4" style={{ borderColor: "#2a2a2a", background: "#171717" }}>
          <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "#9a9a9a" }}>Common questions</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { q: "What if I want changes?", a: "You get unlimited revisions — submit one at a time and we'll turn them around quickly." },
              { q: "Can I cancel anytime?", a: "Yes. No contracts, no lock-in. Cancel your subscription whenever you want." },
              { q: "Do I own my website?", a: "You own all your content. The design and hosting are part of the subscription service." },
              { q: "How fast are revisions?", a: "Most revisions are completed within 24-48 hours depending on complexity." },
            ].map((faq) => (
              <div key={faq.q} className="flex flex-col gap-1">
                <p className="text-sm font-medium" style={{ color: "#DEDEDE" }}>{faq.q}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#9a9a9a" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pb-8">
          <p className="text-xs" style={{ color: "#4D4D4D" }}>
            Questions? Reply to the email we sent you, or reach out anytime.
          </p>
        </footer>
      </div>
    </div>
  );
}
