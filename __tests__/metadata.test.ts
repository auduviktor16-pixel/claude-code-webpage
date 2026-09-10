import { describe, expect, it } from "vitest";
import { buildMetadata, buildPersonJsonLd } from "@/lib/metadata";
import { siteConfig } from "@/lib/siteConfig";
import type { SiteConfig } from "@/lib/siteConfig.types";

describe("buildMetadata", () => {
  it("builds a title, description, and canonical from siteConfig", () => {
    const metadata = buildMetadata(siteConfig);
    expect(metadata.description).toBe(siteConfig.seo.description);
    expect(metadata.alternates?.canonical).toBe("/");
    expect(String(metadata.metadataBase)).toBe(`${siteConfig.siteUrl}/`);
  });
});

describe("buildPersonJsonLd", () => {
  it("omits sameAs entirely when no social links are configured", () => {
    const config: SiteConfig = {
      ...siteConfig,
      socialLinks: siteConfig.socialLinks.map((link) => ({ ...link, href: undefined })),
    };
    const jsonLd = buildPersonJsonLd(config);
    expect(jsonLd).not.toHaveProperty("sameAs");
  });

  it("includes only configured links in sameAs", () => {
    const config: SiteConfig = {
      ...siteConfig,
      socialLinks: [
        { ...siteConfig.socialLinks[0]!, href: "https://linkedin.com/in/example" },
        { ...siteConfig.socialLinks[1]!, href: undefined },
      ],
    };
    const jsonLd = buildPersonJsonLd(config);
    expect(jsonLd.sameAs).toEqual(["https://linkedin.com/in/example"]);
  });

  it("never invents facts beyond what siteConfig provides", () => {
    const jsonLd = buildPersonJsonLd(siteConfig);
    expect(jsonLd["@type"]).toBe("Person");
    expect(jsonLd.name).toBe(siteConfig.name);
    expect(jsonLd).not.toHaveProperty("alumniOf");
    expect(jsonLd).not.toHaveProperty("worksFor");
    expect(jsonLd).not.toHaveProperty("award");
  });
});
