import { motion } from "motion/react";
import { ArrowDown, Download, Github, Linkedin, Instagram, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Profile } from "@/types";

function useTypingEffect(words: string[]) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!words.length) return;
    const current = words[index % words.length];
    const done = !deleting && text === current;
    const cleared = deleting && text === "";

    const timeout = setTimeout(
      () => {
        if (done) {
          setDeleting(true);
          return;
        }
        if (cleared) {
          setDeleting(false);
          setIndex((i) => (i + 1) % words.length);
          return;
        }
        setText(
          deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1),
        );
      },
      done ? 1400 : deleting ? 45 : 95,
    );

    return () => clearTimeout(timeout);
  }, [text, deleting, index, words]);

  return text;
}

export function Hero({ profile }: { profile: Profile }) {
  const typed = useTypingEffect(profile.typingWords);

  const socials = [
    { icon: Github, href: profile.socials.github, label: "GitHub" },
    { icon: Linkedin, href: profile.socials.linkedin, label: "LinkedIn" },
    { icon: Instagram, href: profile.socials.instagram, label: "Instagram" },
    { icon: MessageCircle, href: profile.socials.whatsapp, label: "WhatsApp" },
  ];

  return (
    <section id="hero" className="relative overflow-hidden px-4 pt-32 pb-20 sm:px-6 lg:pt-44 lg:pb-28">
      <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-gradient-brand opacity-20 blur-[130px]" />

      <div className="relative mx-auto w-full max-w-6xl text-center">
        <motion.span
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          Tersedia untuk proyek freelance & full-time
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="mt-6 text-4xl font-bold sm:text-6xl lg:text-7xl"
        >
          Halo, saya <span className="text-gradient">{profile.name}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16 }}
          className="mt-4 font-display text-xl font-medium sm:text-3xl"
        >
          {profile.role} <span className="text-muted-foreground">·</span>{" "}
          <span className="font-mono text-primary">{typed}</span>
          <span className="ml-0.5 inline-block h-6 w-[2px] animate-pulse bg-primary align-middle sm:h-8" />
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24 }}
          className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild size="lg" className="shadow-glow">
            <a href="#projects">
              Lihat Proyek <ArrowDown className="ml-1 size-4" />
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => toast.success("CV sedang diunduh (simulasi)", { description: profile.cvFileName })}
          >
            <Download className="mr-1 size-4" /> Download CV
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.42 }}
          className="mt-10 flex items-center justify-center gap-2"
        >
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="glow-ring grid size-11 place-items-center rounded-xl border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icon className="size-[18px]" />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
