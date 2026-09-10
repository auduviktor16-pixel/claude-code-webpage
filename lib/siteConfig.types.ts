import type { ComponentType, SVGProps } from "react";

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export type SectionId =
  | "home"
  | "services"
  | "work"
  | "about"
  | "process"
  | "contact";

export interface NavItem {
  id: SectionId;
  label: string;
}

export interface SocialLink {
  label: string;
  href?: string;
  icon: IconComponent;
}

export interface ServiceItem {
  id: string;
  index: string;
  title: string;
  description: string;
  capabilities: string[];
  icon: IconComponent;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface CredibilityPillar {
  title: string;
  description: string;
  icon: IconComponent;
}

export interface ProjectShowcase {
  id: string;
  label: string;
  name: string;
  headline: string;
  description: string;
  role: string;
  responsibilities: string[];
  liveUrl?: string;
}

export interface VideoConfig {
  enabled: boolean;
  src?: string;
  poster?: string;
}

export interface SiteConfig {
  name: string;
  monogram: string;
  role: string;
  supportingRole: string;
  description: string;
  email: string;
  siteUrl: string;
  heroPortrait: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  nav: NavItem[];
  socialLinks: SocialLink[];
  services: ServiceItem[];
  projects: ProjectShowcase[];
  process: ProcessStep[];
  credibility: CredibilityPillar[];
  video: VideoConfig;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  analytics: {
    events: {
      heroCtaClicked: string;
      seeWorkClicked: string;
      serviceCtaClicked: string;
      betapayClicked: string;
      contactStarted: string;
      contactSubmitted: string;
      emailClicked: string;
      linkedinClicked: string;
      xClicked: string;
      githubClicked: string;
      videoStarted: string;
      videoCompleted: string;
    };
  };
}

export type CtaLocation = "navbar" | "hero" | "services" | "final_cta";
