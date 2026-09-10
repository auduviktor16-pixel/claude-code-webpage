import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/siteConfig";

export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-t border-border-soft py-20 md:py-28"
    >
      <Container className="grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-center md:gap-16">
        <Reveal className="order-2 md:order-1">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-2xl border border-border-soft bg-surface md:max-w-none">
            <Image
              src={siteConfig.heroPortrait.src}
              alt=""
              fill
              sizes="(min-width: 768px) 32vw, 70vw"
              className="object-cover grayscale"
              style={{ objectPosition: "center 12%" }}
            />
          </div>
        </Reveal>

        <Reveal className="order-1 md:order-2" delayMs={80}>
          <h2
            id="about-heading"
            className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.1] text-paper"
          >
            Builder. Founder. Doctor.
          </h2>

          <div className="mt-6 space-y-5 text-base leading-relaxed text-paper-dim sm:text-lg">
            <p>
              I&rsquo;m Audu Victor — an AI automation specialist and AI agent
              builder focused on creating practical AI systems that solve
              real business problems.
            </p>
            <p>
              I&rsquo;m also Co-Founder of BetapayAI, where we&rsquo;re
              building conversational experiences designed to make everyday
              payments simpler.
            </p>
            <p>
              Before building in AI and technology, I trained as a medical
              doctor. Medicine taught me to approach complicated problems
              systematically: understand the problem, identify what matters,
              and work toward a practical solution.
            </p>
            <p>Today, I bring that same approach to building with AI.</p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
