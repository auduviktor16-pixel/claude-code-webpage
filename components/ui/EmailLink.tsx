"use client";

import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/siteConfig";

export function EmailLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={`mailto:${siteConfig.email}`}
      onClick={() => trackEvent(siteConfig.analytics.events.emailClicked)}
      className={className}
    >
      {siteConfig.email}
    </a>
  );
}
