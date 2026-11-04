"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

import { MQ } from "@/lib/motion";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

type MagneticButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
  type?: "button" | "submit";
  disabled?: boolean;
};

const sizes: Record<Size, string> = {
  sm: "h-11 px-5 text-[0.8125rem]",
  md: "h-[52px] px-7 text-[0.9375rem]",
  lg: "h-[60px] px-8 text-base",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-ink border border-accent hover:brightness-[1.06] active:brightness-95 disabled:opacity-60",
  outline:
    "border border-line-strong text-fg hover:bg-glass hover:border-fg/45 active:bg-glass-strong",
  ghost: "border border-transparent text-fg hover:text-accent",
};

/**
 * Magnetic CTA. GSAP quickTo keeps the pointer handler allocation-free.
 * Falls back to a plain link/button on touch and reduced motion.
 */
export default function MagneticButton({
  children,
  href,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  onClick,
  ariaLabel,
  type = "button",
  disabled,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia(MQ.finePointer).matches) return;
    if (window.matchMedia(MQ.reduce).matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const strength = 0.24;
      xTo((event.clientX - (rect.left + rect.width / 2)) * strength);
      yTo((event.clientY - (rect.top + rect.height / 2)) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const classes = [
    "group relative inline-flex items-center justify-center gap-3 rounded-full",
    "font-medium tracking-[-0.01em] whitespace-nowrap",
    "transition-[background-color,border-color,color,filter] duration-150",
    "will-change-transform",
    sizes[size],
    variants[variant],
    className,
  ].join(" ");

  const inner = (
    <>
      <span>{children}</span>
      {icon ? (
        <span className="transition-transform duration-200 ease-out group-hover:translate-x-[2px]">
          {icon}
        </span>
      ) : null}
    </>
  );

  if (href) {
    const isInternal = href.startsWith("/") && !href.startsWith("//");
    if (isInternal) {
      return (
        <Link ref={ref} href={href} className={classes} aria-label={ariaLabel} onClick={onClick}>
          {inner}
        </Link>
      );
    }
    return (
      <a ref={ref} href={href} className={classes} aria-label={ariaLabel} onClick={onClick}>
        {inner}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      className={classes}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      {inner}
    </button>
  );
}
