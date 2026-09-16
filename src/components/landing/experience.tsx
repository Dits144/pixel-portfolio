import { motion } from "motion/react";
import { Briefcase, Building2, GraduationCap } from "lucide-react";
import { useState } from "react";

import { Reveal, Section, SectionHeading } from "@/components/landing/section";
import { cn } from "@/lib/utils";
import type { Experience } from "@/types";

const tabs = [
  { label: "Semua", value: "all" },
  { label: "Kerja", value: "Work" },
  { label: "Organisasi", value: "Organization" },
  { label: "Pendidikan", value: "Education" },
] as const;

const icons = {
  Work: Briefcase,
  Organization: Building2,
  Education: GraduationCap,
};

export function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  const [tab, setTab] = useState<(typeof tabs)[number]["value"]>("all");

  const visible = experiences.filter((item) => tab === "all" || item.type === tab);

  return (
    <Section id="experience" className="bg-surface/40">
      <SectionHeading
        eyebrow="Jejak karier"
        title="Pengalaman kerja & organisasi"
        description="Dari tim kecil di studio sampai memimpin pengembangan produk SaaS."
      />

      <Reveal className="mt-10 flex flex-wrap justify-center gap-2">
        {tabs.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setTab(item.value)}
            aria-pressed={tab === item.value}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              tab === item.value
                ? "border-transparent bg-gradient-brand text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </Reveal>

      <div className="relative mx-auto mt-14 max-w-3xl">
        <div className="absolute top-0 bottom-0 left-4 w-px bg-gradient-to-b from-primary/60 via-border to-transparent sm:left-1/2" />

        <div className="space-y-10">
          {visible.map((item, index) => {
            const Icon = icons[item.type] ?? Briefcase;
            return (
              <Reveal key={item.id} delay={index * 0.06}>
                <div
                  className={cn(
                    "relative pl-12 sm:w-1/2 sm:pl-0",
                    index % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:ml-auto sm:pl-12",
                  )}
                >
                  <motion.span
                    whileHover={{ scale: 1.15 }}
                    className={cn(
                      "absolute top-1 grid size-8 place-items-center rounded-full border border-border bg-card text-primary shadow-card",
                      "left-0 sm:left-auto",
                      index % 2 === 0
                        ? "sm:-right-4 sm:translate-x-1/2"
                        : "sm:-left-4 sm:-translate-x-1/2",
                    )}
                  >
                    <Icon className="size-4" />
                  </motion.span>

                  <div className="glow-ring rounded-2xl border border-border bg-card p-5 shadow-card">
                    <span className="font-mono text-xs tracking-wide text-primary">
                      {item.period}
                    </span>
                    <h3 className="mt-2 font-display text-lg font-semibold">{item.position}</h3>
                    <p className="text-sm text-muted-foreground">{item.company}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {visible.length === 0 ? (
          <p className="relative text-center text-sm text-muted-foreground">
            Belum ada pengalaman di kategori ini.
          </p>
        ) : null}
      </div>
    </Section>
  );
}
