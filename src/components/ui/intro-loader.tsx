import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import hdLogo from "@/assets/hd-logo.jpg";

interface IntroLoaderProps {
  onFinished: () => void;
}

export function IntroLoader({ onFinished }: IntroLoaderProps) {
  const [phase, setPhase] = useState<"initial" | "logo" | "name" | "sub" | "line" | "exit">("initial");

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onFinished();
      return;
    }

    // Calibrated pacing (~3.6s total sequence for a premium, non-rushed cinematic feel)
    const t0 = setTimeout(() => setPhase("logo"), 200);
    const t1 = setTimeout(() => setPhase("name"), 800);
    const t2 = setTimeout(() => setPhase("sub"), 1400);
    const t3 = setTimeout(() => setPhase("line"), 1900);
    const t4 = setTimeout(() => setPhase("exit"), 3200);
    const tEnd = setTimeout(() => {
      onFinished();
    }, 4100);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(tEnd);
    };
  }, [onFinished]);

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          key="intro-screen"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: {
              duration: 0.95,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-background text-foreground px-6 py-8 sm:px-12 sm:py-10 select-none overflow-hidden"
        >
          {/* Subtle ambient background glow & grid */}
          <div className="absolute inset-0 grid-backdrop opacity-25 pointer-events-none" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-primary/10 blur-[130px]" />

          {/* Top Metadata Header */}
          <div className="relative flex items-center justify-between w-full z-10">
            <motion.div
              initial={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              <div className="size-2 rounded-full bg-primary animate-pulse shadow-glow" />
              <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                Portfolio / 2026
              </span>
            </motion.div>

            <motion.span
              initial={{ opacity: 0, filter: "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-mono text-xs tracking-wider text-muted-foreground/70 hidden sm:inline-block"
            >
              Bogor — ID
            </motion.span>
          </div>

          {/* Centerpiece: Hero Avatar Logo & Editorial Typography */}
          <div className="relative my-auto flex flex-col items-center justify-center text-center z-10 w-full max-w-4xl mx-auto">
            {/* User Custom Avatar / Logo (HD Cybersec Developer) */}
            <motion.div
              initial={{ scale: 0.75, opacity: 0, filter: "blur(12px)" }}
              animate={
                phase !== "initial"
                  ? { scale: 1, opacity: 1, filter: "blur(0px)" }
                  : { scale: 0.75, opacity: 0, filter: "blur(12px)" }
              }
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative mb-6 sm:mb-8 group"
            >
              <div className="relative size-24 sm:size-28 md:size-32 rounded-3xl overflow-hidden border border-border/80 shadow-2xl bg-card/90 backdrop-blur-md p-1 glow-ring">
                <img
                  src={hdLogo}
                  alt="Muhammad Raditya Anwar - HD Cybersec Developer"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </motion.div>

            {/* Main Editorial Name Reveal with Mask */}
            <div className="overflow-hidden py-1">
              <motion.div
                initial={{ y: 70, opacity: 0, filter: "blur(10px)" }}
                animate={
                  phase === "name" || phase === "sub" || phase === "line"
                    ? { y: 0, opacity: 1, filter: "blur(0px)" }
                    : { y: 70, opacity: 0, filter: "blur(10px)" }
                }
                transition={{
                  duration: 0.85,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col sm:flex-row items-baseline justify-center tracking-tight"
              >
                <span className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase text-foreground">
                  RADITYA
                </span>
                <span className="font-display text-3xl sm:text-5xl md:text-6xl font-light text-primary sm:ml-2.5">
                  .tech
                </span>
              </motion.div>
            </div>

            {/* Editorial Minimal Subtitle */}
            <div className="overflow-hidden mt-2.5 sm:mt-3.5">
              <motion.div
                initial={{ y: 25, opacity: 0 }}
                animate={
                  phase === "sub" || phase === "line"
                    ? { y: 0, opacity: 1 }
                    : { y: 25, opacity: 0 }
                }
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-center justify-center gap-2.5 text-xs sm:text-sm font-sans tracking-wide text-muted-foreground"
              >
                <span>Fullstack Developer</span>
                <span className="text-primary/70 font-mono">/</span>
                <span>Cyber Security</span>
              </motion.div>
            </div>

            {/* Minimal Horizontal Loading Bar */}
            <div className="relative mt-8 sm:mt-10 w-48 sm:w-64 h-[2px] bg-border/40 overflow-hidden rounded-full">
              <motion.div
                initial={{ x: "-100%" }}
                animate={
                  phase === "line"
                    ? { x: "0%" }
                    : { x: "-100%" }
                }
                transition={{
                  duration: 1.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full w-full bg-gradient-to-r from-primary/40 via-primary to-primary-glow shadow-glow"
              />
            </div>
          </div>

          {/* Bottom Clean Coordinate / Footer Info */}
          <div className="relative flex items-center justify-between w-full z-10 text-[11px] font-mono text-muted-foreground/60">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              01 / 06
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              &copy; 2026
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
