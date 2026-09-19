import { createFileRoute } from "@tanstack/react-router";

import { About } from "@/components/landing/about";
import { Blog } from "@/components/landing/blog";
import { Contact } from "@/components/landing/contact";
import { ExperienceTimeline } from "@/components/landing/experience";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";
import { Projects } from "@/components/landing/projects";
import { Skills } from "@/components/landing/skills";
import { Testimonials } from "@/components/landing/testimonials";
import { usePortfolioContent } from "@/hooks/usePortfolioContent";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Rizky Ananda — Fullstack Web Developer",
      },
      {
        name: "description",
        content:
          "Portofolio Rizky Ananda, fullstack web developer di Jakarta. React, TypeScript, Node.js, dan Laravel — proyek nyata dari rancangan sampai rilis.",
      },
      { name: "keywords", content: "fullstack developer, react developer, laravel, portofolio jakarta" },
      { property: "og:title", content: "Rizky Ananda — Fullstack Web Developer" },
      {
        property: "og:description",
        content:
          "Membangun produk web yang cepat, rapi, dan siap produksi. Lihat proyek, skill, dan pengalaman kerja saya.",
      },
      { property: "og:url", content: "https://project--e79122ee.lovable.app/" },
      { name: "twitter:title", content: "Rizky Ananda — Fullstack Web Developer" },
      {
        name: "twitter:description",
        content:
          "Portofolio fullstack developer: proyek React, Node.js, dan Laravel dari rancangan sampai rilis.",
      },
    ],
    links: [{ rel: "canonical", href: "https://project--e79122ee.lovable.app/" }],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { data } = usePortfolioContent();
  if (!data) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero profile={data.profile} />
        <About profile={data.profile} />
        <Skills skills={data.skills} />
        <Projects projects={data.projects} />
        <ExperienceTimeline experiences={data.experiences} />
        <Testimonials testimonials={data.testimonials} />
        <Blog articles={data.articles} />
        <Contact profile={data.profile} />
      </main>
      <Footer profile={data.profile} />
    </div>
  );
}
