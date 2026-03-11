"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface ColorPickerProps {
  value: string[];
  onChange: (colors: string[]) => void;
  letUsChoose: boolean;
  onLetUsChooseChange: (checked: boolean) => void;
  error?: string;
}

function SingleColor({
  hex,
  onChangeHex,
  onRemove,
  canRemove,
}: {
  hex: string;
  onChangeHex: (v: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const [text, setText] = useState(hex);

  useEffect(() => {
    setText(hex);
  }, [hex]);

  function handleText(raw: string) {
    let v = raw;
    if (!v.startsWith("#")) v = "#" + v;
    setText(v);
    if (/^#[0-9A-Fa-f]{6}$/.test(v)) onChangeHex(v);
  }

  const isValid = /^#[0-9A-Fa-f]{6}$/.test(hex);

  return (
    <div className="flex items-center gap-2">
      <label
        className="group relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-surface-border transition-colors duration-200 hover:border-text-muted"
        style={{ backgroundColor: isValid ? hex : "#333" }}
      >
        <input
          type="color"
          value={isValid ? hex : "#F25623"}
          onChange={(e) => {
            setText(e.target.value);
            onChangeHex(e.target.value);
          }}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <div className="absolute inset-0 rounded-lg opacity-0 ring-2 ring-brand/50 transition-opacity duration-200 group-hover:opacity-100" />
      </label>

      <input
        type="text"
        value={text}
        onChange={(e) => handleText(e.target.value)}
        placeholder="#000000"
        maxLength={7}
        className="w-full rounded-lg border border-surface-border bg-surface-floating px-3 py-2 text-sm font-mono text-text-primary placeholder:text-text-muted transition-colors duration-200 hover:border-text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30"
      />

      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors duration-200 hover:bg-surface-elevated hover:text-text-primary focus-visible:outline-2 focus-visible:outline-brand active:scale-[0.95]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function ColorPicker({
  value,
  onChange,
  letUsChoose,
  onLetUsChooseChange,
  error,
}: ColorPickerProps) {
  function handleChangeAt(idx: number, hex: string) {
    const next = [...value];
    next[idx] = hex;
    onChange(next);
  }

  function handleRemove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  function handleAdd() {
    if (value.length < 5) {
      onChange([...value, "#"]);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text-secondary">
          Brand Colors
        </label>
        {/* Color swatch preview */}
        {!letUsChoose && value.length > 0 && (
          <div className="flex -space-x-1">
            {value
              .filter((c) => /^#[0-9A-Fa-f]{6}$/.test(c))
              .map((c, i) => (
                <div
                  key={i}
                  className="h-5 w-5 rounded-full border-2 border-surface-base"
                  style={{ backgroundColor: c }}
                />
              ))}
          </div>
        )}
      </div>

      {/* Let us choose toggle */}
      <button
        type="button"
        onClick={() => onLetUsChooseChange(!letUsChoose)}
        className={cn(
          "flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200",
          "hover:border-brand/50",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          "active:scale-[0.99]",
          letUsChoose
            ? "border-brand bg-brand/5"
            : "border-surface-border bg-surface-floating",
        )}
      >
        <div
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors duration-200",
            letUsChoose ? "border-brand bg-brand" : "border-surface-border",
          )}
        >
          {letUsChoose && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">
            Let us choose for you
          </p>
          <p className="text-xs text-text-muted">
            We'll craft a premium palette based on your brand and industry
          </p>
        </div>
      </button>

      {/* Color inputs */}
      {!letUsChoose && (
        <div className="flex flex-col gap-2">
          {value.map((hex, i) => {
            const label = i === 0 ? "Primary" : i === 1 ? "Secondary" : `Accent ${i - 1}`;
            return (
              <div key={i} className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
                  {label}
                </span>
                <SingleColor
                  hex={hex}
                  onChangeHex={(v) => handleChangeAt(i, v)}
                  onRemove={() => handleRemove(i)}
                  canRemove={value.length > 1}
                />
              </div>
            );
          })}

          {value.length < 5 && (
            <button
              type="button"
              onClick={handleAdd}
              className="flex items-center gap-2 rounded-lg border border-dashed border-surface-border px-3 py-2 text-sm text-text-muted transition-colors duration-200 hover:border-text-muted hover:text-text-secondary focus-visible:outline-2 focus-visible:outline-brand active:scale-[0.98]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add another color
            </button>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
