import React from "react";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { useBrandStore } from "@/store/brandStore";

const GRAYSCALE_FILTER =
  "grayscale(100%) brightness(0.65) contrast(1.15)";

function BrandLogoItem({ name, logoUrl }: { name: string; logoUrl: string }) {
  if (logoUrl) {
    return (
      <div className="flex h-10 min-w-[110px] max-w-[150px] items-center justify-center px-3 py-1 rounded-xl bg-card/40 border border-border/40 hover:border-primary/50 transition-all duration-300">
        <img
          src={logoUrl}
          alt={name}
          className="max-h-7 max-w-[120px] object-contain transition-all duration-300 group-hover:brightness-100 group-hover:grayscale-0"
          style={{ filter: GRAYSCALE_FILTER }}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="flex h-10 items-center justify-center px-4 rounded-xl bg-card/40 border border-border/40 font-display text-xs font-semibold tracking-wider text-muted-foreground uppercase hover:text-primary transition-colors">
      {name}
    </div>
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
    <section className="relative w-full border-t border-b border-border/60 bg-surface/40 py-10 overflow-hidden select-none">
      {/* Background grid */}
      <div className="absolute inset-0 grid-backdrop opacity-15 pointer-events-none" />

      {/* Tagline */}
      <div className="relative mx-auto mb-6 text-center px-4">
        <p className="text-[11px] font-mono font-medium tracking-[0.25em] text-muted-foreground uppercase">
          Bagian dari Organisasi, Pengalaman Bekerja Sama &amp; Alat Industri
        </p>
      </div>

      {/* InfiniteSlider dengan ProgressiveBlur */}
      <div className="relative h-[80px] w-full overflow-hidden flex items-center">
        <InfiniteSlider
          className="flex h-full w-full items-center"
          duration={35}
          gap={42}
        >
          {brands.map((brand, idx) => (
            <div
              key={`${brand.id}-${idx}`}
              className="group flex items-center cursor-default transition-transform duration-200 hover:scale-105"
            >
              <BrandLogoItem name={brand.name} logoUrl={brand.logoUrl} />
            </div>
          ))}
        </InfiniteSlider>

        {/* Progressive Blur di sisi kiri dan kanan */}
        <ProgressiveBlur
          className="pointer-events-none absolute top-0 left-0 h-full w-[120px] sm:w-[220px] z-10"
          direction="left"
          blurIntensity={0.8}
        />
        <ProgressiveBlur
          className="pointer-events-none absolute top-0 right-0 h-full w-[120px] sm:w-[220px] z-10"
          direction="right"
          blurIntensity={0.8}
        />
      </div>
    </section>
  );
}

export default BrandMarquee;
