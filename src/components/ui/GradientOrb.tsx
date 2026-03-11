"use client";

interface GradientOrbProps {
  className?: string;
  color?: string;
  size?: string;
}

export function GradientOrb({
  className = "",
  color = "rgba(242, 86, 35, 0.08)",
  size = "600px",
}: GradientOrbProps) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
    />
  );
}
