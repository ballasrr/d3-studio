/**
 * Motion tokens — one source of truth for timing.
 * Durations are seconds; easings are cubic-bezier tuples for motion/react
 * and mirrored as GSAP eases where GSAP drives the tween.
 */

export type CubicBezier = [number, number, number, number];

export const EASE = {
  outExpo: [0.16, 1, 0.3, 1] as CubicBezier,
  outQuint: [0.22, 1, 0.36, 1] as CubicBezier,
  outQuart: [0.25, 1, 0.5, 0.9] as CubicBezier,
  inOutQuart: [0.76, 0, 0.24, 1] as CubicBezier,
  inOutCirc: [0.85, 0, 0.15, 1] as CubicBezier,
  backOut: [0.34, 1.56, 0.64, 1] as CubicBezier,
};

export const DUR = {
  micro: 0.14,
  ui: 0.24,
  enter: 0.55,
  hero: 0.9,
  max: 1.2,
};

export const STAGGER = 0.07;

/** GSAP ease strings matching EASE. */
export const GSAP_EASE = {
  outExpo: "expo.out",
  outQuint: "quint.out",
  outQuart: "power3.out",
  inOutQuart: "power4.inOut",
} as const;

/** Media queries used in several places. */
export const MQ = {
  reduce: "(prefers-reduced-motion: reduce)",
  finePointer: "(pointer: fine)",
  desktop: "(min-width: 1024px)",
} as const;

/** Scroll-lock events. SmoothScroll listens; the menu dispatches. */
export const SCROLL_EVENT = {
  lock: "d3:lock",
  unlock: "d3:unlock",
} as const;
