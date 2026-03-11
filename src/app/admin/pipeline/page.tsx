"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Submission {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  company_name: string;
  site_type: string | null;
  status: string;
  project_summary: string | null;
}

const STAGES = [
  { key: "submitted", label: "Incoming", color: "border-amber-400/30 bg-amber-50", dotColor: "bg-amber-400" },
  { key: "in_progress", label: "Project Started", color: "border-brand/30 bg-orange-50", dotColor: "bg-brand" },
  { key: "feedback", label: "Feedback", color: "border-blue-400/30 bg-blue-50", dotColor: "bg-blue-400" },
  { key: "revision", label: "Revision", color: "border-violet-400/30 bg-violet-50", dotColor: "bg-violet-400" },
  { key: "delivered", label: "Delivered", color: "border-emerald-600/30 bg-emerald-50", dotColor: "bg-emerald-600" },
] as const;

function hoursAgo(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60);
}

function timeAgo(iso: string): string {
  const h = hoursAgo(iso);
  if (h < 1) return "just now";
  if (h < 24) return `${Math.floor(h)}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "1 day ago" : `${d} days ago`;
}

function urgency(iso: string, status?: string): "green" | "yellow" | "red" {
  if (status === "done" || status === "rejected") return "green";
  const h = hoursAgo(iso);
  if (h < 24) return "green";
  if (h < 72) return "yellow";
  return "red";
}

const URGENCY_DOT: Record<string, string> = {
  green: "bg-green-500",
  yellow: "bg-amber-500 animate-pulse",
  red: "bg-red-500 animate-pulse",
};

type View = "funnel" | "table" | "board";

export default function PipelinePage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<View>("board");
  const [search, setSearch] = useState("");

  useEffect(() => { fetchSubmissions(); }, []);

  async function fetchSubmissions() {
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

  async function handleAction(id: string, newStatus: string) {
    const sub = submissions.find((s) => s.id === id);
    if (!sub) return;
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
    setSaving(true);
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) {
      setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: sub.status } : s)));
    }
    setSaving(false);
  }

  // For funnel/table: leads only
  const leads = submissions.filter((s) => s.status === "submitted" || s.status === "rejected");
  const filtered = leads.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.full_name.toLowerCase().includes(q) || s.company_name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
  });
  const newLeads = filtered.filter((s) => s.status === "submitted");
  const rejectedLeads = filtered.filter((s) => s.status === "rejected");

  // For board: all submissions
  const allFiltered = submissions.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.full_name.toLowerCase().includes(q) || s.company_name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
  });

  const overdue = newLeads.filter((s) => urgency(s.created_at) === "red").length;
  const totalActive = submissions.filter((s) => s.status !== "done" && s.status !== "rejected").length;

  return (
    <div className={cn("flex flex-col gap-4 p-5", view === "board" && "h-full")}>
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Pipeline
          </h2>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {totalActive} active
            {overdue > 0 && <span className="text-red-500 ml-2">{overdue} overdue</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: "var(--surface-border)" }}>
            {(["board", "funnel", "table"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn("px-3 py-1.5 text-xs font-medium transition-colors capitalize", view === v ? "bg-brand text-white" : "")}
                style={view !== v ? { background: "var(--surface-elevated)", color: "var(--text-secondary)" } : undefined}
              >
                {v}
              </button>
            ))}
          </div>
          <button onClick={fetchSubmissions} className="rounded-lg px-3 py-1.5 text-sm hover:bg-black/5" style={{ color: "var(--text-secondary)" }}>
            Refresh
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="rounded-lg border px-4 py-2.5 text-sm max-w-sm focus:border-brand focus:outline-none shrink-0"
        style={{ borderColor: "var(--surface-border)", background: "var(--surface-elevated)", color: "var(--text-primary)" }}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        </div>
      ) : view === "board" ? (
        <BoardView submissions={allFiltered} onAction={handleAction} saving={saving} />
      ) : view === "funnel" ? (
        <FunnelView leads={newLeads} rejected={rejectedLeads} onAction={handleAction} saving={saving} />
      ) : (
        <TableView leads={newLeads} rejected={rejectedLeads} onAction={handleAction} saving={saving} />
      )}
    </div>
  );
}

function BoardView({ submissions, onAction, saving }: {
  submissions: Submission[]; onAction: (id: string, status: string) => void; saving: boolean;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const rejected = submissions.filter((s) => s.status === "rejected");

  const allColumns = [
    ...STAGES.map((s) => ({ key: s.key, label: s.label, color: s.color, dotColor: s.dotColor })),
    ...(rejected.length > 0 || dragId ? [{ key: "rejected", label: "Rejected", color: "border-red-300/30 bg-red-50", dotColor: "bg-red-400" }] : []),
  ];

  function handleDragStart(e: React.DragEvent, id: string) {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    // Make the drag image slightly transparent
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5";
    }
  }

  function handleDragEnd(e: React.DragEvent) {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
    setDragId(null);
    setDropTarget(null);
  }

  function handleDragOver(e: React.DragEvent, stageKey: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTarget(stageKey);
  }

  function handleDragLeave() {
    setDropTarget(null);
  }

  function handleDrop(e: React.DragEvent, stageKey: string) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id && !saving) {
      const sub = submissions.find((s) => s.id === id);
      if (sub && sub.status !== stageKey) {
        onAction(id, stageKey);
      }
    }
    setDragId(null);
    setDropTarget(null);
  }

  return (
    <div className="flex-1 overflow-hidden min-h-0">
      <div className="flex gap-3 h-full pb-4">
        {allColumns.map((stage) => {
          const items = submissions.filter((s) => s.status === stage.key);
          const stageIdx = STAGES.findIndex((s) => s.key === stage.key);
          const isDropping = dropTarget === stage.key && dragId !== null;
          const isRejectedCol = stage.key === "rejected";

          return (
            <div
              key={stage.key}
              className="flex flex-col flex-1 min-w-[180px]"
              onDragOver={(e) => handleDragOver(e, stage.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.key)}
            >
              <div className={cn("rounded-lg border px-3 py-2 flex items-center justify-between mb-2", stage.color)}>
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", stage.dotColor)} />
                  <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{stage.label}</span>
                </div>
                <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>{items.length}</span>
              </div>

              <div
                className={cn(
                  "flex-1 flex flex-col gap-2 overflow-y-auto min-h-[120px] rounded-lg transition-colors duration-150",
                  isDropping && "bg-brand/5 ring-2 ring-brand/20 ring-inset",
                  isRejectedCol && !isDropping && "opacity-60",
                )}
              >
                {items.length === 0 ? (
                  <div
                    className={cn(
                      "flex-1 rounded-lg border border-dashed flex items-center justify-center transition-colors",
                      isDropping ? "border-brand/40 bg-brand/5" : "",
                    )}
                    style={!isDropping ? { borderColor: "var(--surface-border)" } : undefined}
                  >
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {isDropping ? "Drop here" : "Empty"}
                    </span>
                  </div>
                ) : (
                  items.map((sub) => {
                    const u = urgency(sub.created_at, sub.status);
                    const canAdvance = stageIdx >= 0 && stageIdx < STAGES.length - 1;
                    const canRevert = stageIdx > 0;
                    return (
                      <div
                        key={sub.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, sub.id)}
                        onDragEnd={handleDragEnd}
                        className={cn(
                          "rounded-lg border p-3 flex flex-col gap-2 group hover:shadow-sm transition-shadow cursor-grab active:cursor-grabbing",
                          dragId === sub.id && "opacity-50",
                        )}
                        style={{ borderColor: "var(--surface-border)", background: "var(--surface-elevated)" }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <a href={`/admin/${sub.id}`} className="flex-1 min-w-0" draggable={false}>
                            <div className="flex items-center gap-1.5">
                              <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", isRejectedCol ? "bg-red-300" : URGENCY_DOT[u])} />
                              <span className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{sub.full_name}</span>
                            </div>
                            <p className="text-[11px] truncate mt-0.5" style={{ color: "var(--text-muted)" }}>{sub.company_name}</p>
                          </a>
                          <span className="text-[10px] whitespace-nowrap shrink-0" style={{ color: "var(--text-muted)" }}>{timeAgo(sub.created_at)}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {sub.site_type && (
                              <span className="rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize" style={{ borderColor: "var(--surface-border)", color: "var(--text-secondary)" }}>
                                {sub.site_type}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {isRejectedCol ? (
                              <button
                                onClick={() => onAction(sub.id, "submitted")}
                                disabled={saving}
                                className="text-[10px] font-medium hover:underline disabled:opacity-50"
                                style={{ color: "var(--text-muted)" }}
                              >
                                Restore
                              </button>
                            ) : (
                              <>
                                {canRevert && (
                                  <button
                                    onClick={() => onAction(sub.id, STAGES[stageIdx - 1].key)}
                                    disabled={saving}
                                    className="h-5 w-5 rounded flex items-center justify-center hover:bg-black/5 disabled:opacity-50"
                                    style={{ color: "var(--text-muted)" }}
                                    title={`Move to ${STAGES[stageIdx - 1].label}`}
                                  >
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                      <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </button>
                                )}
                                {canAdvance && (
                                  <button
                                    onClick={() => onAction(sub.id, STAGES[stageIdx + 1].key)}
                                    disabled={saving}
                                    className="h-5 w-5 rounded flex items-center justify-center hover:bg-brand/10 hover:text-brand disabled:opacity-50"
                                    style={{ color: "var(--text-muted)" }}
                                    title={`Move to ${STAGES[stageIdx + 1].label}`}
                                  >
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FunnelView({ leads, rejected, onAction, saving }: {
  leads: Submission[]; rejected: Submission[]; onAction: (id: string, status: string) => void; saving: boolean;
}) {
  const sorted = [...leads].sort((a, b) => {
    const ua = urgency(a.created_at);
    const ub = urgency(b.created_at);
    const order = { red: 0, yellow: 1, green: 2 };
    if (order[ua] !== order[ub]) return order[ua] - order[ub];
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  return (
    <div className="flex flex-col gap-4">
      {sorted.length === 0 && rejected.length === 0 && (
        <div className="rounded-xl border border-dashed flex items-center justify-center py-16" style={{ borderColor: "var(--surface-border)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>No incoming leads yet.</p>
        </div>
      )}

      {sorted.map((sub) => (
        <LeadCard key={sub.id} sub={sub} onAction={onAction} saving={saving} />
      ))}

      {rejected.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Rejected ({rejected.length})</p>
          <div className="flex flex-col gap-2 opacity-60">
            {rejected.map((sub) => (
              <LeadCard key={sub.id} sub={sub} onAction={onAction} saving={saving} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LeadCard({ sub, onAction, saving }: {
  sub: Submission; onAction: (id: string, status: string) => void; saving: boolean;
}) {
  const u = urgency(sub.created_at);
  const isRejected = sub.status === "rejected";

  return (
    <div
      className="flex items-center gap-4 rounded-xl border p-4 transition-colors duration-150 hover:shadow-sm group"
      style={{ borderColor: "var(--surface-border)", background: "var(--surface-elevated)" }}
    >
      <div className={cn("h-2.5 w-2.5 rounded-full shrink-0", isRejected ? "bg-red-300" : URGENCY_DOT[u])} />
      <a href={`/admin/${sub.id}`} className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{sub.full_name}</span>
          <span className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>{sub.company_name}</span>
        </div>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{sub.email}</p>
      </a>
      {sub.site_type && (
        <span className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium shrink-0 capitalize" style={{ borderColor: "var(--surface-border)", color: "var(--text-secondary)" }}>
          {sub.site_type}
        </span>
      )}
      <span className="text-xs shrink-0 whitespace-nowrap" style={{ color: "var(--text-muted)" }}>{timeAgo(sub.created_at)}</span>
      {!isRejected ? (
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => onAction(sub.id, "rejected")} disabled={saving} className="rounded-lg border px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors" style={{ borderColor: "var(--surface-border)" }}>Reject</button>
          <button onClick={() => onAction(sub.id, "approved")} disabled={saving} className="rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-light disabled:opacity-50 transition-colors">Approve</button>
        </div>
      ) : (
        <button onClick={() => onAction(sub.id, "submitted")} disabled={saving} className="text-xs font-medium hover:underline disabled:opacity-50" style={{ color: "var(--text-muted)" }}>Restore</button>
      )}
      <a href={`/admin/${sub.id}`} className="shrink-0 hover:text-brand" style={{ color: "var(--text-muted)" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  );
}

function TableView({ leads, rejected, onAction, saving }: {
  leads: Submission[]; rejected: Submission[]; onAction: (id: string, status: string) => void; saving: boolean;
}) {
  const all = [...leads, ...rejected];

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--surface-border)" }}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr style={{ background: "var(--surface-floating)", borderColor: "var(--surface-border)" }} className="border-b">
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Name</th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Company</th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Type</th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Email</th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Submitted</th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Status</th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {all.map((sub) => {
            const isRejected = sub.status === "rejected";
            const u = urgency(sub.created_at);
            return (
              <tr key={sub.id} className="border-b last:border-0 hover:bg-black/[0.02] transition-colors" style={{ borderColor: "var(--surface-border)", background: "var(--surface-elevated)" }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-2 w-2 rounded-full shrink-0", isRejected ? "bg-red-300" : URGENCY_DOT[u])} />
                    <a href={`/admin/${sub.id}`} className="font-medium hover:text-brand" style={{ color: "var(--text-primary)" }}>{sub.full_name}</a>
                  </div>
                </td>
                <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{sub.company_name}</td>
                <td className="px-4 py-3 text-xs capitalize" style={{ color: "var(--text-secondary)" }}>{sub.site_type || "—"}</td>
                <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>{sub.email}</td>
                <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                  {new Date(sub.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium", isRejected ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700")}>
                    {isRejected ? "Rejected" : "New"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {!isRejected ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => onAction(sub.id, "rejected")} disabled={saving} className="text-xs text-red-500 hover:underline disabled:opacity-50">Reject</button>
                      <button onClick={() => onAction(sub.id, "approved")} disabled={saving} className="text-xs text-brand font-medium hover:underline disabled:opacity-50">Approve</button>
                    </div>
                  ) : (
                    <button onClick={() => onAction(sub.id, "submitted")} disabled={saving} className="text-xs hover:underline disabled:opacity-50" style={{ color: "var(--text-muted)" }}>Restore</button>
                  )}
                </td>
              </tr>
            );
          })}
          {all.length === 0 && (
            <tr><td colSpan={7} className="px-4 py-12 text-center text-sm" style={{ color: "var(--text-muted)" }}>No incoming leads.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
