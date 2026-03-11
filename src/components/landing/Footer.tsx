const footerLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Get started", href: "#get-started" },
];

export function Footer() {
  return (
    <footer className="border-t border-surface-border/50 py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-[family-name:var(--font-plus-jakarta)] text-xs font-bold tracking-[-0.02em] text-text-muted">
            Studio
          </span>
          <nav className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs text-text-muted hover:text-brand transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="text-center sm:text-left">
          <p className="text-[11px] text-text-muted">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
