"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  const process = site.process;

  useEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    const line = lineRef.current;
    if (!section || !list || !line) return;

    const mm = gsap.matchMedia();

    // Desktop only: the hairline fills horizontally as the steps scroll by.
    // Reduced motion keeps the static rule (statically complete) instead.
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: list,
              start: "top 78%",
              end: "bottom 58%",
              scrub: 0.6,
            },
          },
        );
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="process" ref={sectionRef} className="section-y shell relative border-t border-line">
      <Reveal>
        <SectionHeading
          index={process.index}
          label={process.label}
          title={process.title}
          accent={process.accent}
          description={process.description}
        />
      </Reveal>

      <div className="relative mt-16 lg:mt-20">
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-3 left-[7px] top-2 w-px bg-line lg:hidden"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-[7px] hidden h-px bg-line lg:block"
        />
        <span
          ref={lineRef}
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-[7px] hidden h-px origin-left bg-accent lg:block"
        />

        <ol ref={listRef} className="relative grid gap-12 lg:grid-cols-4 lg:gap-8">
          {process.steps.map((step) => (
            <li key={step.n} className="relative pl-8 lg:pl-0">
              <span
                aria-hidden
                className="absolute left-0 top-[3px] grid size-[15px] place-items-center rounded-full border border-line bg-bg lg:top-0"
              >
                <span className="size-[5px] rounded-full bg-accent" />
              </span>

              <div className="lg:pt-8">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[0.6875rem] leading-none tracking-[0.16em] text-accent">
                    {step.n}
                  </span>
                  <span className="type-label">{step.duration}</span>
                </div>

                <h3 className="mt-4 font-display text-[1.35rem] font-medium leading-[1.12] tracking-[-0.03em] text-fg md:text-[1.5rem]">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[42ch] text-[0.9375rem] leading-[1.65] text-muted">
                  {step.text}
                </p>

                <ul className="mt-6 space-y-2 border-t border-line pt-5">
                  {step.deliverables.map((deliverable) => (
                    <li
                      key={deliverable}
                      className="flex items-start gap-2.5 text-[0.8125rem] leading-[1.5] text-muted"
                    >
                      <span
                        aria-hidden
                        className="mt-[7px] size-1 shrink-0 rounded-full bg-accent"
                      />
                      {deliverable}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
