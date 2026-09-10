import type { VideoConfig } from "@/lib/siteConfig.types";

interface VideoEnvInput {
  videoSrc?: string;
}

function derivePosterPath(src: string): string {
  const withoutExt = src.replace(/\.[^./]+$/, "");
  return `${withoutExt}-poster.jpg`;
}

/**
 * Pure function: whether the video section should render, and what to
 * render, is fully determined by whether NEXT_PUBLIC_VIDEO_SRC is set.
 * No video asset today means `enabled: false` and VideoSection renders null.
 */
export function resolveVideoConfig(input: VideoEnvInput): VideoConfig {
  const src = input.videoSrc?.trim();
  if (!src) {
    return { enabled: false };
  }
  return { enabled: true, src, poster: derivePosterPath(src) };
}
