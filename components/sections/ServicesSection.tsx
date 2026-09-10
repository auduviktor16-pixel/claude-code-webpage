import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconBadge } from "@/components/ui/IconBadge";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/siteConfig";

export function ServicesSection() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="border-t border-border-soft py-20 md:py-28"
    >
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Services"
            headingId="services-heading"
            title="What I can help you automate"
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {siteConfig.services.map((service, i) => (
            <Reveal key={service.id} delayMs={i * 80}>
              <article className="flex h-full flex-col rounded-2xl border border-border bg-surface p-7">
                <div className="flex items-center justify-between">
                  <IconBadge icon={service.icon} />
                  <span className="font-display text-sm text-paper-mute">
                    {service.index}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-xl text-paper">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-paper-dim">
                  {service.description}
                </p>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {service.capabilities.map((capability) => (
                    <li
                      key={capability}
                      className="rounded-full border border-border-soft px-3 py-1 text-xs text-paper-mute"
                    >
                      {capability}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <Button
                    href="#contact"
                    variant="ghost"
                    icon
                    className="!px-0 !py-0"
                    event={siteConfig.analytics.events.serviceCtaClicked}
                    eventProps={{ location: "services" }}
                  >
                    Discuss a Project
                  </Button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
