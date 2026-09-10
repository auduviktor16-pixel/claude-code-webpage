"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MobileNav } from "@/components/layout/MobileNav";
import { siteConfig } from "@/lib/siteConfig";
import { useActiveSection } from "@/hooks/useActiveSection";

const SECTION_IDS = siteConfig.nav.map((item) => item.id);

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const activeSection = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => entry && setIsScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  useEffect(() => {
    if (!isMobileOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen]);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="absolute top-0 h-px w-px" />
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          isScrolled
            ? "border-b border-border-soft bg-ink/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
          <Link
            href="#home"
            className="font-display text-lg font-medium tracking-tight text-paper"
          >
            {siteConfig.name}
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                aria-current={activeSection === item.id ? "true" : undefined}
                className={`text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? "text-teal"
                    : "text-paper-dim hover:text-paper"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button
              href="#contact"
              variant="primary"
              className="!px-5 !py-2.5 text-sm"
              event={siteConfig.analytics.events.contactStarted}
              eventProps={{ location: "navbar" }}
            >
              Let&rsquo;s Work Together
            </Button>
          </div>

          <button
            type="button"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav"
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMobileOpen((open) => !open)}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border text-paper md:hidden"
          >
            {isMobileOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      <MobileNav
        id="mobile-nav"
        isOpen={isMobileOpen}
        activeSection={activeSection}
        onClose={() => setIsMobileOpen(false)}
      />
    </>
  );
}
