"use client";

import { useEffect, useRef, useState } from "react";
import {
  DEFAULT_REVEAL_ROOT_MARGIN,
  DEFAULT_REVEAL_THRESHOLD,
  shouldReveal,
} from "@/lib/scrollReveal";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Reveal-once-on-scroll for any element. A single IntersectionObserver is
 * created per element and disconnected after the first reveal — sections
 * should share this via <Reveal> rather than each rolling their own
 * observer.
 */
export function useScrollReveal<T extends HTMLElement>(
  options: UseScrollRevealOptions = {},
) {
  const ref = useRef<T | null>(null);
  const [observedVisible, setObservedVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry &&
          shouldReveal(
            entry.isIntersecting,
            entry.intersectionRatio,
            options.threshold ?? DEFAULT_REVEAL_THRESHOLD,
          )
        ) {
          setObservedVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: options.threshold ?? DEFAULT_REVEAL_THRESHOLD,
        rootMargin: options.rootMargin ?? DEFAULT_REVEAL_ROOT_MARGIN,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [prefersReducedMotion, options.threshold, options.rootMargin]);

  return { ref, isVisible: prefersReducedMotion || observedVisible };
}
