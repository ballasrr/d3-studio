"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./HeroScene"), { ssr: false });

/**
 * Lazy WebGL layer for the hero. The static light-field below is the poster:
 * it renders on the server, so LCP is text/backdrop and there is no CLS while
 * three.js loads. If WebGL is unavailable the poster simply stays.
 *
 * No state and no effects here on purpose — the scene reads
 * prefers-reduced-motion itself, which also avoids a hydration mismatch.
 */
export default function HeroStage() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* static poster / graceful WebGL fallback */}
      <div className="absolute inset-0 bg-bg-deep" />
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_72%_34%,oklch(85%_0.19_127/0.10),transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_76%_62%,oklch(70%_0.02_265/0.14),transparent_70%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[58%] grid-field opacity-[0.16] [mask-image:linear-gradient(to_bottom,transparent,black_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_115%,transparent_40%,var(--bg)_82%)]" />
      <div className="absolute left-[6%] top-[18%] hidden size-[44vw] rounded-full border border-line/40 md:block" />
      <div className="absolute left-[2%] top-[8%] hidden size-[58vw] rounded-full border border-line/25 md:block" />
      <Scene />
    </div>
  );
}
