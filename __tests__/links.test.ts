import { describe, expect, it } from "vitest";
import { getConfiguredSocialLinks, hasSocialLink } from "@/lib/links";
import type { SocialLink } from "@/lib/siteConfig.types";

const Icon = () => null;

const configured: SocialLink = { label: "LinkedIn", href: "https://linkedin.com/in/x", icon: Icon };
const unset: SocialLink = { label: "GitHub", href: undefined, icon: Icon };
const blank: SocialLink = { label: "X", href: "   ", icon: Icon };

describe("hasSocialLink", () => {
  it("returns true for a link with a non-empty href", () => {
    expect(hasSocialLink(configured)).toBe(true);
  });

  it("returns false for a link with an undefined href", () => {
    expect(hasSocialLink(unset)).toBe(false);
  });

  it("returns false for a link with a whitespace-only href", () => {
    expect(hasSocialLink(blank)).toBe(false);
  });
});

describe("getConfiguredSocialLinks", () => {
  it("filters out unconfigured links, preserving order of configured ones", () => {
    const result = getConfiguredSocialLinks([unset, configured, blank]);
    expect(result).toEqual([configured]);
  });

  it("returns an empty array when nothing is configured", () => {
    expect(getConfiguredSocialLinks([unset, blank])).toEqual([]);
  });
});
