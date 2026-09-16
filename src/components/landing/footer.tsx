import { ArrowUp, Terminal } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Profile } from "@/types";

const links = [
  { href: "#about", label: "Tentang" },
  { href: "#skills", label: "Skill" },
  { href: "#projects", label: "Proyek" },
  { href: "#experience", label: "Pengalaman" },
  { href: "#contact", label: "Kontak" },
];

export function Footer({ profile }: { profile: Profile }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-surface/60 px-4 py-12 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 sm:flex-row sm:justify-between">
        <div>
          <a href="#hero" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid size-8 place-items-center rounded-lg bg-gradient-brand text-primary-foreground">
              <Terminal className="size-4" />
            </span>
            <span className="text-gradient">rizky.dev</span>
          </a>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            {profile.tagline}
          </p>
        </div>

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
        >
          <ArrowUp className="size-4" />
        </Button>
      </div>

      <div className="mx-auto mt-10 flex w-full max-w-6xl flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
        <p>
          © {year} {profile.name}. Dibuat dengan React, Tailwind CSS, dan banyak kopi.
        </p>
        <p className="font-mono">status: open for work</p>
      </div>
    </footer>
  );
}
