import type { SocialLink } from "@/lib/siteConfig.types";

export function hasSocialLink(link: SocialLink): boolean {
  return Boolean(link.href && link.href.trim().length > 0);
}

export function getConfiguredSocialLinks(links: SocialLink[]): SocialLink[] {
  return links.filter(hasSocialLink);
}
