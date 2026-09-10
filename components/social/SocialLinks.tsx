"use client";

import { getConfiguredSocialLinks } from "@/lib/links";
import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/siteConfig";

const EVENT_BY_LABEL: Record<string, string> = {
  LinkedIn: siteConfig.analytics.events.linkedinClicked,
  X: siteConfig.analytics.events.xClicked,
  GitHub: siteConfig.analytics.events.githubClicked,
};

// Reads siteConfig directly (a static module, safe to bundle client-side)
// rather than accepting it as a prop — icon components in siteConfig can't
// be serialized across a Server -> Client Component prop boundary.
export function SocialLinks({ className = "" }: { className?: string }) {
  const configured = getConfiguredSocialLinks(siteConfig.socialLinks);

  if (configured.length === 0) return null;

  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {configured.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={link.label}
            onClick={() => {
              const event = EVENT_BY_LABEL[link.label];
              if (event) trackEvent(event);
            }}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border text-paper-dim transition-colors hover:border-teal hover:text-teal"
          >
            <link.icon className="size-4" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
