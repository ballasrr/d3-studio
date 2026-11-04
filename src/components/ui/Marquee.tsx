import type { ReactNode } from "react";

type MarqueeProps = {
  items: ReactNode[];
  duration?: number;
  className?: string;
  gapClassName?: string;
  reverse?: boolean;
  label?: string;
};

/**
 * CSS-only infinite marquee. The list renders twice; the second copy is
 * aria-hidden. Pauses on hover, stops completely under reduced motion
 * (`.marquee-track` rule in globals.css).
 */
export default function Marquee({
  items,
  duration = 42,
  className = "",
  gapClassName = "gap-14 md:gap-20",
  reverse = false,
  label,
}: MarqueeProps) {
  return (
    <div
      className={`relative flex w-full overflow-hidden ${className}`}
      role={label ? "region" : undefined}
      aria-label={label}
    >
      <div
        className={`marquee-track flex w-max items-center ${gapClassName} animate-marquee`}
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            className={`flex shrink-0 items-center ${gapClassName}`}
          >
            {items.map((item, index) => (
              <span key={`${copy}-${index}`} className="flex shrink-0 items-center">
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
