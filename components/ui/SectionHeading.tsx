import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  headingId,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  headingId?: string;
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow && (
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-teal">
          {eyebrow}
        </p>
      )}
      <h2
        id={headingId}
        className={`font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.1] text-paper ${
          align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-5 max-w-xl text-base leading-relaxed text-paper-dim sm:text-lg ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
