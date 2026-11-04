"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/**
 * 2px progress rail pinned to the very top edge. Motion value is springed on
 * precise, animated setups and used raw under prefers-reduced-motion so the
 * rail never lags behind the scroll position.
 */
export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.4,
  });
  const scaleX = reduce ? scrollYProgress : smoothed;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-accent"
    />
  );
}
