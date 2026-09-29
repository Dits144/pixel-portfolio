'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

// Types for the component
export interface DockApp {
  id: string;
  name: string;
  icon: string | React.ReactNode;
  href?: string;
}

export interface MacOSDockProps {
  apps: DockApp[];
  onAppClick?: (appId: string) => void;
  activeApp?: string;
  className?: string;
}

const MacOSDock: React.FC<MacOSDockProps> = ({ 
  apps, 
  onAppClick, 
  activeApp,
  className = ''
}) => {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [currentScales, setCurrentScales] = useState<number[]>(apps.map(() => 1));
  const [currentPositions, setCurrentPositions] = useState<number[]>([]);
  const dockRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastMouseMoveTime = useRef<number>(0);

  // Responsive size calculations based on viewport
  const getResponsiveConfig = useCallback(() => {
    if (typeof window === 'undefined') {
      return { baseIconSize: 44, maxScale: 1.45, effectWidth: 180 };
    }

    const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
    
    if (smallerDimension < 480) {
      return {
        baseIconSize: 36,
        maxScale: 1.3,
        effectWidth: 140
      };
    } else if (smallerDimension < 768) {
      return {
        baseIconSize: 40,
        maxScale: 1.4,
        effectWidth: 170
      };
    } else {
      return {
        baseIconSize: 46,
        maxScale: 1.5,
        effectWidth: 220
      };
    }
  }, []);

  const [config, setConfig] = useState(getResponsiveConfig);
  const { baseIconSize, maxScale, effectWidth } = config;
  const minScale = 1.0;
  const baseSpacing = Math.max(6, baseIconSize * 0.12);

  useEffect(() => {
    const handleResize = () => {
      setConfig(getResponsiveConfig());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getResponsiveConfig]);

  const calculateTargetMagnification = useCallback((mousePosition: number | null) => {
    if (mousePosition === null) {
      return apps.map(() => minScale);
    }

    return apps.map((_, index) => {
      const normalIconCenter = (index * (baseIconSize + baseSpacing)) + (baseIconSize / 2);
      const minX = mousePosition - (effectWidth / 2);
      const maxX = mousePosition + (effectWidth / 2);
      
      if (normalIconCenter < minX || normalIconCenter > maxX) {
        return minScale;
      }
      
      const theta = ((normalIconCenter - minX) / effectWidth) * 2 * Math.PI;
      const cappedTheta = Math.min(Math.max(theta, 0), 2 * Math.PI);
      const scaleFactor = (1 - Math.cos(cappedTheta)) / 2;
      
      return minScale + (scaleFactor * (maxScale - minScale));
    });
  }, [apps, baseIconSize, baseSpacing, effectWidth, maxScale, minScale]);

  const calculatePositions = useCallback((scales: number[]) => {
    let currentX = 0;
    
    return scales.map((scale) => {
      const scaledWidth = baseIconSize * scale;
      const centerX = currentX + (scaledWidth / 2);
      currentX += scaledWidth + baseSpacing;
      return centerX;
    });
  }, [baseIconSize, baseSpacing]);

  useEffect(() => {
    const initialScales = apps.map(() => minScale);
    const initialPositions = calculatePositions(initialScales);
    setCurrentScales(initialScales);
    setCurrentPositions(initialPositions);
  }, [apps, calculatePositions, minScale, config]);

  const animateToTarget = useCallback(() => {
    const targetScales = calculateTargetMagnification(mouseX);
    const targetPositions = calculatePositions(targetScales);
    const lerpFactor = mouseX !== null ? 0.22 : 0.14;

    setCurrentScales(prevScales => {
      return prevScales.map((currentScale, index) => {
        const diff = (targetScales[index] ?? 1) - currentScale;
        return currentScale + (diff * lerpFactor);
      });
    });

    setCurrentPositions(prevPositions => {
      return prevPositions.map((currentPos, index) => {
        const diff = (targetPositions[index] ?? 0) - currentPos;
        return currentPos + (diff * lerpFactor);
      });
    });

    const scalesNeedUpdate = currentScales.some((scale, index) => 
      Math.abs(scale - (targetScales[index] ?? 1)) > 0.002
    );
    const positionsNeedUpdate = currentPositions.some((pos, index) => 
      Math.abs(pos - (targetPositions[index] ?? 0)) > 0.1
    );
    
    if (scalesNeedUpdate || positionsNeedUpdate || mouseX !== null) {
      animationFrameRef.current = requestAnimationFrame(animateToTarget);
    }
  }, [mouseX, calculateTargetMagnification, calculatePositions, currentScales, currentPositions]);

  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animateToTarget);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animateToTarget]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const now = performance.now();
    if (now - lastMouseMoveTime.current < 16) return;
    lastMouseMoveTime.current = now;
    
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      const padding = Math.max(8, baseIconSize * 0.14);
      setMouseX(e.clientX - rect.left - padding);
    }
  }, [baseIconSize]);

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
  }, []);

  const createBounceAnimation = (element: HTMLElement) => {
    const bounceHeight = Math.max(-10, -baseIconSize * 0.22);
    element.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
    element.style.transform = `translateY(${bounceHeight}px)`;
    
    setTimeout(() => {
      element.style.transform = 'translateY(0px)';
    }, 220);
  };

  const handleAppClick = (app: DockApp, index: number) => {
    if (iconRefs.current[index]) {
      createBounceAnimation(iconRefs.current[index]!);
    }
    
    if (app.href) {
      if (app.href.startsWith("#")) {
        const el = document.querySelector(app.href);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.open(app.href, '_blank', 'noopener,noreferrer');
      }
    }
    
    onAppClick?.(app.id);
  };

  const contentWidth = currentPositions.length > 0 
    ? Math.max(...currentPositions.map((pos, index) => 
        pos + (baseIconSize * (currentScales[index] ?? 1)) / 2
      ))
    : (apps.length * (baseIconSize + baseSpacing)) - baseSpacing;

  const padding = Math.max(8, baseIconSize * 0.16);

  return (
    <div 
      ref={dockRef}
      className={`backdrop-blur-xl border border-white/10 shadow-2xl transition-shadow duration-300 ${className}`}
      style={{
        width: `${contentWidth + padding * 2}px`,
        background: 'rgba(15, 23, 42, 0.72)',
        borderRadius: `${Math.max(16, baseIconSize * 0.55)}px`,
        boxShadow: `
          0 10px 30px -5px rgba(0, 0, 0, 0.6),
          0 0 20px 0 rgba(56, 189, 248, 0.15),
          inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)
        `,
        padding: `${padding}px`
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="relative"
        style={{
          height: `${baseIconSize}px`,
          width: '100%'
        }}
      >
        {apps.map((app, index) => {
          const scale = currentScales[index] ?? 1;
          const position = currentPositions[index] ?? 0;
          const scaledSize = baseIconSize * scale;
          const isActive = activeApp === app.id;
          
          return (
            <div
              key={app.id}
              ref={(el) => { iconRefs.current[index] = el; }}
              className="absolute cursor-pointer flex flex-col items-center justify-end group select-none"
              onClick={() => handleAppClick(app, index)}
              style={{
                left: `${position - scaledSize / 2}px`,
                bottom: '0px',
                width: `${scaledSize}px`,
                height: `${scaledSize}px`,
                transformOrigin: 'bottom center',
                zIndex: Math.round(scale * 10)
              }}
            >
              {/* Tooltip Name on Hover */}
              <div 
                className="absolute -top-9 px-2.5 py-1 rounded-md bg-zinc-900/90 text-white text-[11px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-white/10 shadow-lg"
              >
                {app.name}
              </div>

              {/* Icon */}
              <div
                className="size-full rounded-2xl flex items-center justify-center p-2 transition-colors duration-200"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: `0 ${scale > 1.2 ? 6 : 2}px ${scale > 1.2 ? 14 : 6}px rgba(0,0,0,0.4)`
                }}
              >
                {typeof app.icon === 'string' ? (
                  <img
                    src={app.icon}
                    alt={app.name}
                    className="size-full object-contain pointer-events-none"
                  />
                ) : (
                  <div className="size-full flex items-center justify-center text-primary-glow">
                    {app.icon}
                  </div>
                )}
              </div>
              
              {/* Active Indicator Dot */}
              {isActive && (
                <div 
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 size-1 rounded-full bg-primary shadow-[0_0_6px_var(--color-primary)]"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MacOSDock;
