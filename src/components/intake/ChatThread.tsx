"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ChatThreadProps {
  children: ReactNode;
}

export function ChatThread({ children }: ChatThreadProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
      {children}
      <div ref={endRef} />
    </div>
  );
}
