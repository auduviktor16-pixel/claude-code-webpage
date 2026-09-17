import { Bot, MessagesSquare, Stethoscope, Workflow, Rocket } from "lucide-react";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/icons/BrandIcons";
import { env } from "@/lib/env";
import { resolveVideoConfig } from "@/lib/video";
import type { SiteConfig } from "@/lib/siteConfig.types";

export const siteConfig: SiteConfig = {
  name: "Audu Victor",
  monogram: "AV",
  role: "AI Automation Specialist & AI Agent Builder",
  supportingRole: "Co-Founder, BetapayAI · Medical Doctor",
  description:
    "I build AI-powered automations and intelligent agents that help businesses streamline operations, improve customer experiences, and work more efficiently. I'm also co-building BetapayAI, a conversational payments platform making everyday payments simpler through AI.",
  email: env.contactEmail,
  siteUrl: env.siteUrl,
  heroPortrait: {
    src: "/me.jpeg",
    alt: "Audu Victor — AI Automation Specialist and AI Agent Builder",
    width: 1014,
    height: 1280,
  },
  nav: [
    { id: "services", label: "Services" },
    { id: "work", label: "Work" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ],
  socialLinks: [
    { label: "LinkedIn", href: env.linkedinUrl, icon: LinkedinIcon },
    { label: "X", href: env.xUrl, icon: XIcon },
    { label: "GitHub", href: env.githubUrl, icon: GithubIcon },
  ],
  services: [
    {
      id: "ai-agents",
      index: "01",
      title: "AI Agents",
      description:
        "Custom AI agents designed around real business workflows. Build systems that can communicate with users, retrieve information, process requests, interact with business tools, and perform defined actions.",
      capabilities: [
        "Customer support",
        "Lead qualification",
        "Internal knowledge assistants",
        "Information retrieval",
        "Customer onboarding",
        "Business operations",
      ],
      icon: Bot,
    },
    {
      id: "workflow-automation",
      index: "02",
      title: "Workflow Automation",
      description:
        "Turn repetitive business processes into connected automated workflows that move information and tasks between the tools your team already uses.",
      capabilities: [
        "Lead routing",
        "CRM workflows",
        "Data processing",
        "Reporting",
        "Notifications",
        "Administrative processes",
      ],
      icon: Workflow,
    },
    {
      id: "conversational-ai",
      index: "03",
      title: "Conversational AI",
      description:
        "Create AI-powered conversational experiences that allow customers to interact naturally with businesses, products, and services.",
      capabilities: [
        "WhatsApp assistants",
        "Customer service",
        "Transactional assistants",
        "Product assistants",
        "Conversational interfaces",
      ],
      icon: MessagesSquare,
    },
  ],
  projects: [
    {
      id: "betapayai",
      label: "Featured Project",
      name: "BetapayAI",
      headline: "Everyday payments through one simple conversation.",
      description:
        "BetapayAI is an AI-powered conversational payments platform designed to make everyday payments simpler through conversation. Users can interact with the assistant through WhatsApp to access supported payment services without navigating multiple apps and complicated interfaces.",
      role: "Co-Founder",
      responsibilities: [
        "Product development",
        "Conversational experience design",
        "User journeys",
        "User testing",
        "Brand development",
        "User acquisition",
        "Go-to-market execution",
      ],
      liveUrl: env.betapayUrl,
    },
  ],
  process: [
    {
      step: "01",
      title: "Understand",
      description:
        "Identify the workflow, bottleneck, repetitive task, or customer problem.",
    },
    {
      step: "02",
      title: "Design",
      description:
        "Determine where AI and automation can create meaningful value.",
    },
    {
      step: "03",
      title: "Build",
      description:
        "Develop and integrate the necessary agents, automations, tools, and workflows.",
    },
    {
      step: "04",
      title: "Improve",
      description:
        "Test with real usage, measure what works, and refine the system.",
    },
  ],
  credibility: [
    {
      title: "AI Builder",
      description:
        "Building practical AI agents and automated workflows around real business problems.",
      icon: Bot,
    },
    {
      title: "Startup Operator",
      description:
        "Co-building BetapayAI across product development, user testing, branding, and go-to-market execution.",
      icon: Rocket,
    },
    {
      title: "Medical Doctor",
      description:
        "Medical training provides an additional foundation in structured problem-solving and analytical decision-making.",
      icon: Stethoscope,
    },
  ],
  video: resolveVideoConfig({ videoSrc: env.videoSrc }),
  seo: {
    title: "Audu Victor | AI Automation & AI Agent Builder",
    description:
      "Audu Victor builds AI agents and intelligent automations that help businesses streamline operations, automate repetitive work, and create better customer experiences.",
    keywords: [
      "AI automation specialist",
      "AI agent builder",
      "AI automation",
      "business automation",
      "AI workflow automation",
      "conversational AI",
    ],
  },
  analytics: {
    events: {
      heroCtaClicked: "hero_cta_clicked",
      seeWorkClicked: "see_work_clicked",
      serviceCtaClicked: "service_cta_clicked",
      betapayClicked: "betapay_clicked",
      contactStarted: "contact_started",
      contactSubmitted: "contact_submitted",
      emailClicked: "email_clicked",
      linkedinClicked: "linkedin_clicked",
      xClicked: "x_clicked",
      githubClicked: "github_clicked",
      videoStarted: "video_started",
      videoCompleted: "video_completed",
      chatOpened: "chat_opened",
      chatMessageSent: "chat_message_sent",
    },
  },
};
