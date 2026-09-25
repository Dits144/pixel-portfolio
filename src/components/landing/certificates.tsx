import { motion } from "motion/react";
import {
  Award,
  Calendar,
  CheckCircle2,
  Copy,
  ExternalLink,
  Eye,
  FileCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Reveal, Section, SectionHeading } from "@/components/landing/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CoverflowCarousel, type CoverflowSlide } from "@/components/ui/coverflow-carousel";
import { mockCertificates } from "@/mock-data";
import type { Certificate, CertificateCategory } from "@/types";

const categories: Array<"Semua" | CertificateCategory> = [
  "Semua",
  "Cyber Security",
  "Networking",
  "Fullstack",
];

export function Certificates({ certificates }: { certificates: Certificate[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);

  const certList = certificates && certificates.length > 0 ? certificates : mockCertificates;

  const filtered = useMemo(() => {
    if (selectedCategory === "Semua") return certList;
    return certList.filter((c) => c.category === selectedCategory);
  }, [certList, selectedCategory]);

  // Convert to CoverflowSlide format
  const slides: CoverflowSlide[] = useMemo(() => {
    return filtered.map((c) => ({
      src: c.image || "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=1200&q=80",
      alt: c.title,
      title: c.title,
      subtitle: `${c.issuer} • ${c.issueDate}`,
      meta: c.category,
      badge: c.category,
      raw: c,
    }));
  }, [filtered]);

  const copyCredId = (id?: string) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    toast.success(`ID Kredensial "${id}" disalin ke clipboard.`);
  };

  if (!certList.length) return null;

  return (
    <Section id="certificates" className="bg-surface/40 relative overflow-hidden py-24">
      <SectionHeading
        eyebrow="Kredensial & Lisensi"
        title="Sertifikasi Resmi & Keahlian Teruji"
        description="Bukti validasi kompetensi nasional BNSP, standar industri keamanan siber, dan rekayasa web modern."
      />

      {/* Category Filter Pills */}
      <Reveal className="mt-8 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-5 py-2 text-xs font-medium transition-all ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground shadow-glow"
                : "border border-border bg-card/70 text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </Reveal>

      {/* 3D Coverflow Carousel Showcase */}
      <Reveal className="mt-6">
        <CoverflowCarousel
          slides={slides}
          autoPlay={true}
          interval={5000}
          onSelect={(slide) => {
            if (slide.raw) {
              setActiveCert(slide.raw as Certificate);
            }
          }}
        />
      </Reveal>

      {/* Modal Dialog for detailed inspection */}
      <Dialog open={!!activeCert} onOpenChange={(open) => !open && setActiveCert(null)}>
        <DialogContent className="max-w-3xl overflow-hidden p-0">
          {activeCert && (
            <div>
              {/* Image Preview Banner */}
              <div className="relative max-h-[360px] w-full overflow-hidden bg-surface">
                {activeCert.image ? (
                  <img
                    src={activeCert.image}
                    alt={activeCert.title}
                    className="h-full w-full object-contain bg-black/40"
                  />
                ) : (
                  <div className="flex h-56 w-full items-center justify-center">
                    <Award className="size-20 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                    {activeCert.category}
                  </Badge>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="p-6 sm:p-8">
                <DialogHeader>
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <span>{activeCert.issuer}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {activeCert.issueDate}
                    </span>
                    {activeCert.expiryDate && (
                      <>
                        <span>•</span>
                        <span>Berlaku s/d {activeCert.expiryDate}</span>
                      </>
                    )}
                  </div>
                  <DialogTitle className="mt-2 text-xl font-bold sm:text-2xl">
                    {activeCert.title}
                  </DialogTitle>
                  <DialogDescription className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {activeCert.description ||
                      "Sertifikasi kompetensi resmi yang diterbitkan oleh lembaga berwenang untuk memvalidasi keahlian teknis profesional."}
                  </DialogDescription>
                </DialogHeader>

                {/* Skills gained */}
                {activeCert.skills && activeCert.skills.length > 0 && (
                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Kompetensi Terverifikasi:
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {activeCert.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-foreground"
                        >
                          <CheckCircle2 className="size-3 text-success" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Credential ID & Actions */}
                <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                  {activeCert.credentialId ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">ID Kredensial:</span>
                      <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono text-foreground font-semibold">
                        {activeCert.credentialId}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7"
                        title="Salin ID Kredensial"
                        onClick={() => copyCredId(activeCert.credentialId)}
                      >
                        <Copy className="size-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-2">
                    {activeCert.credentialUrl && (
                      <Button asChild size="sm" className="gap-1.5 shadow-glow">
                        <a
                          href={activeCert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileCheck className="size-4" />
                          Verifikasi Kredensial
                          <ExternalLink className="size-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Section>
  );
}
