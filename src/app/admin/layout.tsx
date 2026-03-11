"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Revisions",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/admin/pipeline",
    label: "Pipeline",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 4H2l8 9.46V20l4 2v-8.54z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/admin/clients",
    label: "Clients",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Login page gets no shell
  if (pathname === "/admin/login") {
    return <div className="admin-light">{children}</div>;
  }

  // Check if we're on a detail page (/admin/[id])
  const isDetailPage = pathname.startsWith("/admin/") &&
    pathname !== "/admin" &&
    pathname !== "/admin/pipeline" &&
    pathname !== "/admin/clients" &&
    pathname !== "/admin/login";

  return (
    <div className="admin-light flex h-screen overflow-hidden" style={{ background: "var(--surface-base)" }}>
      {/* Sidebar */}
      <aside className="flex w-56 flex-col border-r shrink-0" style={{ borderColor: "var(--surface-border)", background: "var(--surface-elevated)" }}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: "var(--surface-border)" }}>
          <div className="h-7 w-7 rounded-lg bg-brand flex items-center justify-center">
            <span className="text-white text-xs font-bold">W</span>
          </div>
          <span
            className="text-sm font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            WaaS Admin
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 px-3 py-3 flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/admin/pipeline"
              ? pathname === "/admin/pipeline" || isDetailPage
              : item.href === "/admin/clients"
              ? pathname === "/admin/clients"
              : pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150",
                  isActive
                    ? "bg-brand/10 text-brand font-medium"
                    : "hover:bg-black/5",
                )}
                style={!isActive ? { color: "var(--text-secondary)" } : undefined}
              >
                {item.icon}
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t px-3 py-3" style={{ borderColor: "var(--surface-border)" }}>
          <a
            href="/api/admin/auth/logout"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-black/5"
            style={{ color: "var(--text-secondary)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Sign out
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto" style={{ background: "var(--surface-base)" }}>
        {children}
      </main>
    </div>
  );
}
