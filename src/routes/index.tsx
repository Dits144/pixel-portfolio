import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { About } from "@/components/landing/about";
import { Certificates } from "@/components/landing/certificates";
import { ContactWithGlobe } from "@/components/ui/contact-with-globe";
import { ExperienceTimeline } from "@/components/landing/experience";
import { FooterSection } from "@/components/ui/footer-section";
import { Hero } from "@/components/landing/hero";
import { BottomDockNavbar } from "@/components/landing/bottom-dock-navbar";
import { Projects } from "@/components/landing/projects";
import { Skills } from "@/components/landing/skills";
import { Testimonials } from "@/components/landing/testimonials";
import { BrandMarquee } from "@/components/landing/brand-marquee";
import { IntroLoader } from "@/components/ui/intro-loader";
import WavingPortfolioLanding from "@/components/ui/waving-portfolio-landing";
import { usePortfolioContent } from "@/hooks/usePortfolioContent";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Muhammad Raditya Anwar — Raditya.tech",
      },
      {
        name: "description",
        content:
          "Portofolio Muhammad Raditya Anwar, Cyber Security Specialist & Fullstack Developer. Sertifikasi BNSP, network administration, dan rekayasa web modern.",
      },
      {
        name: "keywords",
        content:
          "raditya tech, muhammad raditya anwar, cyber security, fullstack developer, bnsp, junior network administrator, bogor",
      },
      { property: "og:title", content: "Muhammad Raditya Anwar — Raditya.tech" },
      {
        property: "og:description",
        content:
          "Portofolio & sertifikasi profesional Muhammad Raditya Anwar di bidang Cyber Security, Administrasi Jaringan, dan Web Engineering.",
      },
      { name: "twitter:title", content: "Muhammad Raditya Anwar — Raditya.tech" },
      {
        name: "twitter:description",
        content:
          "Portofolio & sertifikasi profesional Muhammad Raditya Anwar di bidang Cyber Security, Administrasi Jaringan, dan Web Engineering.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { data } = usePortfolioContent();
  const [showIntro, setShowIntro] = useState(true);

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background relative pb-24">
      {showIntro && <IntroLoader profile={data.profile} onFinished={() => setShowIntro(false)} />}
      
      {/* Sticky Bottom Dock Menu (menggantikan navbar atas) */}
      <BottomDockNavbar />

      <main>
        {/* Animated Creative Opening Poster */}
        <section className="relative w-full border-b border-border/40 overflow-hidden">
          <WavingPortfolioLanding
            name="Raditya Anwar"
            year="2026"
            roles={["Cyber Security", "Fullstack Dev"]}
            lettersLeft={["P", "F"]}
            giantLetter="O"
            lettersRight={["RT", "LIO"]}
            title="Portfolio Muhammad Raditya Anwar"
            greeting="Halo Semua!"
            signature="RADITYA/ANWAR"
            accent="#38bdf8"
            paper="#09090b"
            ink="#f4f4f5"
            height="85vh"
            intro={!showIntro}
          />
        </section>

        <Hero profile={data.profile} />
        <About profile={data.profile} />
        <Skills skills={data.skills} />
        <Certificates certificates={data.certificates || []} />
        <Projects projects={data.projects} />
        <ExperienceTimeline experiences={data.experiences} />
        <Testimonials testimonials={data.testimonials} />
        <ContactWithGlobe profile={data.profile} />
      </main>

      <BrandMarquee />
      <FooterSection profile={data.profile} />
    </div>
  );
}

export default LandingPage;
