"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/siteConfig";
import type { SectionId } from "@/lib/siteConfig.types";

export function MobileNav({
  id,
  isOpen,
  activeSection,
  onClose,
}: {
  id: string;
  isOpen: boolean;
  activeSection: SectionId | null;
  onClose: () => void;
}) {
  return (
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Primary"
      hidden={!isOpen}
      className="fixed inset-0 z-40 flex flex-col bg-ink pt-24 md:hidden"
    >
      <nav className="flex flex-col gap-1 px-6">
        {siteConfig.nav.map((item) => (
          <Link
            key={item.id}
            href={`#${item.id}`}
            onClick={onClose}
            aria-current={activeSection === item.id ? "true" : undefined}
            className={`rounded-lg px-3 py-4 text-2xl font-display transition-colors ${
              activeSection === item.id ? "text-teal" : "text-paper"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto px-6 pb-10">
        <Button
          href="#contact"
          variant="primary"
          className="w-full"
          onClick={onClose}
          event={siteConfig.analytics.events.contactStarted}
          eventProps={{ location: "navbar" }}
        >
          Let&rsquo;s Work Together
        </Button>
      </div>
    </div>
  );
}
