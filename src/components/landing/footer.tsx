import { ArrowUp, Github, Instagram, Linkedin, Mail, Phone } from "lucide-react";

import logoImg from "@/assets/logo.jpg";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types";

const links = [
  { href: "#about", label: "Tentang" },
  { href: "#skills", label: "Skill" },
  { href: "#certificates", label: "Sertifikat" },
  { href: "#projects", label: "Proyek" },
  { href: "#experience", label: "Pengalaman" },
  { href: "#contact", label: "Kontak" },
];

export function Footer({ profile }: { profile: Profile }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-surface/80 px-4 py-12 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="text-center sm:text-left">
          <a href="#hero" className="inline-flex items-center gap-2.5 font-display text-lg font-bold">
            <img
              src={logoImg}
              alt="Raditya.tech"
              className="size-8 rounded-lg object-cover border border-primary/40 shadow-sm"
            />
            <span className="text-gradient">Raditya.tech</span>
          </a>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {profile.tagline}
          </p>

          {/* User Personal Information in Footer */}
          <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center justify-center gap-2 font-mono sm:justify-start">
              <span className="inline-flex items-center gap-1 text-foreground font-semibold">
                <Phone className="size-3.5 text-primary" /> 0858 8284 6665
              </span>
              <span>|</span>
              <a
                href="mailto:dits144@gmail.com"
                className="inline-flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Mail className="size-3.5 text-primary" /> dits144@gmail.com
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs sm:justify-start">
              <a
                href="https://linkedin.com/in/mradityaanwar"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="size-3.5 text-blue-500" />
                <span>linkedin.com/in/mradityaanwar</span>
              </a>
              <span>|</span>
              <a
                href="https://github.com/dits144"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="size-3.5" />
                <span>github.com/dits144</span>
              </a>
              <span>|</span>
              <a
                href="https://www.instagram.com/raa__dits/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="size-3.5 text-pink-500" />
                <span>@raa__dits</span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-end gap-4">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <Button
            variant="outline"
            size="icon"
            aria-label="Kembali ke atas"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="shadow-sm hover:border-primary"
          >
            <ArrowUp className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-10 flex w-full max-w-6xl flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
        <p>
          © {year} {profile.name} · Raditya.tech. Dibuat dengan React & Tailwind CSS.
        </p>
        <p className="font-mono text-primary flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          status: open for work
        </p>
      </div>
    </footer>
  );
}
