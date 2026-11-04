"use client";

import { useEffect, useRef, useState } from "react";

type CounterProps = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
};

function format(value: number, decimals: number) {
  return value.toLocaleString("ru-RU", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Animated counter. Renders the final value on the server (no layout shift,
 * works without JS) and counts from zero the first time it enters the view.
 */
export default function Counter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1100,
  className = "",
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(() => value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(2, -10 * progress);
          setDisplay(value * (progress === 1 ? 1 : eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {format(display, decimals)}
      {suffix}
    </span>
  );
}
