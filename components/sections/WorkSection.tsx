import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/work/ProjectCard";
import { BetapayFlowDiagram } from "@/components/work/BetapayFlowDiagram";
import { siteConfig } from "@/lib/siteConfig";

export function WorkSection() {
  const [flagshipProject] = siteConfig.projects;

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="border-t border-border-soft py-20 md:py-28"
    >
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Selected Work"
            headingId="work-heading"
            title="Things I've helped bring to life."
            description="A selection of AI products, automations, and experiments I've worked on."
          />
        </Reveal>

        {flagshipProject && (
          <Reveal className="mt-14" delayMs={80}>
            <ProjectCard project={flagshipProject}>
              <BetapayFlowDiagram />
            </ProjectCard>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
