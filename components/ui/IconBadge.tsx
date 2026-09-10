import type { IconComponent } from "@/lib/siteConfig.types";

export function IconBadge({ icon: Icon }: { icon: IconComponent }) {
  return (
    <span className="inline-flex size-11 items-center justify-center rounded-xl border border-border bg-surface text-teal">
      <Icon className="size-5" aria-hidden="true" />
    </span>
  );
}
