import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CoverflowSlide {
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
  meta?: string;
  badge?: string;
  raw?: any;
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  initialIndex?: number;
  className?: string;
  autoPlay?: boolean;
  interval?: number;
  onSelect?: (slide: CoverflowSlide, index: number) => void;
}

export function CoverflowCarousel({
  slides,
  initialIndex = 0,
  className,
  autoPlay = false,
  interval = 4000,
  onSelect,
}: CoverflowCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(
    Math.min(Math.max(0, initialIndex), Math.max(0, slides.length - 1))
  );
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync activeIndex if slides change
  useEffect(() => {
    if (activeIndex >= slides.length) {
      setActiveIndex(Math.max(0, slides.length - 1));
    }
  }, [slides.length, activeIndex]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Autoplay
  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const timer = setInterval(handleNext, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, handleNext, slides.length]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null || !e.changedTouches[0]) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();
    setTouchStart(null);
  };

  if (!slides.length) return null;

  const currentSlide = slides[activeIndex];

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center select-none py-8',
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3D Carousel Stage */}
      <div className="relative w-full h-[380px] sm:h-[460px] md:h-[500px] flex items-center justify-center [perspective:1200px] overflow-hidden">
        {slides.map((slide, index) => {
          const offset = index - activeIndex;
          const isActive = index === activeIndex;

          // Only render elements within a 3-distance radius for optimal performance
          if (Math.abs(offset) > 3) return null;

          return (
            <motion.div
              key={index}
              onClick={() => {
                if (isActive && onSelect) {
                  onSelect(slide, index);
                } else {
                  setActiveIndex(index);
                }
              }}
              className="absolute w-[280px] sm:w-[380px] md:w-[480px] aspect-[4/3] rounded-2xl cursor-pointer overflow-hidden border border-border/80 bg-card/90 shadow-2xl backdrop-blur-sm"
              initial={false}
              animate={{
                transform: `translateX(${offset * 140}px) translateZ(${
                  isActive ? 150 : -Math.abs(offset) * 160
                }px) rotateY(${offset * -25}deg)`,
                zIndex: 50 - Math.abs(offset),
                opacity: Math.abs(offset) > 2 ? 0.3 : 1 - Math.abs(offset) * 0.22,
                filter: isActive ? 'blur(0px)' : `blur(${Math.min(Math.abs(offset) * 1.5, 4)}px)`,
              }}
              transition={{
                type: 'spring',
                stiffness: 240,
                damping: 24,
              }}
            >
              {/* Image Frame */}
              <div className="relative w-full h-full group bg-surface">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Badge if available */}
                {slide.badge && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider bg-background/85 text-primary border border-primary/30 backdrop-blur-md uppercase">
                    {slide.badge}
                  </div>
                )}

                {/* Overlay Hint on Hover */}
                {isActive && (
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 text-xs font-medium text-foreground shadow-glow border border-primary/40 backdrop-blur-md">
                      <Maximize2 className="size-3.5 text-primary" />
                      Klik untuk Detail
                    </span>
                  </div>
                )}

                {/* Subtle gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent pointer-events-none" />
                
                {/* Embedded Mini Caption */}
                <div className="absolute bottom-3 left-3 right-3 text-left pointer-events-none">
                  <p className="text-xs font-mono text-primary font-medium tracking-wide truncate">
                    {slide.subtitle}
                  </p>
                  <p className="text-sm font-semibold text-foreground truncate drop-shadow-sm">
                    {slide.title}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Slide Caption Box */}
      <AnimatePresence mode="wait">
        {currentSlide && (
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="mt-6 text-center max-w-xl px-4 cursor-pointer"
            onClick={() => onSelect && onSelect(currentSlide, activeIndex)}
          >
            {currentSlide.meta && (
              <span className="inline-block text-xs font-mono tracking-wider text-primary uppercase mb-1">
                {currentSlide.meta}
              </span>
            )}
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground hover:text-primary transition-colors flex items-center justify-center gap-2">
              {currentSlide.title}
            </h3>
            {currentSlide.subtitle && (
              <p className="text-sm text-muted-foreground mt-1">
                {currentSlide.subtitle}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="mt-8 flex items-center gap-4 z-10">
        <button
          onClick={handlePrev}
          type="button"
          aria-label="Previous Slide"
          className="size-11 rounded-full border border-border bg-card/80 backdrop-blur-md flex items-center justify-center text-foreground hover:text-primary hover:border-primary/50 hover:shadow-glow transition-all active:scale-95"
        >
          <ChevronLeft className="size-5" />
        </button>

        {/* Indicator dots */}
        <div className="flex gap-2 max-w-[200px] overflow-x-auto py-1">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                idx === activeIndex
                  ? 'w-6 bg-primary shadow-glow'
                  : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60'
              )}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          type="button"
          aria-label="Next Slide"
          className="size-11 rounded-full border border-border bg-card/80 backdrop-blur-md flex items-center justify-center text-foreground hover:text-primary hover:border-primary/50 hover:shadow-glow transition-all active:scale-95"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}
