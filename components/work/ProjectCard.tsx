import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";
import type { ProjectShowcase } from "@/lib/siteConfig.types";

export function ProjectCard({
  project,
  children,
}: {
  project: ProjectShowcase;
  children?: React.ReactNode;
}) {
  return (
    <article className="rounded-3xl border border-border bg-surface p-7 sm:p-10">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-teal">
        {project.label}
      </p>
      <h3 className="mt-4 font-display text-2xl text-paper sm:text-3xl">
        {project.name}
      </h3>
      <p className="mt-3 max-w-2xl font-display text-lg text-paper-dim">
        {project.headline}
      </p>
      <p className="mt-5 max-w-2xl text-sm leading-relaxed text-paper-dim sm:text-base">
        {project.description}
      </p>

      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-paper-mute">
          Role
        </p>
        <p className="mt-1 text-sm text-paper">{project.role}</p>
      </div>

      <ul className="mt-4 flex flex-wrap gap-2">
        {project.responsibilities.map((item) => (
          <li
            key={item}
            className="rounded-full border border-border-soft px-3 py-1 text-xs text-paper-mute"
          >
            {item}
          </li>
        ))}
      </ul>

      {children && <div className="mt-8">{children}</div>}

      {project.liveUrl && (
        <div className="mt-8">
          <Button
            href={project.liveUrl}
            variant="secondary"
            icon
            target="_blank"
            rel="noreferrer noopener"
            event={siteConfig.analytics.events.betapayClicked}
          >
            Explore {project.name}
          </Button>
        </div>
      )}
    </article>
  );
}
