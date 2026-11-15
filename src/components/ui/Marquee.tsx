"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type MarqueeProps = {
  items: ReactNode[];
  duration?: number;
  className?: string;
  gapClassName?: string;
  reverse?: boolean;
  label?: string;
};

/** One visual half repeats the roster several times so the strip stays wider
 *  than any viewport; the second half is an exact copy for a seamless loop. */
const COPIES_PER_HALF = 6;

/**
 * Infinite marquee. Two identical halves scroll by exactly the measured width
 * of one half, so the last item of the first half lands where the first item of
 * the second half started — no visible jump. Pauses on hover, stops under
 * reduced motion (`.marquee-track` rule in globals.css).
 */
export default function Marquee({
  items,
  duration = 42,
  className = "",
  gapClassName = "gap-14 md:gap-20",
  reverse = false,
  label,
}: MarqueeProps) {
  const repeated = Array.from({ length: COPIES_PER_HALF }, () => items).flat();
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const [halfWidth, setHalfWidth] = useState<number | null>(null);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    const measure = () => {
      const width = group.getBoundingClientRect().width;
      if (width > 0) setHalfWidth(width);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(group);
    document.fonts?.ready.then(measure).catch(() => undefined);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!halfWidth) return;
    trackRef.current?.style.setProperty("--marquee-shift", `-${halfWidth}px`);
  }, [halfWidth]);

  return (
    <div
      className={`relative flex w-full overflow-hidden ${className}`}
      role={label ? "region" : undefined}
      aria-label={label}
    >
      <div
        ref={trackRef}
        className="marquee-track flex w-max items-center animate-marquee"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
          animationPlayState: halfWidth ? "running" : "paused",
        }}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            ref={copy === 0 ? groupRef : undefined}
            aria-hidden={copy === 1 ? true : undefined}
            className={`flex shrink-0 items-center ${gapClassName}`}
          >
            {repeated.map((item, index) => (
              <span key={`${copy}-${index}`} className="flex shrink-0 items-center">
                {item}
              </span>
            ))}
            {/* keeps the gap between the two halves identical to item gaps */}
            <span aria-hidden className="block size-0 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
