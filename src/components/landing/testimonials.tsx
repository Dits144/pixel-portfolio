import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Marquee } from '@/components/ui/3d-testimonails';
import { Section, SectionHeading } from '@/components/landing/section';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Testimonial } from '@/types';

function TestimonialCard({
  name,
  role,
  content,
  photo,
  rating = 5,
}: {
  name: string;
  role: string;
  content: string;
  photo?: string;
  rating?: number;
}) {
  return (
    <Card className="w-80 shrink-0 p-5 bg-card/85 backdrop-blur-md border-border/80 hover:border-primary/50 transition-all duration-300 hover:shadow-glow group">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-primary/30">
          <AvatarImage src={photo} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
            {name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 overflow-hidden">
          <p className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
            {name}
          </p>
          <p className="text-xs text-muted-foreground truncate">{role}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-3" aria-label={`Rating ${rating} dari 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "size-3.5",
              i < rating ? "fill-warning text-warning" : "text-muted-foreground/30",
            )}
          />
        ))}
      </div>

      <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-4 group-hover:text-foreground/90 transition-colors">
        “{content}”
      </p>
    </Card>
  );
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials || !testimonials.length) return null;

  // Split testimonials across 4 marquee columns
  const col1 = testimonials.filter((_, i) => i % 4 === 0);
  const col2 = testimonials.filter((_, i) => i % 4 === 1);
  const col3 = testimonials.filter((_, i) => i % 4 === 2);
  const col4 = testimonials.filter((_, i) => i % 4 === 3);

  // Fallback if small number of testimonials so every column has items
  const c1 = col1.length ? col1 : testimonials;
  const c2 = col2.length ? col2 : testimonials;
  const c3 = col3.length ? col3 : testimonials;
  const c4 = col4.length ? col4 : testimonials;

  return (
    <Section id="testimonials" className="relative overflow-hidden py-24">
      <SectionHeading
        eyebrow="Kata mereka"
        title="Testimoni dari Klien & Rekan Kerja"
        description="Penilaian setelah bekerja sama nyata, rekayasa keamanan siber dan web modern."
      />

      <div className="relative mt-12 flex h-[580px] w-full flex-row items-center justify-center gap-4 overflow-hidden [perspective:400px]">
        <div
          className="flex flex-row items-center gap-4"
          style={{
            transform:
              'translateX(-100px) translateY(0px) translateZ(-60px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)',
          }}
        >
          {/* Column 1 - downwards */}
          <Marquee vertical pauseOnHover repeat={4} className="[--duration:28s]">
            {c1.map((item, idx) => (
              <TestimonialCard
                key={`c1-${item.id || idx}`}
                name={item.name}
                role={item.role}
                content={item.content}
                photo={item.photo}
                rating={item.rating}
              />
            ))}
          </Marquee>

          {/* Column 2 - reverse (upwards) */}
          <Marquee vertical reverse pauseOnHover repeat={4} className="[--duration:34s]">
            {c2.map((item, idx) => (
              <TestimonialCard
                key={`c2-${item.id || idx}`}
                name={item.name}
                role={item.role}
                content={item.content}
                photo={item.photo}
                rating={item.rating}
              />
            ))}
          </Marquee>

          {/* Column 3 - downwards */}
          <Marquee vertical pauseOnHover repeat={4} className="[--duration:30s]">
            {c3.map((item, idx) => (
              <TestimonialCard
                key={`c3-${item.id || idx}`}
                name={item.name}
                role={item.role}
                content={item.content}
                photo={item.photo}
                rating={item.rating}
              />
            ))}
          </Marquee>

          {/* Column 4 - reverse (upwards) */}
          <Marquee vertical reverse pauseOnHover repeat={4} className="[--duration:36s]">
            {c4.map((item, idx) => (
              <TestimonialCard
                key={`c4-${item.id || idx}`}
                name={item.name}
                role={item.role}
                content={item.content}
                photo={item.photo}
                rating={item.rating}
              />
            ))}
          </Marquee>
        </div>

        {/* Ambient Top, Bottom, Left & Right Fade Gradients */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
      </div>
    </Section>
  );
}
