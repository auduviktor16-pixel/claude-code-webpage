"use client";

import type { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function Reveal({
  children,
  className = "",
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? "reveal-visible" : ""} ${className}`}
      style={isVisible && delayMs ? { animationDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
