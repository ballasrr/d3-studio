"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { MQ, SCROLL_EVENT } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scroll wired into the GSAP ticker so ScrollTrigger stays in
 * sync. Disabled entirely under prefers-reduced-motion.
 *
 * The mobile menu pauses scrolling:
 *   window.dispatchEvent(new Event("d3:lock"))
 *   window.dispatchEvent(new Event("d3:unlock"))
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia(MQ.reduce).matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.4,
      anchors: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});

    const lock = () => lenis.stop();
    const unlock = () => lenis.start();
    window.addEventListener(SCROLL_EVENT.lock, lock);
    window.addEventListener(SCROLL_EVENT.unlock, unlock);

    return () => {
      window.removeEventListener(SCROLL_EVENT.lock, lock);
      window.removeEventListener(SCROLL_EVENT.unlock, unlock);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
