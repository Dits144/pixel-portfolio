import React from "react";
import { motion, useInView } from "motion/react";
import { Reveal, Section, SectionHeading } from "@/components/landing/section";
import { Badge } from "@/components/ui/badge";
import { getSkillIcon } from "@/components/icons/skill-icons";
import {
  CircularProgress,
  CircularProgressIndicator,
  CircularProgressRange,
  CircularProgressTrack,
} from "@/components/ui/circular-progress";
import type { Skill, SkillCategory } from "@/types";

const categories: SkillCategory[] = [
  "Cyber Security",
  "Frontend",
  "Backend",
  "Database",
  "DevOps/Tools",
];

// Color mapping for skill category circles
const categoryColors: Record<SkillCategory, { track: string; range: string; text: string }> = {
  "Cyber Security": {
    track: "text-sky-500/20",
    range: "text-sky-400",
    text: "text-sky-400",
  },
  Frontend: {
    track: "text-indigo-500/20",
    range: "text-indigo-400",
    text: "text-indigo-400",
  },
  Backend: {
    track: "text-emerald-500/20",
    range: "text-emerald-400",
    text: "text-emerald-400",
  },
  Database: {
    track: "text-amber-500/20",
    range: "text-amber-400",
    text: "text-amber-400",
  },
  "DevOps/Tools": {
    track: "text-rose-500/20",
    range: "text-rose-400",
    text: "text-rose-400",
  },
};

function SkillCircularCard({
  skill,
  category,
  index,
}: {
  skill: Skill;
  category: SkillCategory;
  index: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [animatedValue, setAnimatedValue] = React.useState(0);
  const theme = categoryColors[category] || categoryColors["Cyber Security"];
  const Icon = getSkillIcon(skill.name);

  React.useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      setAnimatedValue(skill.percentage);
    }, index * 80);
    return () => clearTimeout(timer);
  }, [isInView, skill.percentage, index]);

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center justify-between p-4 rounded-xl border border-border/60 bg-card/60 hover:bg-card/90 hover:border-primary/40 transition-all duration-300 group shadow-sm"
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <div className="relative flex items-center justify-center my-1">
        <CircularProgress value={animatedValue} size={78} thickness={5.5}>
          <CircularProgressIndicator>
            <CircularProgressTrack className={theme.track} />
            <CircularProgressRange className={theme.range} />
          </CircularProgressIndicator>
        </CircularProgress>

        {/* Center Skill Logo Icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:scale-110 transition-transform duration-300">
          <Icon size={24} className="text-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>

      <div className="text-center mt-2.5 w-full">
        <h4 className="font-medium text-xs sm:text-sm text-foreground truncate px-1" title={skill.name}>
          {skill.name}
        </h4>
        <div className="flex items-center justify-center gap-1.5 mt-0.5">
          <span className="font-mono text-[10px] text-muted-foreground">
            {animatedValue}%
          </span>
          <span className="text-[10px] text-muted-foreground/40">·</span>
          <span className="font-mono text-[10px] text-primary/80">
            {skill.level}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function Skills({ skills }: { skills: Skill[] }) {
  return (
    <Section id="skills" className="bg-surface/40">
      <SectionHeading
        eyebrow="Tech stack"
        title="Perkakas yang saya pakai sehari-hari"
        description="Kemampuan diuji dari proyek nyata di lingkungan produksi dan keamanan siber."
      />

      <div className="mt-14 space-y-10">
        {categories.map((category, i) => {
          const items = skills.filter((s) => s.category === category);
          if (!items.length) return null;

          return (
            <Reveal key={category} delay={i * 0.08}>
              <div className="glow-ring rounded-2xl border border-border bg-card/70 p-6 shadow-card">
                <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="size-2 rounded-full bg-primary" />
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {category}
                    </h3>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {items.length} skills
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                  {items.map((skill, index) => (
                    <SkillCircularCard
                      key={skill.id}
                      skill={skill}
                      category={category}
                      index={index}
                    />
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

export default Skills;
