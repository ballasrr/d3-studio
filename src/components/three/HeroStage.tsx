"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * Full-bleed looping black-hole background.
 * The poster is a real element underneath, so it is both the LCP image and the
 * fallback when autoplay/WebGL/reduced motion disables the video.
 */
export default function HeroStage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Some browsers ignore the autoplay attribute after hydration; retry once.
    const play = () => {
      void video.play().catch(() => undefined);
    };
    play();
    video.addEventListener("canplay", play, { once: true });
    return () => video.removeEventListener("canplay", play);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <Image
        src="hero-bg-poster.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="scale-[1.2] object-cover object-[50%_42%] md:scale-[1.32] md:translate-x-[9%]"
      />
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="hero-bg-poster.jpg"
        aria-hidden
        tabIndex={-1}
        className="absolute inset-0 h-full w-full scale-[1.2] object-cover object-[50%_42%] motion-reduce:hidden md:scale-[1.32] md:translate-x-[9%]"
      >
        <source src="hero-bg-720.mp4" media="(max-width: 768px)" type="video/mp4" />
        <source src="hero-bg.mp4" type="video/mp4" />
      </video>

      {/* desktop: calm left column for the headline */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, var(--bg) 0%, color-mix(in oklab, var(--bg) 82%, transparent) 34%, color-mix(in oklab, var(--bg) 38%, transparent) 56%, transparent 72%)",
        }}
      />
      {/* mobile: keep the object at the top, text on a dark field */}
      <div
        className="absolute inset-0 md:hidden"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--bg) 35%, transparent) 38%, var(--bg) 64%)",
        }}
      />

      {/* specimen-plate marks around the object */}
      <div className="pointer-events-none absolute inset-y-[16%] left-[54%] right-[4%] hidden md:block">
        <span className="absolute left-0 top-0 size-3 border-l border-t border-line-strong/50" />
        <span className="absolute right-0 top-0 size-3 border-r border-t border-line-strong/50" />
        <span className="absolute bottom-0 left-0 size-3 border-b border-l border-line-strong/50" />
        <span className="absolute bottom-0 right-0 size-3 border-b border-r border-line-strong/50" />
        <span className="absolute left-0 top-4 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-faint">
          OBJ. 01 · BLACK HOLE
        </span>
        <span className="absolute bottom-4 right-0 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-faint">
          ACCRETION DISK · LOOP
        </span>
      </div>
    </div>
  );
}
