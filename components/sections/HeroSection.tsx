import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";

export function HeroSection() {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[85vh] items-center overflow-hidden pb-16 pt-32 md:min-h-[92vh] md:pb-24 md:pt-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_10%,rgba(63,208,184,0.10),transparent_55%)]"
      />

      <Container className="grid items-center gap-14 md:grid-cols-[1.05fr_0.95fr] md:gap-10 lg:gap-16">
        <div className="md:order-1">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-teal">
            AI Automation · AI Agents · Product Building
          </p>

          <h1
            id="hero-heading"
            className="mt-6 font-display text-[clamp(2.25rem,5.2vw,3.75rem)] font-medium leading-[1.05] text-paper"
          >
            I build AI agents and automations that help businesses work
            smarter.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-paper-dim sm:text-lg">
            I help businesses turn repetitive processes into intelligent
            workflows — from AI agents and customer interactions to
            connected business automations.
          </p>

          <div className="mt-8 space-y-1">
            <p className="text-base font-medium text-paper">{siteConfig.role}</p>
            <p className="text-sm text-paper-mute">{siteConfig.supportingRole}</p>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              href="#contact"
              variant="primary"
              icon
              event={siteConfig.analytics.events.heroCtaClicked}
              eventProps={{ location: "hero" }}
            >
              Let&rsquo;s Work Together
            </Button>
            <Button
              href="#work"
              variant="secondary"
              event={siteConfig.analytics.events.seeWorkClicked}
            >
              See My Work
            </Button>
          </div>
        </div>

        <div className="mt-10 md:order-2 md:mt-0">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl border border-border-soft bg-surface sm:aspect-[4/5] md:aspect-[4/5] md:max-w-none">
            <Image
              src={siteConfig.heroPortrait.src}
              alt={siteConfig.heroPortrait.alt}
              fill
              priority
              sizes="(min-width: 768px) 42vw, 85vw"
              className="object-cover"
              style={{ objectPosition: "center 22%" }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-6 bottom-0 h-24 bg-gradient-to-t from-ink/70 to-transparent"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
