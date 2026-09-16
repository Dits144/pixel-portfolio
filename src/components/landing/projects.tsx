import { AnimatePresence, motion } from "motion/react";
import { ExternalLink, Github, Search, Star } from "lucide-react";
import { useMemo, useState } from "react";

import { Reveal, Section, SectionHeading } from "@/components/landing/section";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Project, ProjectCategory } from "@/types";

const filters: Array<"Semua" | ProjectCategory> = [
  "Semua",
  "Web App",
  "Mobile",
  "API",
  "Landing Page",
];

export function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Semua");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchCategory = filter === "Semua" || project.category === filter;
      const matchQuery =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.techStack.some((tech) => tech.toLowerCase().includes(q));
      return matchCategory && matchQuery;
    });
  }, [filter, projects, query]);

  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Karya pilihan"
        title="Proyek yang saya bangun dari nol sampai rilis"
        description="Tiap kartu berisi peran, teknologi, dan tautan demo. Cari berdasarkan nama atau teknologi."
      />

      <Reveal className="mt-12 flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
        <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                filter === item
                  ? "border-transparent bg-gradient-brand text-primary-foreground shadow-glow"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-xs">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari proyek atau teknologi…"
            aria-label="Cari proyek"
            className="bg-surface pl-9"
          />
        </div>
      </Reveal>

      {visible.length === 0 ? (
        <p className="mt-14 text-center text-sm text-muted-foreground">
          Tidak ada proyek yang cocok dengan pencarian itu.
        </p>
      ) : (
        <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((project, index) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }}
                className="glow-ring group overflow-hidden rounded-2xl border border-border bg-card shadow-card"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={`Tangkapan layar proyek ${project.title}`}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />

                  {project.featured ? (
                    <Badge className="absolute top-3 left-3 gap-1 border-transparent bg-gradient-brand text-primary-foreground">
                      <Star className="size-3 fill-current" /> Unggulan
                    </Badge>
                  ) : null}

                  <div className="absolute inset-x-3 bottom-3 flex translate-y-2 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {project.demoUrl ? (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                      >
                        <ExternalLink className="size-3.5" /> Demo
                      </a>
                    ) : null}
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/90 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
                      >
                        <Github className="size-3.5" /> Kode
                      </a>
                    ) : null}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-lg font-semibold">{project.title}</h3>
                    <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                      {project.createdAt}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="font-normal">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </Section>
  );
}
