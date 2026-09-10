import { Container } from "@/components/ui/Container";
import { IconBadge } from "@/components/ui/IconBadge";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/siteConfig";

export function CredibilitySection() {
  return (
    <section
      aria-labelledby="credibility-heading"
      className="border-t border-border-soft py-20 md:py-28"
    >
      <Container>
        <Reveal>
          <h2
            id="credibility-heading"
            className="max-w-2xl font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.15] text-paper"
          >
            Three backgrounds, one way of working.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {siteConfig.credibility.map((pillar, index) => (
            <Reveal key={pillar.title} delayMs={index * 80}>
              <div className="h-full rounded-2xl border border-border bg-surface p-7">
                <IconBadge icon={pillar.icon} />
                <h3 className="mt-6 font-display text-lg text-paper">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-paper-dim">
                  {pillar.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
