import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function WhatIDoSection() {
  return (
    <section aria-labelledby="what-i-do-heading" className="py-20 md:py-28">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2
            id="what-i-do-heading"
            className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.15] text-paper"
          >
            AI that does actual work.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-paper-dim sm:text-lg">
            AI becomes valuable when it solves real operational problems. I
            build systems that can handle tasks, connect workflows,
            communicate with customers, retrieve information, and automate
            repetitive processes — giving teams more time to focus on work
            that requires human judgment.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
