"use client";

import { motion } from "motion/react";

import HeroStage from "@/components/three/HeroStage";
import MagneticButton from "@/components/ui/MagneticButton";
import Counter from "@/components/ui/Counter";
import { ArrowDown, ArrowUpRight } from "@/components/ui/icons";
import { site } from "@/content/site";
import { EASE } from "@/lib/motion";

const h = site.hero;

export default function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      <HeroStage />

      <div className="relative z-10 flex flex-1 flex-col justify-between shell pb-6 pt-20 md:pb-8 md:pt-28">
        {/* top line */}
        <div className="flex items-start justify-between gap-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE.outQuint }}
            className="type-eyebrow flex items-center gap-3 max-lg:rounded-full max-lg:border max-lg:border-line max-lg:bg-bg/80 max-lg:px-3 max-lg:py-2 max-lg:backdrop-blur-md"
          >
            <span className="inline-block size-1.5 rounded-full bg-accent" />
            {h.eyebrow}
          </motion.p>
        </div>

        {/* main */}
        <div className="grid items-end gap-8 pb-6 pt-8 md:gap-10 md:pb-8 md:pt-8 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <h1 id="hero-title" className="type-display max-w-[13ch] text-balance">
              {h.lines.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className={`block ${
                      i === h.accentLine ? "text-chrome" : "text-fg"
                    } ${i === h.lines.length - 1 ? "inline-flex items-baseline" : ""}`}
                    initial={{ y: "112%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.95,
                      delay: 0.2 + i * 0.08,
                      ease: EASE.outExpo,
                    }}
                  >
                    {line}
                    {i === h.lines.length - 1 ? (
                      <span aria-hidden className="ml-[0.04em] text-accent">
                        .
                      </span>
                    ) : null}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.55, ease: EASE.outQuint }}
              className="mt-6 flex max-w-[64ch] flex-col gap-7 md:mt-8"
            >
              <p className="type-lead text-pretty">{h.lead}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.66, ease: EASE.outQuint }}
              className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 md:mt-8"
            >
              <MagneticButton
                href={h.primaryCta.href}
                size="lg"
                icon={<ArrowUpRight className="size-4" />}
              >
                {h.primaryCta.label}
              </MagneticButton>
              <a
                href={h.secondaryCta.href}
                className="group inline-flex min-h-11 items-center gap-2 border-b border-line pb-1 text-[0.9375rem] text-muted transition-colors duration-200 hover:border-accent hover:text-fg"
              >
                {h.secondaryCta.label}
                <ArrowDown className="size-4 transition-transform duration-200 group-hover:translate-y-0.5" />
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="type-label mt-4 hidden text-faint xl:block"
            >
              {h.meta.map((row) => row.value).join("  ·  ")}
            </motion.p>
          </div>
        </div>

        {/* bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95, ease: EASE.outQuint }}
          className="hidden flex-col gap-4 border-t border-line pt-4 md:flex md:flex-row md:items-end md:justify-between md:gap-10"
        >
          <div className="grid grid-cols-3 gap-4 md:gap-12">
            {h.stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-[1.35rem] font-medium tracking-[-0.03em] text-fg md:text-[1.75rem]">
                  <Counter
                    value={stat.value}
                    decimals={stat.decimals ?? 0}
                    suffix={stat.suffix ?? ""}
                  />
                </p>
                <p className="mt-1.5 max-w-[18ch] text-[0.75rem] leading-snug text-faint">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <span className="type-label">Скролл</span>
            <span className="relative h-px w-16 bg-line">
              <span className="absolute inset-y-0 left-0 w-6 animate-[trace_2.6s_ease-in-out_infinite] bg-accent" />
            </span>
            <ArrowDown className="size-4 text-muted" />
          </div>
        </motion.div>
      </div>

      {/* blend into the next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-bg to-transparent"
      />
    </section>
  );
}
