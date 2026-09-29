import { useInView } from "motion/react";
import { MapPin, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Reveal, Section, SectionHeading } from "@/components/landing/section";
import LanyardBadge from "@/components/ui/lanyard-badge";
import type { Profile } from "@/types";

const DISPLAY = '"Oswald", "Bebas Neue", "Arial Narrow", Impact, sans-serif';

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

/** Custom front face: dark cyber-themed ID card dengan foto full */
function CardFront({ s, photo }: { s: number; photo: string }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden flex flex-col justify-between"
      style={{ background: "#0a0f1a" }}
    >
      {/* Foto Utama Full Cover */}
      <img
        src={photo}
        alt="Muhammad Raditya Anwar"
        className="absolute inset-0 size-full object-cover object-center"
      />

      {/* Subtle Dark Vignette & Cyber Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent to-black/90 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)",
          backgroundSize: `${16 * s}px ${16 * s}px`,
        }}
      />

      {/* Glowing accent bar top */}
      <div
        className="absolute top-0 left-0 right-0 z-20"
        style={{ height: 4 * s, background: "linear-gradient(90deg, #38bdf8, #818cf8, #38bdf8)" }}
      />

      {/* Header Badge */}
      <div 
        className="relative flex items-center justify-between z-10"
        style={{ padding: `${16 * s}px ${14 * s}px 0` }}
      >
        <div className="backdrop-blur-md bg-black/40 px-2 py-1 rounded-md border border-white/10">
          <div
            style={{
              fontFamily: DISPLAY,
              fontWeight: 900,
              fontSize: 12 * s,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#38bdf8",
              lineHeight: 1,
            }}
          >
            RADITYA<span style={{ color: "#818cf8" }}>.TECH</span>
          </div>
          <div
            style={{
              fontSize: 5 * s,
              marginTop: 2 * s,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#cbd5e1",
            }}
          >
            VERIFIED ID CARD · 2026
          </div>
        </div>

        <div 
          className="rounded px-1.5 py-0.5 font-mono text-[8px] font-bold border border-primary/40 bg-black/50 text-primary backdrop-blur-md"
        >
          SECURITY
        </div>
      </div>

      {/* Bottom bar with full name and roles */}
      <div
        className="relative z-10 border-t border-white/15"
        style={{
          background: "linear-gradient(to top, rgba(6, 12, 24, 0.96) 80%, transparent)",
          backdropFilter: "blur(8px)",
          padding: `${12 * s}px ${12 * s}px ${16 * s}px`,
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 13.5 * s,
            lineHeight: 1.15,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#f8fafc",
            textAlign: "center",
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          MUHAMMAD RADITYA ANWAR
        </div>
        <div
          style={{
            fontSize: 6.5 * s,
            marginTop: 4 * s,
            letterSpacing: "0.12em",
            color: "#38bdf8",
            textTransform: "uppercase",
            textAlign: "center",
            fontWeight: 600,
            textShadow: "0 1px 4px rgba(0,0,0,0.8)",
          }}
        >
          Cyber Security Specialist &amp; Fullstack Dev
        </div>
        <div className="mt-2 flex items-center justify-center gap-2 font-mono text-[8px] text-slate-400">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>AUTHENTIC CREDENTIAL</span>
        </div>
      </div>
    </div>
  );
}

/** Custom back face: full logo dengan nama lengkap */
function CardBack({ s, logo }: { s: number; logo: string }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden flex flex-col items-center justify-between"
      style={{ background: "#060c18", color: "#f1f5f9", padding: `${16 * s}px` }}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: 4 * s, background: "linear-gradient(90deg, #818cf8, #38bdf8, #818cf8)" }}
      />

      {/* Header */}
      <div className="w-full flex items-center justify-between text-[8px] font-mono text-slate-400 tracking-wider pt-2">
        <span>AUTHENTIC BADGE</span>
        <span className="text-primary font-bold">RADITYA.TECH</span>
      </div>

      {/* Center Big Logo */}
      <div className="flex flex-col items-center justify-center gap-2.5">
        <div
          className="rounded-2xl overflow-hidden p-1 shadow-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(56,189,248,0.6), rgba(129,140,248,0.6))",
            boxShadow: "0 0 24px rgba(56, 189, 248, 0.35)",
          }}
        >
          <img
            src={logo}
            alt="Raditya Tech Logo"
            style={{
              width: 135 * s,
              height: 135 * s,
              objectFit: "cover",
              borderRadius: 14 * s,
              display: "block",
            }}
          />
        </div>
        <div className="text-center mt-1">
          <div className="font-display font-bold text-sm tracking-wider text-slate-100 uppercase">
            MUHAMMAD RADITYA ANWAR
          </div>
          <div className="font-mono text-[9px] text-sky-400 tracking-widest uppercase mt-0.5">
            Cybersec Developer
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="w-full text-center border-t border-white/10 pt-2">
        <div className="font-mono text-[8px] text-slate-400 tracking-wider">
          dits144@gmail.com · 0858 8284 6665
        </div>
      </div>
    </div>
  );
}

export function About({ profile }: { profile: Profile }) {
  const stats = [
    { label: "Tahun pengalaman", value: profile.stats.yearsExperience },
    { label: "Proyek selesai", value: profile.stats.projects },
    { label: "Klien puas", value: profile.stats.clients },
  ];

  const cardWidth = 240;
  const s = cardWidth / 240;

  return (
    <Section id="about">
      <SectionHeading
        eyebrow="Tentang saya"
        title="Developer yang peduli detail, bukan sekadar fitur jadi"
      />

      <div className="mt-14 grid items-start gap-10 lg:grid-cols-[380px_1fr] lg:gap-16">
        {/* ID Card Lanyard */}
        <Reveal>
          <div
            className="relative mx-auto w-full max-w-xs lg:max-w-none"
            style={{ height: 460 }}
          >
            <div className="absolute -inset-3 rounded-3xl bg-gradient-brand opacity-20 blur-2xl" />
            <LanyardBadge
              front={<CardFront s={s} photo={profile.photo || "/logo.jpg"} />}
              back={<CardBack s={s} logo="/logo.jpg" />}
              strapColor="#0d1425"
              inkColor="#38bdf8"
              strapText="raditya.tech · cyber security"
              strapLabel="PORTFOLIO 2026"
              cardWidth={cardWidth}
              height="460px"
              flipButton={true}
              className="rounded-2xl"
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

export default About;
