import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Cpu } from "lucide-react";

export function QuantumCloudLoader({ onFinished }: { onFinished?: () => void }) {
  const [progress, setProgress] = useState(12);
  const [statusText, setStatusText] = useState("INITIALIZING NEURAL INTERFACE");

  useEffect(() => {
    const p1 = setTimeout(() => {
      setProgress(45);
      setStatusText("DECRYPTING CREDENTIALS & QUANTUM DATA");
    }, 400);

    const p2 = setTimeout(() => {
      setProgress(85);
      setStatusText("VERIFYING CYBERSEC DEFENSE PROTOCOLS");
    }, 900);

    const p3 = setTimeout(() => {
      setProgress(100);
      setStatusText("ACCESS GRANTED // RADITYA.TECH READY");
    }, 1400);

    const finish = setTimeout(() => {
      if (onFinished) onFinished();
    }, 1750);

    return () => {
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(p3);
      clearTimeout(finish);
    };
  }, [onFinished]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground overflow-hidden">
      {/* Background cyber grid & glow */}
      <div className="absolute inset-0 grid-backdrop opacity-30" />
      <div className="absolute w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      {/* 3D Quantum Cloud Sphere / Rings */}
      <div className="relative flex items-center justify-center size-44 sm:size-52">
        {/* Outer Ring 1 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
        />

        {/* Orbit Ring 2 */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          className="absolute inset-3 rounded-full border border-primary/40 border-t-primary shadow-glow"
        />

        {/* Glowing Orbs along orbit */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute inset-6"
        >
          <div className="size-3.5 rounded-full bg-primary shadow-glow -top-1.5 left-1/2 -translate-x-1/2 absolute" />
          <div className="size-2 rounded-full bg-cyan-400 shadow-glow bottom-0 left-1/2 -translate-x-1/2 absolute" />
        </motion.div>

        {/* Center Quantum Core */}
        <motion.div
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="relative flex items-center justify-center size-20 rounded-2xl bg-card border border-primary/50 shadow-glow backdrop-blur-xl"
        >
          <ShieldCheck className="size-10 text-primary drop-shadow-[0_0_12px_var(--color-primary)]" />
        </motion.div>
      </div>

      {/* Brand & Loading Status */}
      <div className="mt-8 flex flex-col items-center z-10 px-6 max-w-md w-full text-center">
        <div className="flex items-center gap-2">
          <Cpu className="size-4 text-primary animate-pulse" />
          <span className="font-mono text-xs font-semibold tracking-[0.25em] text-primary uppercase">
            RADITYA.TECH SYSTEM CORE
          </span>
        </div>

        {/* Dynamic status */}
        <p className="mt-2 text-xs font-mono tracking-wider text-muted-foreground min-h-[1.25rem]">
          {statusText}
        </p>

        {/* Cyber Progress Bar */}
        <div className="mt-5 w-64 h-1.5 bg-muted/60 rounded-full overflow-hidden border border-border/80">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-cyan-400 to-primary rounded-full shadow-glow"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
          />
        </div>

        <span className="mt-2 text-[10px] font-mono text-muted-foreground/70">
          SECURE PROTOCOL V4.2 // {progress}%
        </span>
      </div>
    </div>
  );
}
