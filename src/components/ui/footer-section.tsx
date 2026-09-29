"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Github, Instagram, Linkedin, MessageCircle, Send, Phone, Mail, ArrowUp } from "lucide-react";
import logoImg from "@/assets/logo.jpg";
import type { Profile } from "@/types";

export interface FooterSectionProps {
  profile?: Profile;
}

export function FooterSection({ profile }: FooterSectionProps) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { href: "#hero", label: "Beranda" },
    { href: "#about", label: "Tentang Saya" },
    { href: "#skills", label: "Tech Stack" },
    { href: "#certificates", label: "Sertifikasi" },
    { href: "#projects", label: "Proyek Unggulan" },
    { href: "#experience", label: "Jejak Karir" },
    { href: "#testimonials", label: "Testimoni" },
    { href: "#contact", label: "Kontak" },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      href: profile?.socials?.github || "https://github.com/dits144",
      icon: Github,
    },
    {
      name: "LinkedIn",
      href: profile?.socials?.linkedin || "https://linkedin.com/in/mradityaanwar",
      icon: Linkedin,
    },
    {
      name: "Instagram",
      href: profile?.socials?.instagram || "https://www.instagram.com/raa__dits/",
      icon: Instagram,
    },
    {
      name: "WhatsApp",
      href: profile?.socials?.whatsapp || "https://wa.me/6285882846665",
      icon: MessageCircle,
    },
  ];

  return (
    <footer className="relative border-t border-border/60 bg-surface/70 text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8 max-w-6xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Kolom 1: Brand & Tagline */}
          <div className="relative flex flex-col gap-3">
            <a href="#hero" className="inline-flex items-center gap-2.5 font-display text-lg font-bold">
              <img
                src={logoImg}
                alt="Raditya.tech"
                className="size-8 rounded-lg object-cover border border-primary/40 shadow-sm"
              />
              <span className="text-gradient">Raditya.tech</span>
            </a>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {profile?.tagline ||
                "Spesialis Teknologi Informasi & Keamanan Siber — berfokus pada pertahanan sistem, arsitektur jaringan aman, dan web engineering modern."}
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs font-mono text-primary">
              <span className="size-2 rounded-full bg-success animate-pulse" />
              Tersedia untuk konsultasi &amp; kolaborasi
            </div>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div>
            <h3 className="mb-4 text-sm font-semibold font-display tracking-wider uppercase text-foreground">
              Navigasi Cepat
            </h3>
            <nav className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors py-1"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Kolom 3: Kontak Langsung */}
          <div>
            <h3 className="mb-4 text-sm font-semibold font-display tracking-wider uppercase text-foreground">
              Kontak Langsung
            </h3>
            <address className="space-y-2.5 text-xs sm:text-sm not-italic text-muted-foreground">
              <p className="flex items-center gap-2">
                <Mail className="size-4 text-primary shrink-0" />
                <a href={`mailto:${profile?.email || "dits144@gmail.com"}`} className="hover:text-foreground transition-colors">
                  {profile?.email || "dits144@gmail.com"}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="size-4 text-primary shrink-0" />
                <a href={`tel:${profile?.phone?.replace(/\s+/g, '') || "085882846665"}`} className="hover:text-foreground transition-colors font-mono">
                  {profile?.phone || "0858 8284 6665"}
                </a>
              </p>
              <p className="text-xs text-muted-foreground pt-1">
                {profile?.location || "Kabupaten Bogor, Jawa Barat, Indonesia"}
              </p>
            </address>
          </div>

          {/* Kolom 4: Media Sosial & Back to top */}
          <div className="relative flex flex-col justify-between">
            <div>
              <h3 className="mb-4 text-sm font-semibold font-display tracking-wider uppercase text-foreground">
                Media Sosial
              </h3>
              <div className="flex flex-wrap gap-2.5 mb-6">
                <TooltipProvider>
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <Tooltip key={social.name}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-9 rounded-xl border-border bg-card/80 hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
                            asChild
                          >
                            <a
                              href={social.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={social.name}
                            >
                              <Icon className="size-4" />
                            </a>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{social.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </TooltipProvider>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={scrollToTop}
              className="w-fit rounded-xl gap-2 text-xs border-border bg-card/60 hover:border-primary/40 hover:text-primary"
            >
              <ArrowUp className="size-3.5" />
              Kembali ke Atas
            </Button>
          </div>
        </div>

        {/* Baris Bawah */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-center text-xs text-muted-foreground md:flex-row">
          <p>© {currentYear} Muhammad Raditya Anwar (Raditya.tech). Hak cipta dilindungi.</p>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>BNSP Certified Junior Network Administrator</span>
            <span>·</span>
            <span className="text-primary">Cyber Security Specialist</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;
