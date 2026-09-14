import { motion } from "motion/react";

import { Reveal, Section, SectionHeading } from "@/components/landing/section";
import { Badge } from "@/components/ui/badge";
import type { Skill, SkillCategory } from "@/types";

const categories: SkillCategory[] = ["Frontend", "Backend", "Database", "DevOps/Tools"];

export function Skills({ skills }: { skills: Skill[] }) {
  return (
    <Section id="skills" className="bg-surface/40">
      <SectionHeading
        eyebrow="Tech stack"
        title="Perkakas yang saya pakai sehari-hari"
        description="Level ditentukan dari pengalaman nyata di proyek produksi, bukan sekadar tutorial."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {categories.map((category, i) => {
          const items = skills.filter((s) => s.category === category);
          if (!items.length) return null;
          return (
            <Reveal key={category} delay={i * 0.08}>
              <div className="glow-ring h-full rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold">{category}</h3>
                  <Badge variant="secondary">{items.length} skill</Badge>
                </div>

                <div className="space-y-5">
                  {items.map((skill) => (
                    <div key={skill.id}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-medium">
                          <span aria-hidden>{skill.icon}</span>
                          {skill.name}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {skill.level} · {skill.percentage}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.percentage}%` }}
                          viewport={{ once: true, amount: 0.6 }}
                          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full bg-gradient-brand"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
