import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/siteConfig";

export function ProcessSection() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="border-t border-border-soft py-20 md:py-28"
    >
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="How I Work"
            headingId="process-heading"
            title="From problem to working automation."
          />
        </Reveal>

        <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.process.map((step, index) => (
            <li key={step.step} className="relative border-t border-border pt-6">
              <Reveal delayMs={index * 80}>
                <span className="font-display text-3xl text-teal">{step.step}</span>
                <h3 className="mt-4 font-display text-lg text-paper">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper-dim">
                  {step.description}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
