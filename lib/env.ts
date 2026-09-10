const DEFAULT_SITE_URL = "https://auduvictor.com";
const DEFAULT_CONTACT_EMAIL = "auduviktor16@gmail.com";

function trimmed(value: string | undefined): string | undefined {
  const result = value?.trim();
  return result ? result : undefined;
}

/**
 * Only public, non-secret values live here. This module is imported by
 * `siteConfig.ts`, which is imported by client components (Header, Footer) —
 * so `RESEND_API_KEY` must never be added here. See `lib/serverEnv.ts`.
 */
export const env = {
  siteUrl: trimmed(process.env.NEXT_PUBLIC_SITE_URL) ?? DEFAULT_SITE_URL,
  // Publicly displayed (footer, contact section, mailto links) so this is
  // intentionally NEXT_PUBLIC_ — nothing secret about a contact address.
  contactEmail:
    trimmed(process.env.NEXT_PUBLIC_CONTACT_EMAIL) ?? DEFAULT_CONTACT_EMAIL,
  linkedinUrl: trimmed(process.env.NEXT_PUBLIC_LINKEDIN_URL),
  xUrl: trimmed(process.env.NEXT_PUBLIC_X_URL),
  githubUrl: trimmed(process.env.NEXT_PUBLIC_GITHUB_URL),
  betapayUrl: trimmed(process.env.NEXT_PUBLIC_BETAPAY_URL),
  videoSrc: trimmed(process.env.NEXT_PUBLIC_VIDEO_SRC),
};
