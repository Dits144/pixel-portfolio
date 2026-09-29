import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import GlyphPortal from "@/components/ui/glyph-portal";
import type { Profile } from "@/types";

interface IntroLoaderProps {
  profile?: Profile;
  onFinished: () => void;
}

export function IntroLoader({ profile, onFinished }: IntroLoaderProps) {
  const [phase, setPhase] = useState<"loading" | "portal">("loading");
  const [exiting, setExiting] = useState(false);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setExiting(true);
    window.setTimeout(onFinished, 720);
  }, [onFinished]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onFinished();
      return;
    }

    const timer = window.setTimeout(() => setPhase("portal"), 1650);
    return () => window.clearTimeout(timer);
  }, [onFinished]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="intro-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.015,
            filter: "blur(14px)",
            transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[100] bg-background text-foreground select-none"
        >
          <style>{`
            [data-loader-boot]{
              position:absolute;
              inset:0;
              display:grid;
              place-items:center;
              overflow:hidden;
              background:var(--color-background);
            }
            [data-loader-boot]::before{
              content:"";
              position:absolute;
              inset:-20%;
              background:
                radial-gradient(circle at 24% 20%, color-mix(in oklab,var(--color-primary-glow) 34%,transparent), transparent 28%),
                radial-gradient(circle at 78% 72%, color-mix(in oklab,var(--color-accent) 28%,transparent), transparent 30%),
                var(--color-background);
              opacity:.9;
            }
            [data-loader-boot-card]{
              position:relative;
              display:flex;
              width:min(88vw,460px);
              flex-direction:column;
              gap:22px;
              align-items:center;
              text-align:center;
            }
            [data-loader-boot-mark]{
              display:grid;
              width:82px;
              height:82px;
              place-items:center;
              border:1px solid color-mix(in oklab,var(--color-primary) 44%,var(--color-border));
              border-radius:22px;
              background:color-mix(in oklab,var(--color-background) 74%,var(--color-primary));
              color:var(--color-primary);
              font-family:var(--font-mono);
              font-size:26px;
              font-weight:800;
              box-shadow:var(--shadow-glow);
            }
            [data-loader-boot-card] h2{
              margin:0;
              color:var(--color-foreground);
              font-size:clamp(1.35rem,1rem + 1.8vw,2.2rem);
              font-weight:800;
              letter-spacing:0;
            }
            [data-loader-boot-card] p{
              margin:0;
              color:var(--color-muted-foreground);
              font-size:13px;
              line-height:1.6;
            }
            [data-loader-progress]{
              position:relative;
              width:min(260px,70vw);
              height:2px;
              overflow:hidden;
              border-radius:999px;
              background:color-mix(in oklab,var(--color-border) 75%,transparent);
            }
            [data-loader-progress]::before{
              content:"";
              position:absolute;
              inset:0;
              background:linear-gradient(90deg,transparent,var(--color-primary),var(--color-primary-glow));
              transform-origin:left;
              animation:loader-progress 1.45s cubic-bezier(.22,1,.36,1) both;
            }
            @keyframes loader-progress{
              from{transform:translateX(-102%);}
              to{transform:translateX(0);}
            }
            [data-loader-scroll]{
              height:100svh;
              overflow-y:auto;
              overscroll-behavior:contain;
              scrollbar-width:none;
              background:var(--color-background);
            }
            [data-loader-scroll]::-webkit-scrollbar{display:none;}
            [data-loader-portal] [data-gp-caption]{
              inset:calc(var(--gp-word-bottom,50%) + 82px) 24px auto;
              justify-content:center;
            }
            [data-loader-portal] [data-gp-hint],
            [data-loader-portal] [data-gp-enter]{
              display:none;
            }
            [data-loader-portal] [data-gp-touch-picker]{
              top:auto;
              bottom:13%;
              left:50%;
              z-index:3;
            }
            [data-loader-portal] [data-gp-select]{
              min-width:128px;
              border-color:color-mix(in oklab,var(--color-primary) 40%,var(--color-border));
              border-radius:999px;
              background:color-mix(in oklab,var(--color-background) 84%,transparent);
              color:var(--color-foreground);
              backdrop-filter:blur(12px);
            }
            [data-loader-portal] [data-gp-letter]{
              display:none!important;
              pointer-events:none!important;
              outline:none!important;
              background:transparent!important;
              border:none!important;
            }
            [data-loader-front]{
              position:absolute;
              inset:0;
              pointer-events:none;
            }
            [data-loader-kicker]{
              position:absolute;
              inset:auto 24px calc(100% - var(--gp-word-top,35%) + 32px);
              margin:0;
              color:var(--color-primary);
              text-align:center;
              font-family:var(--font-mono);
              font-size:12px;
              font-weight:600;
              letter-spacing:.16em;
              line-height:1.5;
              text-transform:uppercase;
            }
            [data-loader-copy]{
              position:absolute;
              inset:calc(var(--gp-word-bottom,50%) + 30px) 24px auto;
              margin:0;
              color:var(--color-muted-foreground);
              text-align:center;
              font-size:clamp(15px,2.1vw,20px);
              font-weight:500;
              line-height:1.5;
            }
            [data-loader-copy] span{
              color:var(--color-primary);
              font-family:var(--font-mono);
            }
            [data-loader-pickhint]{
              display:block;
              margin-top:6px;
              color:color-mix(in oklab,var(--color-muted-foreground) 80%,transparent);
              font-family:var(--font-mono);
              font-size:11px;
              letter-spacing:.08em;
              text-transform:uppercase;
            }
            [data-loader-scrollhint]{
              position:absolute;
              inset:auto 24px 7%;
              color:var(--color-muted-foreground);
              text-align:center;
              font-size:11px;
            }
            [data-loader-skip]{
              position:fixed;
              right:clamp(18px,4vw,44px);
              bottom:clamp(18px,4vw,36px);
              z-index:2;
              border:1px solid color-mix(in oklab,var(--color-primary) 42%,var(--color-border));
              border-radius:999px;
              background:color-mix(in oklab,var(--color-background) 82%,transparent);
              color:var(--color-foreground);
              padding:10px 14px;
              font-size:12px;
              font-weight:600;
              box-shadow:var(--shadow-card);
              backdrop-filter:blur(12px);
            }
            [data-loader-content]{
              display:flex;
              width:min(100%,70rem);
              margin:auto;
              flex-direction:column;
              align-items:center;
              gap:clamp(1.5rem,5svh,2.5rem);
              text-align:center;
            }
            [data-loader-content] h1{
              max-width:56rem;
              margin:0;
              color:inherit;
              font-size:clamp(2.2rem,1.3rem + 5vw,5.2rem);
              font-weight:800;
              line-height:.98;
              letter-spacing:0;
              text-wrap:balance;
            }
            [data-loader-content] p{
              max-width:38rem;
              margin:0;
              color:color-mix(in oklab,var(--color-foreground) 76%,transparent);
              font-size:clamp(1rem,.9rem + .45vw,1.18rem);
              line-height:1.65;
            }
            [data-loader-enter]{
              border:1px solid color-mix(in oklab,var(--color-primary) 48%,var(--color-border));
              border-radius:999px;
              background:var(--color-primary);
              color:var(--color-primary-foreground);
              padding:12px 18px;
              font-weight:700;
              box-shadow:var(--shadow-glow);
            }
            @container(max-height:479px){
              [data-loader-copy]{top:calc(var(--gp-word-bottom,50%) + 14px);}
              [data-loader-scrollhint]{display:none;}
            }
          `}</style>
          <AnimatePresence mode="wait">
            {phase === "loading" ? (
              <motion.div
                key="loader-boot"
                data-loader-boot
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 0.36 } }}
              >
                <div data-loader-boot-card>
                  <motion.div
                    data-loader-boot-mark
                    initial={{ opacity: 0, scale: 0.82, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden p-1"
                  >
                    <img
                      src="/logo.jpg"
                      alt="Logo Raditya"
                      className="size-full rounded-2xl object-cover"
                    />
                  </motion.div>
                  <div>
                    <h2>Menyiapkan portal</h2>
                    <p>Memuat ruang masuk portfolio.</p>
                  </div>
                  <div data-loader-progress />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="loader-portal"
                data-loader-scroll
                data-loader-portal
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.42 }}
              >
                <GlyphPortal
                  className="min-h-screen"
                  word="PORTFOLIO"
                  fontFamily='"Arial Black", Arial, sans-serif'
                  fontWeight={900}
                  scrollLength={2.7}
                  interactive={false}
                  annotations={false}
                  onProgress={(progress) => {
                    if (progress >= 0.94) finish();
                  }}
                  front={
                    <div data-loader-front>
                      <p data-loader-kicker>Raditya.tech</p>
                      <p data-loader-copy>
                        Scroll ke bawah untuk masuk
                      </p>
                      <span data-loader-scrollhint>Scroll down pelan untuk membuka portfolio</span>
                    </div>
                  }
                  style={{
                    "--gp-paper": "var(--color-background)",
                    "--gp-ink": "color-mix(in oklab, var(--color-foreground) 85%, var(--color-primary))",
                    "--gp-field": "color-mix(in oklab, var(--color-primary) 70%, var(--color-background))",
                    "--gp-foreground": "var(--color-foreground)",
                    fontFamily: "var(--font-display)",
                  }}
                  background={
                    <div
                      className="absolute inset-0"
                      style={{
                        transform: "scale(var(--gp-field-scale,1))",
                        background:
                          "radial-gradient(circle at 18% 12%, color-mix(in oklab, var(--color-primary-glow) 40%, transparent), transparent 36%), radial-gradient(circle at 84% 18%, color-mix(in oklab, var(--color-accent) 35%, transparent), transparent 32%), radial-gradient(circle at 48% 78%, color-mix(in oklab, var(--color-primary) 30%, transparent), transparent 46%), linear-gradient(180deg, #09090b 0%, #0d1527 50%, #050811 100%)",
                      }}
                    />
                  }
                >
                  <div data-loader-content>
                    <h1>
                      Halo, saya <span className="text-gradient">{profile?.name ?? "Muhammad Raditya Anwar"}</span>
                    </h1>
                    <p>{profile?.role ?? "Cyber Security & Fullstack Developer"}</p>
                    <button data-loader-enter type="button" onClick={finish}>
                      Masuk ke portfolio
                    </button>
                  </div>
                </GlyphPortal>
              </motion.div>
            )}
          </AnimatePresence>
          <button data-loader-skip type="button" onClick={finish} className="flex items-center gap-1.5 cursor-pointer">
            <span>Scroll Down / Lewati</span>
            <span className="text-primary text-sm animate-bounce">↓</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
