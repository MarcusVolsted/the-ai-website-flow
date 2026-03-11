"use client";

export default function RevisionsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "var(--surface-floating)" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-muted)" }}>
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="text-center">
        <h2
          className="text-lg font-bold mb-1"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Revisions Queue
        </h2>
        <p className="text-sm max-w-sm" style={{ color: "var(--text-muted)" }}>
          Client revision requests will appear here. This feature is coming soon.
        </p>
      </div>
    </div>
  );
}
