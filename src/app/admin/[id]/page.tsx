"use client";

import { useEffect, useState, use } from "react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  storage_path: string;
}

interface Submission {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string;
  company_location: string | null;
  business_description: string | null;
  current_website_url: string | null;
  site_type: string | null;
  page_count: number | null;
  page_descriptions: string | null;
  features: string[] | null;
  primary_goal: string | null;
  inspiration_urls: string[] | null;
  style_preference: string | null;
  has_logo: boolean;
  brand_colors: string[] | null;
  tone_of_voice: string | null;
  tagline: string | null;
  preferred_cta: string | null;
  target_audience: string | null;
  additional_notes: string | null;
  deadline: string | null;
  conversation: unknown[] | null;
  project_summary: string | null;
  claude_prompt: string | null;
  status: string;
  client_type: string | null;
  deal_type: string | null;
  deal_amount: number | null;
  deal_recurring: boolean;
  deal_notes: string | null;
  notes: Record<string, unknown> | null;
  uploaded_files: UploadedFile[] | null;
  website_language: string | null;
  font_preferences: string | null;
  contact_info_for_site: string | null;
  has_images: boolean;
  image_details: string | null;
}

const STATUSES = [
  { key: "submitted", label: "Incoming" },
  { key: "in_progress", label: "Project Started" },
  { key: "feedback", label: "Feedback" },
  { key: "revision", label: "Revision" },
  { key: "delivered", label: "Delivered" },
];

function statusColor(status: string): string {
  switch (status) {
    case "submitted": return "bg-amber-500";
    case "in_progress": return "bg-brand";
    case "feedback": return "bg-blue-400";
    case "revision": return "bg-violet-400";
    case "delivered": return "bg-emerald-600";
    case "rejected": return "bg-red-500";
    default: return "bg-gray-400";
  }
}

