"use client";

import { MotionConfig } from "motion/react";

/**
 * One global motion policy. With `reducedMotion="user"` motion skips transform
 * and layout animations for users who ask for it, while opacity transitions
 * still complete — so nothing ever stays invisible. Doing this in one place
 * also avoids SSR/client mismatch (the reason content used to disappear when
 * reduced motion was enabled).
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
