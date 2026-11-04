"use client";

import { motion, type Variants } from "motion/react";

import { EASE, STAGGER } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

/** Scroll-in reveal. Transform animation is skipped automatically for
 *  reduced-motion users by MotionProvider; opacity still resolves, so content
 *  is never left invisible. */
export function Reveal({ children, className = "", delay = 0, y = 26 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.6, delay, ease: EASE.outQuint }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className = "",
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
}) {
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: STAGGER, delayChildren: 0.05 } },
  };
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
}) {
  const item: Variants = {
    hidden: { opacity: 0, y },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE.outExpo } },
  };
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}