function statusLabel(status: string): string {
  return STATUSES.find((s) => s.key === status)?.label || status;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function timeAgo(iso: string): string {
  const h = (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60);
  if (h < 1) return "Just now";
  if (h < 24) return `${Math.floor(h)}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "1 day ago" : `${d} days ago`;
}

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [sub, setSub] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [notesDirty, setNotesDirty] = useState(false);
  const [copied, setCopied] = useState(false);

  // Deal form state
  const [dealType, setDealType] = useState("");
  const [dealAmount, setDealAmount] = useState("");
  const [dealRecurring, setDealRecurring] = useState(false);
  const [dealNotes, setDealNotes] = useState("");
  const [dealDirty, setDealDirty] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/submissions/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setSub(data);
          setNotes(typeof data.notes === "string" ? data.notes : "");
          setDealType(data.deal_type || "");
          setDealAmount(data.deal_amount != null ? String(data.deal_amount) : "");
          setDealRecurring(data.deal_recurring || false);
          setDealNotes(data.deal_notes || "");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function updateStatus(newStatus: string) {
    if (!sub) return;
    setSaving(true);
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) setSub(await res.json());
    setSaving(false);
  }

  async function saveNotes() {
    setSaving(true);
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    if (res.ok) {
      setSub(await res.json());
      setNotesDirty(false);
    }
    setSaving(false);
  }

  async function saveDeal() {
    setSaving(true);
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deal_type: dealType || null,
        deal_amount: dealAmount ? Number(dealAmount) : null,
        deal_recurring: dealRecurring,
        deal_notes: dealNotes || null,
      }),
    });
    if (res.ok) {
      setSub(await res.json());
      setDealDirty(false);
    }
    setSaving(false);
  }

  async function updateClientType(type: string) {
    setSaving(true);
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_type: type }),
    });
    if (res.ok) setSub(await res.json());
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!sub) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <p className="text-[var(--text-muted)]">Submission not found.</p>
        <a href="/admin/pipeline" className="text-sm text-brand hover:text-brand-light">Back to pipeline</a>
      </div>
    );
  }

  const isRejected = sub.status === "rejected";
  const isDelivered = sub.status === "delivered";
  const currentStageIndex = STATUSES.findIndex((s) => s.key === sub.status);
  const colors = sub.brand_colors?.filter((c) => /^#[0-9A-Fa-f]{6}$/.test(c));

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--surface-border)] shrink-0">
        <div className="flex items-center gap-3">
          <a
            href="/admin/pipeline"
            className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[var(--surface-floating)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              {sub.full_name}
            </h2>
            <p className="text-[11px] text-[var(--text-muted)]">
              {sub.company_name} · {sub.email}{sub.phone ? ` · ${sub.phone}` : ""} · {timeAgo(sub.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`mailto:${sub.email}`}
            className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-floating)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Email
          </a>
          {isDelivered && (
            <div className="flex rounded-lg border border-[var(--surface-border)] overflow-hidden">
              {["active", "inactive"].map((t) => (
                <button
                  key={t}
                  onClick={() => updateClientType(t)}
                  disabled={saving}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                    sub.client_type === t
                      ? t === "active" ? "bg-emerald-600 text-white" : "bg-gray-500 text-white"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]",
                  )}
                  style={sub.client_type !== t ? { background: "var(--surface-floating)" } : undefined}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status pipeline */}
      <div className="px-5 py-3 border-b border-[var(--surface-border)] shrink-0">
        {!isRejected ? (
          <div className="flex items-center gap-1">
            {STATUSES.map((stage, i) => {
              const isActive = i <= currentStageIndex;
              const isCurrent = i === currentStageIndex;
              return (
                <button
                  key={stage.key}
                  disabled={saving}
                  onClick={() => updateStatus(stage.key)}
                  className="flex flex-1 flex-col gap-1 group"
                >
                  <div
                    className={cn(
                      "h-1.5 rounded-full transition-colors duration-200",
                      isActive ? statusColor(stage.key) : "bg-[var(--surface-border)] group-hover:bg-[var(--surface-floating)]",
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] text-center transition-colors",
                      isCurrent ? "text-[var(--text-primary)] font-semibold" : "text-[var(--text-muted)]",
                    )}
                  >
                    {stage.label}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 flex items-center justify-between">
            <span className="text-sm text-red-600 font-medium">Rejected</span>
            <button
              onClick={() => updateStatus("submitted")}
              disabled={saving}
              className="text-xs text-red-400 hover:text-red-600 font-medium"
            >
              Restore as lead
            </button>
          </div>
        )}
      </div>

      {/* Content - full width 2-column layout */}
      <div className="flex-1 px-5 py-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">

          {/* Left column */}
          <div className="flex flex-col gap-4">
            {/* Contact info card */}
            <Card title="Contact Information">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <MiniField label="Full Name" value={sub.full_name} />
                <div>
                  <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Email</span>
                  <p className="text-xs mt-0.5">
                    <a href={`mailto:${sub.email}`} className="text-brand hover:text-brand/80 transition-colors">{sub.email}</a>
                  </p>
                </div>
                <MiniField label="Phone" value={sub.phone || "Not provided"} />
                <MiniField label="Company" value={sub.company_name} />
                <MiniField label="Location" value={sub.company_location || "Not provided"} />
                {sub.current_website_url && (
                  <div>
                    <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Current Website</span>
                    <p className="text-xs mt-0.5">
                      <a href={sub.current_website_url} target="_blank" rel="noopener noreferrer" className="text-brand hover:text-brand/80 transition-colors break-all">
                        {sub.current_website_url.replace(/^https?:\/\//, "")}
                      </a>
                    </p>
                  </div>
                )}
              </div>
              {sub.contact_info_for_site && (
                <div className="mt-3 pt-3 border-t border-[var(--surface-border)]">
                  <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Contact Info for Website</span>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed whitespace-pre-line">{sub.contact_info_for_site}</p>
                </div>
              )}
            </Card>

            {/* Quick info row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <Stat label="Site Type" value={sub.site_type || "N/A"} />
              <Stat label="Goal" value={sub.primary_goal || "N/A"} />
              <Stat label="Pages" value={sub.page_count != null ? String(sub.page_count) : "N/A"} />
              <Stat label="Language" value={sub.website_language || "N/A"} />
              <Stat label="CTA" value={sub.preferred_cta || "N/A"} />
            </div>

            {/* Project scope details */}
            {(sub.page_descriptions || (sub.features && sub.features.length > 0)) && (
              <Card title="Project Details">
                {sub.page_descriptions && (
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                    {sub.page_descriptions}
                  </p>
                )}
                {sub.features && sub.features.length > 0 && (
                  <div className={sub.page_descriptions ? "mt-3" : ""}>
                    <div className="flex flex-wrap gap-1.5">
                      {sub.features.map((f) => (
                        <span key={f} className="rounded-md bg-[var(--surface-floating)] px-2 py-0.5 text-xs text-[var(--text-secondary)]">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Brand & style */}
            <Card title="Brand & Style">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <MiniField label="Style" value={sub.style_preference} />
                <MiniField label="Tone" value={sub.tone_of_voice} />
                <MiniField label="Logo" value={sub.has_logo ? "Yes" : "No"} />
                <MiniField label="Fonts" value={sub.font_preferences || "Not specified"} />
                <div>
                  <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Colors</span>
                  {colors && colors.length > 0 ? (
                    <div className="flex gap-1.5 mt-1">
                      {colors.map((c) => (
                        <div key={c} className="h-5 w-5 rounded border border-[var(--surface-border)]" style={{ backgroundColor: c }} title={c} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {sub.brand_colors && sub.brand_colors.length > 0 ? sub.brand_colors.join(", ") : "None"}
                    </p>
                  )}
                </div>
              </div>
              {sub.inspiration_urls && sub.inspiration_urls.filter((u) => u.trim()).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {sub.inspiration_urls.filter((u) => u.trim()).map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand hover:text-brand/80 truncate max-w-[200px] transition-colors">
                      {url.replace(/^https?:\/\//, "")}
                    </a>
                  ))}
                </div>
              )}
            </Card>

            {/* Content & details */}
            {(sub.target_audience || sub.tagline || sub.additional_notes || sub.business_description) && (
              <Card title="Content & Audience">
                <div className="grid grid-cols-2 gap-3">
                  <MiniField label="Target Audience" value={sub.target_audience} />
                  <MiniField label="Tagline" value={sub.tagline} />
                  {sub.business_description && <MiniField label="Business" value={sub.business_description} full />}
                </div>
                {sub.additional_notes && (
                  <div className="mt-3">
                    <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Notes from Client</span>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed whitespace-pre-line">
                      {sub.additional_notes}
                    </p>
                  </div>
                )}
              </Card>
            )}

            {/* Uploaded Files - collapsible */}
            <FilesCard files={sub.uploaded_files} notes={sub.notes} />

            {/* Claude Code Prompt */}
            {sub.claude_prompt && (
              <Card title="Claude Code Prompt">
                <div className="relative">
                  <pre className="text-xs text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                    {sub.claude_prompt}
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(sub.claude_prompt || "");
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="mt-2 rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand/80 active:scale-[0.98] transition-all"
                  >
                    {copied ? "Copied!" : "Copy Prompt"}
                  </button>
                </div>
              </Card>
            )}
          </div>

          {/* Right column — sidebar */}
          <div className="flex flex-col gap-4">
            {/* Actions */}
            <Card title="Actions">
              <div className="flex flex-col gap-2">
                {sub.status === "submitted" && (
                  <button
                    onClick={() => updateStatus("in_progress")}
                    disabled={saving}
                    className="w-full rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    Start Project
                  </button>
                )}
                {sub.status === "in_progress" && (
                  <button
                    onClick={() => updateStatus("feedback")}
                    disabled={saving}
                    className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    Send for Feedback
                  </button>
                )}
                {sub.status === "feedback" && (
                  <button
                    onClick={() => updateStatus("revision")}
                    disabled={saving}
                    className="w-full rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-600 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    Start Revision
                  </button>
                )}
                {sub.status === "revision" && (
                  <>
                    <button
                      onClick={() => updateStatus("feedback")}
                      disabled={saving}
                      className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      Send for Feedback
                    </button>
                    <button
                      onClick={() => updateStatus("delivered")}
                      disabled={saving}
                      className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      Mark as Delivered
                    </button>
                  </>
                )}
                {!isRejected && !isDelivered && (
                  <button
                    onClick={() => updateStatus("rejected")}
                    disabled={saving}
                    className="w-full rounded-lg border border-red-200 px-4 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                )}
              </div>
            </Card>

            {/* Deal tracking */}
            <Card title="Deal">
              <div className="flex flex-col gap-2.5">
                <div>
                  <label className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Type</label>
                  <select
                    value={dealType}
                    onChange={(e) => { setDealType(e.target.value); setDealDirty(true); }}
                    className="mt-0.5 w-full rounded-lg border border-[var(--surface-border)] bg-[var(--surface-floating)] px-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:border-brand focus:outline-none"
                  >
                    <option value="">No deal yet</option>
                    <option value="one_time">One-time project</option>
                    <option value="monthly">Monthly retainer</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Amount</label>
                  <div className="relative mt-0.5">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]">$</span>
                    <input
                      type="number"
                      value={dealAmount}
                      onChange={(e) => { setDealAmount(e.target.value); setDealDirty(true); }}
                      placeholder="0"
                      className="w-full rounded-lg border border-[var(--surface-border)] bg-[var(--surface-floating)] pl-6 pr-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:border-brand focus:outline-none"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dealRecurring}
                    onChange={(e) => { setDealRecurring(e.target.checked); setDealDirty(true); }}
                    className="rounded border-[var(--surface-border)] text-brand focus:ring-brand h-3.5 w-3.5"
                  />
                  <span className="text-xs text-[var(--text-secondary)]">Recurring payment</span>
                </label>
                <div>
                  <label className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Deal Notes</label>
                  <textarea
                    value={dealNotes}
                    onChange={(e) => { setDealNotes(e.target.value); setDealDirty(true); }}
                    placeholder="Payment terms, scope, etc..."
                    rows={2}
                    className="mt-0.5 w-full rounded-lg border border-[var(--surface-border)] bg-[var(--surface-floating)] px-2.5 py-1.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-brand focus:outline-none resize-none"
                  />
                </div>
                {dealDirty && (
                  <button
                    onClick={saveDeal}
                    disabled={saving}
                    className="rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand/80 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    Save Deal
                  </button>
                )}
              </div>
            </Card>

            {/* Project Summary */}
            {sub.project_summary && (
              <Card title="Summary">
                <p className="text-xs text-[var(--text-secondary)] whitespace-pre-line leading-relaxed">
                  {sub.project_summary}
                </p>
              </Card>
            )}

            {/* Internal notes */}
            <Card title="Internal Notes">
              <textarea
                value={notes}
                onChange={(e) => { setNotes(e.target.value); setNotesDirty(true); }}
                placeholder="Add notes about this client..."
                rows={3}
                className="w-full rounded-lg border border-[var(--surface-border)] bg-[var(--surface-floating)] px-2.5 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-brand focus:outline-none resize-none"
              />
              {notesDirty && (
                <button
                  onClick={saveNotes}
                  disabled={saving}
                  className="mt-2 rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand/80 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  Save Notes
                </button>
              )}
            </Card>

            {/* Meta details */}
            <Card title="Details">
              <div className="flex flex-col gap-1.5 text-[11px]">
                <DetailRow label="Submitted" value={formatDate(sub.created_at)} />
                <DetailRow label="Status" value={statusLabel(sub.status)} />
                {sub.deadline && <DetailRow label="Deadline" value={sub.deadline} />}
                <DetailRow label="ID" value={sub.id.slice(0, 8).toUpperCase()} mono />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-elevated)] px-4 py-3">
      <h3 className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-elevated)] px-3 py-2">
      <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider block">{label}</span>
      <span className="text-sm font-medium text-[var(--text-primary)] capitalize mt-0.5 block truncate">{value}</span>
    </div>
  );
}

function MiniField({ label, value, full }: { label: string; value: React.ReactNode; full?: boolean }) {
  if (!value) return null;
  return (
    <div className={full ? "col-span-2" : ""}>
      <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">{label}</span>
      <p className="text-xs text-[var(--text-secondary)] capitalize mt-0.5">{value}</p>
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className={cn("text-[var(--text-secondary)]", mono && "font-mono")}>{value}</span>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FilesCard({ files, notes }: { files: UploadedFile[] | null; notes: Record<string, unknown> | null }) {
  const [open, setOpen] = useState(false);

  // Files can be in the dedicated column or in the notes JSONB fallback
  const fileList: UploadedFile[] = files && files.length > 0
    ? files
    : (notes && Array.isArray((notes as Record<string, unknown>).uploaded_files) && ((notes as Record<string, unknown>).uploaded_files as UploadedFile[]).length > 0)
      ? (notes as Record<string, unknown>).uploaded_files as UploadedFile[]
      : [];

  if (fileList.length === 0) return null;

  const imageFiles = fileList.filter((f) => f.type.startsWith("image/"));
  const otherFiles = fileList.filter((f) => !f.type.startsWith("image/"));

  return (
    <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface-elevated)]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[var(--surface-floating)] rounded-xl transition-colors"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
            Uploaded Files
          </h3>
          <span className="rounded-full bg-brand/10 text-brand px-2 py-0.5 text-[10px] font-medium">
            {fileList.length}
          </span>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "text-[var(--text-muted)] transition-transform duration-200",
            open && "rotate-180",
          )}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3">
          {/* Image grid */}
          {imageFiles.length > 0 && (
            <div>
              <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Images ({imageFiles.length})</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                {imageFiles.map((file, i) => (
                  <div key={i} className="rounded-lg border border-[var(--surface-border)] bg-[var(--surface-floating)] p-2 flex flex-col gap-1.5">
                    <div className="flex items-center justify-center h-16 rounded bg-[var(--surface-base)]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-muted)]">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-[var(--text-secondary)] truncate" title={file.name}>{file.name}</span>
                    <span className="text-[9px] text-[var(--text-muted)]">{formatFileSize(file.size)}</span>
                    <a
                      href={`/api/intake/download?path=${encodeURIComponent(file.storage_path)}`}
                      download={file.name}
                      className="rounded bg-brand/10 text-brand px-2 py-1 text-[10px] font-medium text-center hover:bg-brand/20 transition-colors"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other files list */}
          {otherFiles.length > 0 && (
            <div>
              <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">Documents ({otherFiles.length})</span>
              <div className="flex flex-col gap-1.5 mt-2">
                {otherFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-[var(--surface-border)] bg-[var(--surface-floating)] px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--text-muted)] shrink-0">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6" />
                      </svg>
                      <span className="text-xs text-[var(--text-secondary)] truncate">{file.name}</span>
                      <span className="text-[10px] text-[var(--text-muted)] shrink-0">{formatFileSize(file.size)}</span>
                    </div>
                    <a
                      href={`/api/intake/download?path=${encodeURIComponent(file.storage_path)}`}
                      download={file.name}
                      className="text-[10px] font-medium text-brand hover:text-brand/80 shrink-0 ml-2 transition-colors"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Download all button */}
          {fileList.length > 1 && (
            <a
              href={`/api/intake/download-all?paths=${encodeURIComponent(JSON.stringify(fileList.map((f) => ({ path: f.storage_path, name: f.name }))))}`}
              className="rounded-lg bg-brand px-3 py-2 text-xs font-medium text-white text-center hover:bg-brand/80 active:scale-[0.98] transition-all"
            >
              Download All ({fileList.length} files)
            </a>
          )}
        </div>
      )}
    </div>
  );
}
