import React from "react";
import { Marquee } from "@/components/ui/3d-testimonails";
import { useBrandStore } from "@/store/brandStore";
import { ImageOff } from "lucide-react";

const GRAYSCALE_FILTER =
  "grayscale(100%) brightness(0.55) contrast(1.15)";

function BrandLogo({ name, logoUrl }: { name: string; logoUrl: string }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className="h-7 max-w-[90px] object-contain transition-all duration-300 group-hover:opacity-100"
        style={{ filter: GRAYSCALE_FILTER }}
        loading="lazy"
      />
    );
  }
  // Fallback: styled text logo
  return (
    <span
      className="font-display text-sm font-bold tracking-tight"
      style={{ filter: GRAYSCALE_FILTER, opacity: 0.7 }}
    >
      {name}
    </span>
  );
}

export function BrandMarquee() {
  const allBrands = useBrandStore((s) => s.brands);
  const brands = React.useMemo(() => {
    return (allBrands || [])
      .filter((b) => b.active)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [allBrands]);

  if (brands.length === 0) return null;

  return (
    <section className="relative w-full border-t border-b border-border/60 bg-surface/50 py-9 overflow-hidden select-none">
      {/* Grid backdrop */}
      <div className="absolute inset-0 grid-backdrop opacity-20 pointer-events-none" />

      {/* Tagline */}
      <div className="relative mx-auto mb-5 text-center px-4">
        <p className="text-[11px] font-mono font-medium tracking-[0.22em] text-muted-foreground uppercase">
          Collaborated with Institutions, Industry Tools &amp; Frameworks
        </p>
      </div>

      {/* Marquee */}
      <div className="relative flex w-full items-center overflow-hidden">
        <Marquee pauseOnHover repeat={4} className="[--duration:38s] [--gap:2.5rem]">
          {brands.map((brand, index) => (
            <div
              key={`${brand.id}-${index}`}
              className="group flex items-center gap-3 px-5 py-2 cursor-default transition-transform duration-200 hover:scale-105"
            >
              {/* Logo / icon area */}
              <div className="flex min-h-[2rem] items-center justify-center">
                <BrandLogo name={brand.name} logoUrl={brand.logoUrl} />
              </div>

              {/* Divider dot */}
              <div className="size-1 rounded-full bg-border/60 group-hover:bg-primary/40 transition-colors" />
            </div>
          ))}
        </Marquee>

        {/* Ambient fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-36 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-36 bg-gradient-to-l from-background via-background/80 to-transparent z-10" />
      </div>
    </section>
  );
}
