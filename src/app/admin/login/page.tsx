"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Wrong password");
      setPassword("");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-base px-4">
      <form
        onSubmit={handleLogin}
        className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-surface-border bg-surface-elevated p-8"
      >
        <h1
          className="text-xl font-bold text-text-primary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Admin
        </h1>
        <p className="text-sm text-text-muted">
          Enter password to continue.
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="rounded-xl border border-surface-border bg-surface-floating px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none"
        />

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-brand px-6 py-3 text-sm font-medium text-white transition-transform duration-200 hover:bg-brand-light hover:shadow-[0_0_20px_rgba(242,86,35,0.3)] active:scale-[0.97] disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
