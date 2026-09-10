import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-border-soft py-20 md:py-28"
    >
      <Container className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <Reveal>
          <h2
            id="contact-heading"
            className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.1] text-paper"
          >
            Have a process that should be automated?
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-paper-dim sm:text-lg">
            Tell me what&rsquo;s slowing your team down. Let&rsquo;s explore
            whether AI can solve it.
          </p>
        </Reveal>

        <Reveal delayMs={80}>
          <ContactForm />
        </Reveal>
      </Container>
    </section>
  );
}
