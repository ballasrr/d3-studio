"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import { MQ } from "@/lib/motion";

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Max rotation in degrees. Keep <= 8 — bigger reads as a toy. */
  max?: number;
  glare?: boolean;
};

/**
 * Pointer-driven 3D tilt. quickTo avoids allocating a tween per mousemove.
 * Disabled on touch and when reduced motion is requested.
 */
export default function TiltCard({
  children,
  className = "",
  max = 7,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia(MQ.finePointer).matches) return;
    if (window.matchMedia(MQ.reduce).matches) return;

    el.style.transformStyle = "preserve-3d";
    const cfg = { duration: 0.5, ease: "power3.out" } as const;
    const rx = gsap.quickTo(el, "rotationX", cfg);
    const ry = gsap.quickTo(el, "rotationY", cfg);
    const glow = el.querySelector<HTMLElement>("[data-glare]");

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      ry(px * max * 2);
      rx(-py * max * 2);
      if (glow) {
        glow.style.opacity = "1";
        glow.style.background = `radial-gradient(420px circle at ${(px + 0.5) * 100}% ${
          (py + 0.5) * 100
        }%, var(--glass-strong), transparent 62%)`;
      }
    };
    const onLeave = () => {
      rx(0);
      ry(0);
      if (glow) glow.style.opacity = "0";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [max]);

  return (
    <div ref={ref} className={`relative ${className}`} style={{ perspective: 1100 }}>
      {children}
      {glare ? (
        <div
          data-glare
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
        />
      ) : null}
    </div>
  );
}
