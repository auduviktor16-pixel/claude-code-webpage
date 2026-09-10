import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { EmailLink } from "@/components/ui/EmailLink";
import { SocialLinks } from "@/components/social/SocialLinks";
import { siteConfig } from "@/lib/siteConfig";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-soft py-14">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-lg text-paper">{siteConfig.name}</p>
            <p className="mt-2 max-w-xs text-sm text-paper-mute">{siteConfig.role}</p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                className="text-sm text-paper-dim transition-colors hover:text-teal"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <EmailLink className="text-sm text-paper-dim transition-colors hover:text-teal" />
            <SocialLinks />
          </div>
        </div>

        <p className="mt-12 text-xs text-paper-mute">
          © {year} {siteConfig.name}.
        </p>
      </Container>
    </footer>
  );
}
