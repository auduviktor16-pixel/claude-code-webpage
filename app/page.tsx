import { HeroSection } from "@/components/sections/HeroSection";
import { WhatIDoSection } from "@/components/sections/WhatIDoSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { VideoSection } from "@/components/sections/VideoSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { CredibilitySection } from "@/components/sections/CredibilitySection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <WhatIDoSection />
      <ServicesSection />
      <WorkSection />
      <AboutSection />
      <VideoSection />
      <ProcessSection />
      <CredibilitySection />
      <ContactSection />
    </>
  );
}
