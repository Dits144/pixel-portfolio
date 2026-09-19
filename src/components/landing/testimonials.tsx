import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Reveal, Section, SectionHeading } from "@/components/landing/section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (step: number) => {
      if (!testimonials.length) return;
      setState(([current]) => [
        (current + step + testimonials.length) % testimonials.length,
        step,
      ]);
    },
    [testimonials.length],
  );

  useEffect(() => {
    if (paused || testimonials.length < 2) return;
    const timer = setInterval(() => go(1), 6000);
    return () => clearInterval(timer);
  }, [go, paused, testimonials.length]);

  if (!testimonials.length) return null;
  const active = testimonials[Math.min(index, testimonials.length - 1)];
  if (!active) return null;

  return (
    <Section id="testimonials">
      <SectionHeading
        eyebrow="Kata mereka"
        title="Testimoni dari klien & rekan kerja"
        description="Penilaian setelah bekerja sama nyata, bukan sekadar formalitas."
      />

      <Reveal
        className="relative mx-auto mt-14 max-w-3xl"
      >
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-card sm:p-12"
        >
          <Quote className="absolute -top-2 right-6 size-16 text-primary/10" />

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active.id}
              custom={direction}
              initial={{ opacity: 0, x: direction >= 0 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction >= 0 ? -40 : 40 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex gap-1" aria-label={`Penilaian ${active.rating} dari 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-4",
                      i < active.rating ? "fill-warning text-warning" : "text-muted-foreground/40",
                    )}
                  />
                ))}
              </div>

              <p className="mt-6 text-lg leading-relaxed text-foreground sm:text-xl">
                “{active.content}”
              </p>

              <div className="mt-8 flex items-center gap-4">
                <img
                  src={active.photo}
                  alt={`Foto ${active.name}`}
                  loading="lazy"
                  width={56}
                  height={56}
                  className="size-14 rounded-full border border-border object-cover"
                />
                <div>
                  <p className="font-display font-semibold">{active.name}</p>
                  <p className="text-sm text-muted-foreground">{active.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => go(-1)}
            aria-label="Testimoni sebelumnya"
          >
            <ChevronLeft className="size-4" />
          </Button>

          <div className="flex items-center gap-2">
            {testimonials.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setState([i, i > index ? 1 : -1])}
                aria-label={`Lihat testimoni ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index ? "w-7 bg-gradient-brand" : "w-2 bg-muted hover:bg-border",
                )}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => go(1)}
            aria-label="Testimoni berikutnya"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
