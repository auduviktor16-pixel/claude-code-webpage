"use client";

import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/siteConfig";

export function VideoSection() {
  const { video } = siteConfig;
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.4 });
  const hasStarted = useRef(false);

  // No video configured yet — render nothing rather than an empty player.
  if (!video.enabled || !video.src) return null;

  return (
    <section aria-labelledby="video-heading" className="border-t border-border-soft py-20 md:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2
            id="video-heading"
            className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.15] text-paper"
          >
            Building at the intersection of AI, business, and real-world
            problems.
          </h2>
        </Reveal>

        <div
          ref={ref}
          className={`mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-border-soft transition-all duration-700 ${
            isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <video
            className="aspect-video w-full bg-ink"
            controls
            muted
            playsInline
            preload="metadata"
            poster={video.poster}
            autoPlay={isVisible}
            onPlay={() => {
              if (!hasStarted.current) {
                hasStarted.current = true;
                trackEvent(siteConfig.analytics.events.videoStarted);
              }
            }}
            onEnded={() => trackEvent(siteConfig.analytics.events.videoCompleted)}
          >
            <source src={video.src} type="video/mp4" />
          </video>
        </div>
      </Container>
    </section>
  );
}
