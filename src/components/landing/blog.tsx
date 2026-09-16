import { motion } from "motion/react";
import { Clock, PenLine } from "lucide-react";

import { Reveal, Section, SectionHeading } from "@/components/landing/section";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/types";

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
  );

export function Blog({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <Section id="blog" className="bg-surface/40">
      <SectionHeading
        eyebrow="Catatan teknis"
        title="Artikel singkat dari meja kerja"
        description="Tulisan tentang keputusan teknis yang saya ambil di proyek sehari-hari."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {articles.map((article, index) => (
          <Reveal key={article.id} delay={index * 0.08}>
            <motion.article
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="glow-ring flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-primary/40 text-primary">
                  {article.tag}
                </Badge>
                <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                  <Clock className="size-3.5" /> {article.readingMinutes} mnt
                </span>
              </div>

              <h3 className="mt-4 font-display text-lg leading-snug font-semibold">
                {article.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {article.excerpt}
              </p>

              <p className="mt-6 border-t border-border pt-4 font-mono text-xs text-muted-foreground">
                {formatDate(article.date)}
              </p>
            </motion.article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10 flex justify-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
          <PenLine className="size-4 text-primary" />
          Arsip artikel lengkap akan menyusul.
        </p>
      </Reveal>
    </Section>
  );
}
