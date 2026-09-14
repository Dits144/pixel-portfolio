import { motion, useInView } from "motion/react";
import { MapPin, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Reveal, Section, SectionHeading } from "@/components/landing/section";
import type { Profile } from "@/types";

function Counter({ value, suffix = "+" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <span ref={ref} className="text-gradient font-display text-4xl font-bold">
      {display}
      {suffix}
    </span>
  );
}

export function About({ profile }: { profile: Profile }) {
  const stats = [
    { label: "Tahun pengalaman", value: profile.stats.yearsExperience },
    { label: "Proyek selesai", value: profile.stats.projects },
    { label: "Klien puas", value: profile.stats.clients },
  ];

  return (
    <Section id="about">
      <SectionHeading
        eyebrow="Tentang saya"
        title="Developer yang peduli detail, bukan sekadar fitur jadi"
      />

      <div className="mt-14 grid items-center gap-10 lg:grid-cols-[380px_1fr] lg:gap-16">
        <Reveal>
          <div className="relative mx-auto max-w-xs lg:max-w-none">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-brand opacity-25 blur-2xl" />
            <motion.img
              whileHover={{ scale: 1.02, rotate: -1 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              src={profile.photo}
              alt={`Foto profil ${profile.name}`}
              loading="lazy"
              width={768}
              height={896}
              className="relative w-full rounded-3xl border border-border object-cover shadow-card"
            />
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            {profile.about}
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-primary" /> {profile.location}
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail className="size-4 text-primary" /> {profile.email}
            </span>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glow-ring rounded-2xl border border-border bg-surface p-4 text-center sm:p-6"
              >
                <Counter value={stat.value} />
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
