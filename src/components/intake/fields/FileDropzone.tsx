"use client";

import { cn } from "@/lib/utils";
import { useCallback, useState, useRef } from "react";

const ACCEPTED_TYPES = ["image/svg+xml", "image/png", "image/jpeg"];
const ACCEPTED_EXTENSIONS = ".svg, .png, .jpg, .jpeg";
const MAX_SIZE_MB = 10;
const MIN_WIDTH = 500;
const MIN_HEIGHT = 500;

interface FileDropzoneProps {
  value?: File;
  onChange: (file: File | undefined) => void;
  noLogo: boolean;
  onNoLogoChange: (checked: boolean) => void;
  error?: string;
}

export function FileDropzone({
  value,
  onChange,
  noLogo,
  onNoLogoChange,
  error,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = useCallback(
    (file: File | undefined) => {
      setValidationError(null);

      if (!file) {
        setPreview(null);
        onChange(undefined);
        return;
      }

      // Check file type
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setValidationError(
          "Please upload an SVG or high-res PNG/JPG. Other formats are not accepted.",
        );
        return;
      }

      // Check file size
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setValidationError(`File must be under ${MAX_SIZE_MB}MB.`);
        return;
      }

      // For raster images, check dimensions
      if (file.type !== "image/svg+xml") {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
            setValidationError(
              `Logo must be at least ${MIN_WIDTH}x${MIN_HEIGHT}px. Yours is ${img.width}x${img.height}px. Please upload a higher resolution version.`,
            );
            URL.revokeObjectURL(url);
            return;
          }
          setPreview(url);
          onChange(file);
        };
        img.onerror = () => {
          setValidationError("Could not read this image. Please try another file.");
          URL.revokeObjectURL(url);
        };
        img.src = url;
      } else {
        // SVG — always accepted
        const url = URL.createObjectURL(file);
        setPreview(url);
        onChange(file);
      }
    },
    [onChange],
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    validateAndSetFile(e.dataTransfer.files[0]);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleClick() {
    inputRef.current?.click();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    validateAndSetFile(e.target.files?.[0]);
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setValidationError(null);
    onChange(undefined);
    if (inputRef.current) inputRef.current.value = "";
  }

  const displayError = validationError || error;

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-text-secondary">
        Your Logo
      </label>

      {/* No logo toggle */}
      <button
        type="button"
        onClick={() => {
          onNoLogoChange(!noLogo);
          if (!noLogo) {
            // Clearing file when toggling to "no logo"
            if (preview) URL.revokeObjectURL(preview);
            setPreview(null);
            setValidationError(null);
            onChange(undefined);
          }
        }}
        className={cn(
          "flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200",
          "hover:border-brand/50",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          "active:scale-[0.99]",
          noLogo
            ? "border-brand bg-brand/5"
            : "border-surface-border bg-surface-floating",
        )}
      >
        <div
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors duration-200",
            noLogo ? "border-brand bg-brand" : "border-surface-border",
          )}
        >
          {noLogo && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">
            I don't have a logo yet
          </p>
          <p className="text-xs text-text-muted">
            No worries — we can work with your brand name instead
          </p>
        </div>
      </button>

      {/* Upload area */}
      {!noLogo && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleClick()}
          className={cn(
            "relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6",
            "transition-colors duration-200",
            isDragging
              ? "border-brand bg-brand/5"
              : displayError
                ? "border-red-500/50 bg-surface-floating"
                : "border-surface-border bg-surface-floating hover:border-text-muted",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            onChange={handleInputChange}
            className="hidden"
          />

          {preview ? (
            <div className="flex items-center gap-4">
              <img
                src={preview}
                alt="Logo preview"
                className="h-16 w-16 rounded-lg object-contain bg-white/5 p-1"
              />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-text-primary">
                  {value?.name}
                </p>
                <p className="text-xs text-text-muted">
                  {value && (value.size / 1024).toFixed(1)} KB
                  {value?.type === "image/svg+xml" && " · SVG"}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="ml-auto rounded-lg p-2 text-text-muted transition-colors duration-200 hover:bg-surface-elevated hover:text-text-primary focus-visible:outline-2 focus-visible:outline-brand active:scale-[0.95]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-brand"
                >
                  <path
                    d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm text-text-secondary">
                  <span className="font-medium text-brand">Click to upload</span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
                  <strong className="text-text-secondary">SVG preferred</strong> · PNG or JPG at min {MIN_WIDTH}x{MIN_HEIGHT}px
                  <br />
                  Transparent background · Max {MAX_SIZE_MB}MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {displayError && (
        <p className="text-xs text-red-400">{displayError}</p>
      )}
    </div>
  );
}
