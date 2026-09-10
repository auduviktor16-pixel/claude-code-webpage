import type { Metadata } from "next";
import type { SiteConfig } from "@/lib/siteConfig.types";
import { getConfiguredSocialLinks } from "@/lib/links";

export function buildMetadata(config: SiteConfig): Metadata {
  const { seo, siteUrl, name } = config;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: seo.title,
      template: `%s | ${name}`,
    },
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name }],
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      url: siteUrl,
      siteName: name,
      title: seo.title,
      description: seo.description,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
  };
}

/**
 * Only facts explicitly provided in `siteConfig` are represented here.
 * `sameAs` only includes socials that are actually configured.
 */
export function buildPersonJsonLd(config: SiteConfig): Record<string, unknown> {
  const sameAs = getConfiguredSocialLinks(config.socialLinks)
    .map((link) => link.href)
    .filter((href): href is string => Boolean(href));

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: config.name,
    jobTitle: config.role,
    description: config.description,
    email: `mailto:${config.email}`,
    url: config.siteUrl,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}
