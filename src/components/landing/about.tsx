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

/** Custom front face: dark cyber-themed ID card */
function CardFront({ s }: { s: number }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: "#0a0f1a", color: "#38bdf8" }}
    >
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)",
          backgroundSize: `${20 * s}px ${20 * s}px`,
        }}
      />
      {/* Glowing accent bar top */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: 4 * s, background: "linear-gradient(90deg, #38bdf8, #818cf8, #38bdf8)" }}
      />
      {/* Logo area */}
      <div
        className="absolute"
        style={{ top: 18 * s, left: 18 * s, right: 18 * s }}
      >
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: 13 * s,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#38bdf8",
            lineHeight: 1,
          }}
        >
          RADITYA<span style={{ color: "#818cf8" }}>.TECH</span>
        </div>
        <div
          style={{
            fontSize: 5.5 * s,
            marginTop: 3 * s,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#64748b",
          }}
        >
          PORTFOLIO · ID CARD · 2026
        </div>
      </div>
      {/* Center hex icon */}
      <div
        className="absolute"
        style={{ top: "38%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        <svg
          viewBox="0 0 80 80"
          style={{ width: 60 * s, height: 60 * s }}
          fill="none"
          stroke="#38bdf8"
          strokeWidth={1.5}
        >
          <polygon points="40,5 72,22.5 72,57.5 40,75 8,57.5 8,22.5" opacity={0.4} />
          <polygon points="40,14 64,27.5 64,52.5 40,66 16,52.5 16,27.5" opacity={0.7} />
          <text
            x="40"
            y="46"
            textAnchor="middle"
            fill="#38bdf8"
            fontSize={22}
            fontWeight="bold"
            fontFamily={DISPLAY}
            stroke="none"
          >
            RA
          </text>
        </svg>
      </div>
      {/* Bottom bar with name */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "36%",
          background: "linear-gradient(180deg, transparent, #0d1425)",
          paddingLeft: 18 * s,
          paddingRight: 18 * s,
          paddingBottom: 16 * s,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 14.5 * s,
            lineHeight: 1.05,
            textTransform: "uppercase",
            color: "#f1f5f9",
          }}
        >
          MUHAMMAD
          <br />
          RADITYA ANWAR
        </div>
        <div
          style={{
            fontSize: 6 * s,
            marginTop: 4 * s,
            letterSpacing: "0.12em",
            color: "#38bdf8",
            textTransform: "uppercase",
          }}
        >
          Cyber Security · Fullstack Dev
        </div>
        <div
          style={{
            marginTop: 8 * s,
            height: 1.5,
            background: "linear-gradient(90deg, #38bdf8, transparent)",
          }}
        />
      </div>
    </div>
  );
}

/** Custom back face: contact & info */
function CardBack({ s }: { s: number }) {
  const rows = [
    { icon: "📧", text: "dits144@gmail.com" },
    { icon: "📱", text: "0858 8284 6665" },
    { icon: "📍", text: "Kabupaten Bogor, Jabar" },
    { icon: "🎓", text: "S1 Teknik Informatika" },
    { icon: "🏛️", text: "STT Terpadu Nurul Fikri" },
    { icon: "🔐", text: "BNSP Jr. Network Admin" },
  ];
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: "#060c18", color: "#f1f5f9" }}
    >
      {/* Top accent */}
      <div
        style={{ height: 4 * s, background: "linear-gradient(90deg, #818cf8, #38bdf8, #818cf8)" }}
      />
      {/* Header */}
      <div style={{ padding: `${14 * s}px ${16 * s}px ${8 * s}px` }}>
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: 10 * s,
            letterSpacing: "0.18em",
            color: "#38bdf8",
            textTransform: "uppercase",
          }}
        >
          KONTAK & INFO
        </div>
        <div
          style={{
            width: 30 * s,
            height: 1.5,
            background: "#38bdf8",
            marginTop: 5 * s,
            borderRadius: 2,
          }}
        />
      </div>
      {/* Info rows */}
      <div
        style={{
          padding: `0 ${16 * s}px`,
          display: "flex",
          flexDirection: "column",
          gap: 7 * s,
        }}
      >
        {rows.map((row) => (
          <div
            key={row.text}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 7 * s,
              fontSize: 6.8 * s,
              lineHeight: 1.3,
            }}
          >
            <span style={{ fontSize: 8 * s, flexShrink: 0, marginTop: 1 }}>{row.icon}</span>
            <span style={{ color: "#cbd5e1" }}>{row.text}</span>
          </div>
        ))}
      </div>
      {/* Bottom QR-like decoration */}
      <div className="absolute bottom-0 right-0" style={{ padding: 12 * s }}>
        <svg
          viewBox="0 0 40 40"
          style={{ width: 36 * s, height: 36 * s, opacity: 0.25 }}
          fill="#38bdf8"
        >
          <rect x="0" y="0" width="16" height="16" rx="2" />
          <rect x="4" y="4" width="8" height="8" fill="#060c18" />
          <rect x="24" y="0" width="16" height="16" rx="2" />
          <rect x="28" y="4" width="8" height="8" fill="#060c18" />
          <rect x="0" y="24" width="16" height="16" rx="2" />
          <rect x="4" y="28" width="8" height="8" fill="#060c18" />
          <rect x="24" y="24" width="4" height="4" />
          <rect x="32" y="24" width="4" height="4" />
          <rect x="24" y="32" width="4" height="4" />
          <rect x="32" y="32" width="4" height="4" />
          <rect x="20" y="18" width="4" height="4" />
          <rect x="18" y="24" width="4" height="4" />
        </svg>
      </div>
      {/* Social links */}
      <div
        className="absolute bottom-0 left-0"
        style={{ padding: `0 ${16 * s}px ${12 * s}px` }}
      >
        <div style={{ fontSize: 5.5 * s, color: "#475569", letterSpacing: "0.1em" }}>
          github.com/dits144
        </div>
        <div style={{ fontSize: 5.5 * s, color: "#475569", letterSpacing: "0.1em" }}>
          linkedin.com/in/mradityaanwar
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
              front={<CardFront s={s} />}
              back={<CardBack s={s} />}
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
