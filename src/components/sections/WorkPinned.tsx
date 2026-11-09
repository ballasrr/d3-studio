"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import CaseVisual from "@/components/sections/work/CaseVisual";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import { site } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

const pad = (value: number) => String(value).padStart(2, "0");

/** Pinned sections are height-constrained: the headline is scaled down a notch
 *  so the cards always fit inside one viewport, without touching the shared
 *  SectionHeading component. */
function workTitle(title: string, accent: string) {
  const at = title.indexOf(accent);
  if (at < 0) return title;

  return (
    <span className="block text-[clamp(2.25rem,4.4vw,3.5rem)] leading-[1.02]">
      {title.slice(0, at)}
      <span className="text-accent">{accent}</span>
      {title.slice(at + accent.length)}
    </span>
  );
}

export default function WorkPinned() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  const work = site.work;
  const total = work.items.length;

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    // Desktop: pin the section and scrub the track sideways.
    // Reduced motion and tablets keep the native scroll container below.
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.set(track, { overflowX: "visible", scrollSnapType: "none" });

        const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${Math.max(0.02, self.progress)})`;
              }
              if (counterRef.current) {
                const active = Math.min(total, Math.round(self.progress * (total - 1)) + 1);
                counterRef.current.textContent = pad(active);
              }
            },
          },
        });
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [total]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative border-t border-line pt-20 pb-16 lg:h-[100svh] lg:overflow-hidden lg:py-0"
    >
      <div className="flex flex-col lg:h-full lg:pb-6">
        <div className="shell shrink-0 lg:pt-[calc(var(--nav-h)_+_1.5rem)]">
          <Reveal>
            <SectionHeading
              index={work.index}
              label={work.label}
              title={workTitle(work.title, work.accent)}
              description={work.description}
            />
          </Reveal>
        </div>

        <div className="mt-10 flex min-h-0 flex-col lg:mt-6 lg:flex-1">
          <div
            ref={trackRef}
            tabIndex={0}
            role="region"
            aria-label="Проекты — горизонтальная галерея"
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2 no-scrollbar [scroll-padding-inline:var(--gutter)] lg:min-h-0 lg:flex-1 lg:items-stretch lg:pb-0"
          >
            {work.items.map((item, i) => {
              const cardClass =
                "group flex w-[min(78vw,860px)] shrink-0 snap-start flex-col overflow-hidden rounded-[28px] border border-line bg-bg-elev transition-colors duration-200 hover:border-line-strong lg:h-full";

              const content = (
                <>
                  <div className="relative h-[210px] shrink-0 overflow-hidden border-b border-line bg-bg-deep md:h-[240px] lg:h-auto lg:min-h-[160px] lg:flex-1">
                    <div className="h-full w-full origin-center transition-transform duration-500 ease-out group-hover:scale-[1.02]">
                      <CaseVisual visual={item.visual} tone={item.tone} />
                    </div>
                  </div>

                  <div className="shrink-0 p-5 md:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                          <span className="font-display text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-fg">
                            {item.client}
                          </span>
                          <span className="type-label">
                            {item.industry} · {item.year}
                          </span>
                        </div>
                        <h3 className="mt-3 font-display text-[1.125rem] leading-[1.15] tracking-[-0.02em] text-fg md:text-[1.3125rem]">
                          {item.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 max-w-[58ch] text-[0.875rem] leading-[1.55] text-muted">
                          {item.subtitle}
                        </p>
                      </div>

                      {item.result && item.resultLabel ? (
                        <div className="shrink-0 sm:text-right">
                          <span className="block font-display text-[1.5rem] font-medium leading-none tracking-[-0.04em] tabular-nums text-accent md:text-[2.125rem]">
                            {item.result}
                          </span>
                          <span className="mt-2 block max-w-[19ch] text-[0.6875rem] leading-[1.4] text-faint sm:ml-auto">
                            {item.resultLabel}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                      <ul className="flex flex-wrap gap-2">
                        {item.services.map((service) => (
                          <li
                            key={service}
                            className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.625rem] uppercase leading-none tracking-[0.08em] text-faint"
                          >
                            {service}
                          </li>
                        ))}
                      </ul>
                      <span className="type-label hidden shrink-0 sm:inline">
                        Проект {pad(i + 1)}
                      </span>
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Перейти на сайт ${item.client}`}
                          className="type-label inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-fg transition-colors duration-150 hover:border-accent hover:text-accent"
                        >
                          Перейти на сайт
                          <ArrowUpRight aria-hidden className="size-3.5" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </>
              );

              return (
                <article key={item.id} className={cardClass}>
                  {content}
                </article>
              );
            })}
          </div>

          <div className="mt-4 hidden shrink-0 items-center justify-between gap-6 px-[var(--gutter)] lg:flex">
            <span className="type-label flex items-center gap-2">
              Скролл
              <ArrowRight aria-hidden className="size-3.5 text-faint" />
            </span>
            <span className="flex items-center gap-4 motion-reduce:hidden">
              <span className="font-mono text-[0.6875rem] tracking-[0.12em] text-fg">
                <span ref={counterRef}>{pad(1)}</span>
                <span className="text-faint"> / {pad(total)}</span>
              </span>
              <span aria-hidden className="relative h-px w-[120px] bg-line-strong md:w-[160px]">
                <span
                  ref={progressRef}
                  className="absolute inset-0 origin-left bg-accent"
                  style={{ transform: "scaleX(0)" }}
                />
              </span>
            </span>
          </div>

          <p className="mt-4 flex items-center gap-2 px-[var(--gutter)] type-label lg:hidden">
            Листайте
            <ArrowRight aria-hidden className="size-3.5 text-faint" />
          </p>
        </div>
      </div>
    </section>
  );
}
