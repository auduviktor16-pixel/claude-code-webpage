"use client";

import { track } from "@vercel/analytics";
import type { CtaLocation } from "@/lib/siteConfig.types";

export function trackEvent(
  event: string,
  props?: Record<string, string | number | boolean>,
) {
  try {
    track(event, props);
  } catch {
    // Analytics must never break the UI.
  }
}

export function trackCta(event: string, location: CtaLocation) {
  trackEvent(event, { location });
}
