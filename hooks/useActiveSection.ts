"use client";

import { useEffect, useState } from "react";
import type { SectionId } from "@/lib/siteConfig.types";

export interface SectionObservation {
  id: SectionId;
  isIntersecting: boolean;
  intersectionRatio: number;
  boundingTop: number;
}

/**
 * Pure reducer: given the current intersection state of every tracked
 * section, decide which one counts as "active" for nav highlighting.
 * Exported separately so it's unit-testable without a real DOM/observer.
 */
export function pickActiveSection(
  observations: SectionObservation[],
  currentActive: SectionId | null,
): SectionId | null {
  const intersecting = observations.filter((entry) => entry.isIntersecting);

  if (intersecting.length === 0) {
    return currentActive;
  }

  const [best] = [...intersecting].sort((a, b) => {
    if (b.intersectionRatio !== a.intersectionRatio) {
      return b.intersectionRatio - a.intersectionRatio;
    }
    return Math.abs(a.boundingTop) - Math.abs(b.boundingTop);
  });

  return best ? best.id : currentActive;
}

export function useActiveSection(sectionIds: SectionId[]): SectionId | null {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => ({ id, element: document.getElementById(id) }))
      .filter(
        (entry): entry is { id: SectionId; element: HTMLElement } =>
          entry.element !== null,
      );

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const observations: SectionObservation[] = entries.map((entry) => {
          const id = elements.find((el) => el.element === entry.target)!.id;
          return {
            id,
            isIntersecting: entry.isIntersecting,
            intersectionRatio: entry.intersectionRatio,
            boundingTop: entry.boundingClientRect.top,
          };
        });

        setActive((current) => {
          const next = pickActiveSection(observations, current);
          return next;
        });
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-20% 0px -35% 0px" },
    );

    elements.forEach(({ element }) => observer.observe(element));
    return () => observer.disconnect();
  }, [sectionIds]);

  return active;
}
