import { describe, expect, it } from "vitest";
import { resolveVideoConfig } from "@/lib/video";

describe("resolveVideoConfig", () => {
  it("is disabled when no src is configured", () => {
    expect(resolveVideoConfig({})).toEqual({ enabled: false });
  });

  it("is disabled when src is an empty/whitespace string", () => {
    expect(resolveVideoConfig({ videoSrc: "   " })).toEqual({ enabled: false });
  });

  it("is enabled and derives a poster path when a src is configured", () => {
    const result = resolveVideoConfig({ videoSrc: "/video/work-demo.mp4" });
    expect(result).toEqual({
      enabled: true,
      src: "/video/work-demo.mp4",
      poster: "/video/work-demo-poster.jpg",
    });
  });

  it("trims the configured src", () => {
    const result = resolveVideoConfig({ videoSrc: "  /video/demo.mp4  " });
    expect(result.src).toBe("/video/demo.mp4");
  });
});
