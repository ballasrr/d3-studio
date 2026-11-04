"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import { GSAP_EASE, MQ } from "@/lib/motion";

const SIZE = 256;

/**
 * Single 256px accent spotlight that trails the cursor. GSAP quickTo keeps the
 * pointer handler allocation-free; the `.cursor-glow` utility hides the layer
 * on coarse pointers and under prefers-reduced-motion (globals.css), and the
 * effect bails out for the same conditions so no listener is ever attached.
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia(MQ.finePointer).matches) return;
    if (window.matchMedia(MQ.reduce).matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: GSAP_EASE.outQuart });
    const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: GSAP_EASE.outQuart });

    // Composed with GSAP so the CSS -translate-* centering is not overwritten.
    gsap.set(el, { xPercent: -50, yPercent: -50, x: -SIZE, y: -SIZE });

    const onMove = (event: PointerEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.killTweensOf(el);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="cursor-glow pointer-events-none fixed left-0 top-0 z-[55] size-64 rounded-full bg-accent opacity-[0.13] mix-blend-screen blur-3xl will-change-transform"
    />
  );
}
