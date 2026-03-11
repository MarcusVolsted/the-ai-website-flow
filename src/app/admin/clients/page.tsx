"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Submission {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string;
  site_type: string | null;
  status: string;
  client_type: string | null;
  deal_type: string | null;
  deal_amount: number | null;
  deal_recurring: boolean;
}

const STATUS_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  approved: { label: "Approved", bg: "bg-emerald-100", text: "text-emerald-700" },
  in_progress: { label: "Project Started", bg: "bg-orange-100", text: "text-orange-700" },
  feedback: { label: "Feedback", bg: "bg-blue-100", text: "text-blue-700" },
  revision: { label: "Revision", bg: "bg-violet-100", text: "text-violet-700" },
  done: { label: "Delivered", bg: "bg-emerald-100", text: "text-emerald-700" },
  delivered: { label: "Delivered", bg: "bg-emerald-100", text: "text-emerald-700" },
};

const DEAL_LABELS: Record<string, string> = {
  one_time: "One-time",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

function daysSince(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "1 day";
  if (days < 30) return `${days} days`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month" : `${months} months`;
}

type Filter = "all" | "active" | "inactive" | "in_progress" | "feedback" | "revision" | "delivered";

export default function ClientsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    const res = await fetch("/api/admin/submissions");
    if (res.ok) {
      const data: Submission[] = await res.json();
      setSubmissions(data);
    } else {
      setSubmissions([]);
    }
    setLoading(false);
  }

  // Clients = anything past "submitted" and not "rejected" (includes legacy statuses)
  const clients = submissions.filter((s) =>
    ["approved", "in_progress", "feedback", "revision", "done", "delivered"].includes(s.status)
  );

  const filtered = clients.filter((s) => {
    // Filter by status or client_type
    if (filter === "active" && s.client_type !== "active") return false;
    if (filter === "inactive" && s.client_type !== "inactive") return false;
    if (["in_progress", "feedback", "revision", "delivered"].includes(filter) && s.status !== filter) return false;

    if (!search) return true;
    const q = search.toLowerCase();
    return s.full_name.toLowerCase().includes(q) || s.company_name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
  });

  const activeCount = clients.filter((s) => s.client_type === "active").length;
  const inactiveCount = clients.filter((s) => s.client_type === "inactive").length;
  const totalRevenue = clients
    .filter((s) => s.deal_amount)
    .reduce((sum, s) => sum + (s.deal_amount || 0), 0);
  const recurringRevenue = clients
    .filter((s) => s.deal_recurring && s.deal_amount)
    .reduce((sum, s) => sum + (s.deal_amount || 0), 0);

  const FILTERS: { key: Filter; label: string; count?: number }[] = [
    { key: "all", label: "All", count: clients.length },
    { key: "active", label: "Active", count: activeCount },
    { key: "inactive", label: "Inactive", count: inactiveCount },
    { key: "in_progress", label: "In Progress", count: clients.filter((s) => s.status === "in_progress").length },
    { key: "feedback", label: "Feedback", count: clients.filter((s) => s.status === "feedback").length },
    { key: "revision", label: "Revision", count: clients.filter((s) => s.status === "revision").length },
    { key: "delivered", label: "Delivered", count: clients.filter((s) => s.status === "delivered").length },
  ];

  return (
    <div className="flex flex-col gap-5 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Clients
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {clients.length} total · {activeCount} active
            {totalRevenue > 0 && <span className="ml-2">${totalRevenue.toLocaleString()} total</span>}
            {recurringRevenue > 0 && <span className="ml-1 text-emerald-600">(${recurringRevenue.toLocaleString()}/mo recurring)</span>}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients..."
          className="rounded-lg border px-4 py-2 text-sm max-w-xs focus:border-brand focus:outline-none"
          style={{ borderColor: "var(--surface-border)", background: "var(--surface-elevated)", color: "var(--text-primary)" }}
        />
        <div className="flex items-center gap-1 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                filter === f.key ? "bg-brand text-white" : "hover:bg-black/5",
              )}
              style={filter !== f.key ? { color: "var(--text-secondary)" } : undefined}
            >
              {f.label} {f.count != null ? `(${f.count})` : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--surface-border)" }}>
          <table className="w-full text-left text-sm">
            <thead>
              <tr style={{ background: "var(--surface-floating)", borderColor: "var(--surface-border)" }} className="border-b">
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Client</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Status</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Type</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Deal</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Since</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Contact</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => {
                const st = STATUS_LABELS[sub.status];
                return (
                  <tr key={sub.id} className="border-b last:border-0 hover:bg-black/[0.02] transition-colors" style={{ borderColor: "var(--surface-border)", background: "var(--surface-elevated)" }}>
                    <td className="px-4 py-2.5">
                      <div>
                        <a href={`/admin/${sub.id}`} className="text-sm font-medium hover:text-brand block" style={{ color: "var(--text-primary)" }}>{sub.full_name}</a>
                        <span className="text-[11px] block" style={{ color: "var(--text-muted)" }}>{sub.company_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      {st && (
                        <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium", st.bg, st.text)}>
                          {st.label}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {sub.client_type ? (
                        <span className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium capitalize",
                          sub.client_type === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600",
                        )}>
                          {sub.client_type}
                        </span>
                      ) : (
                        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                      {sub.deal_amount ? (
                        <span>
                          ${sub.deal_amount.toLocaleString()}
                          {sub.deal_type && <span className="text-[var(--text-muted)]"> · {DEAL_LABELS[sub.deal_type] || sub.deal_type}</span>}
                          {sub.deal_recurring && <span className="text-emerald-600 ml-1">↻</span>}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)" }}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: "var(--text-muted)" }}>
                      {daysSince(sub.created_at)}
                    </td>
                    <td className="px-4 py-2.5 text-[11px]" style={{ color: "var(--text-muted)" }}>
                      <div className="flex flex-col">
                        <span>{sub.email}</span>
                        {sub.phone && <span>{sub.phone}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <a href={`/admin/${sub.id}`} className="text-xs text-brand hover:underline">Open</a>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-sm" style={{ color: "var(--text-muted)" }}>No clients found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
