"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import type { CaseStudy } from "@/content/site";
import { ArrowRight, ArrowUpRight, Close } from "@/components/ui/icons";

import shahAtmosphere from "@/assets/cases/shah-atmosphere.jpg";
import shahBooking from "@/assets/cases/shah-booking.jpg";
import shahFind from "@/assets/cases/shah-find.jpg";
import shahHero from "@/assets/cases/shah-hero.jpg";

/* ------------------------------------------------------------------ */
/* Case visuals are built from DOM + inline SVG: browser chrome, real  */
/* Russian UI labels, charts, tables and price grids. No raster art.   */
/* D3 portfolio: Asko Support, ШАХ LOUNGE (real screenshots),          */
/* E13-CHARGE.                                                         */
/* ------------------------------------------------------------------ */

const SHAH_GALLERY = [
  { src: shahHero, alt: "Главный экран сайта ШАХ LOUNGE", caption: "Главный экран" },
  { src: shahFind, alt: "Страница «Как нас найти»", caption: "Как нас найти" },
  { src: shahBooking, alt: "Бронирование стола", caption: "Бронь стола" },
  { src: shahAtmosphere, alt: "Атмосфера зала", caption: "Атмосфера" },
] as const;

const DOMAINS: Record<CaseStudy["visual"], string> = {
  dashboard: "review.asko-plus.ru/admin",
  landing: "shah-hookah-bar.ru",
  commerce: "E13-WASH · терминал",
  mobile: "E13-CHARGE · приложение",
  configurator: "E13-MONITORING · EVMap",
};

/** Tone backdrops use design tokens only — gradients are built from CSS vars. */
const TONE_BACKDROP: Record<CaseStudy["tone"], string> = {
  lime:
    "radial-gradient(80% 130% at 82% 0%, color-mix(in oklab, var(--accent) 20%, transparent) 0%, transparent 62%), linear-gradient(180deg, var(--bg-elev) 0%, var(--bg-deep) 100%)",
  neutral:
    "radial-gradient(72% 120% at 18% 0%, color-mix(in oklab, var(--chrome-mid) 12%, transparent) 0%, transparent 58%), linear-gradient(180deg, var(--bg-elev) 0%, var(--bg-deep) 100%)",
  warm:
    "radial-gradient(84% 140% at 88% 100%, color-mix(in oklab, var(--accent) 12%, transparent) 0%, transparent 60%), radial-gradient(60% 100% at 10% 0%, color-mix(in oklab, var(--chrome-low) 30%, transparent) 0%, transparent 55%), linear-gradient(180deg, var(--bg-elev) 0%, var(--bg-deep) 100%)",
  ice:
    "radial-gradient(72% 130% at 50% 0%, color-mix(in oklab, var(--chrome-hi) 10%, transparent) 0%, transparent 55%), linear-gradient(180deg, var(--bg-deep) 0%, var(--bg-elev) 100%)",
};

/* ------------------------------ atoms ------------------------------ */

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-2.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11" />
    </svg>
  );
}

function StarGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="m12 3 2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8L12 3Z" />
    </svg>
  );
}

/** Robotic wash: side-view car with water drops. */
function CarWashGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M8 34c0-3.6 2.4-6 6.2-6.6l6.4-7.6c1.6-1.9 3.8-2.8 6.2-2.8h14.6c2.6 0 5 .9 6.7 2.6l7 7.4h9.5c3.4 0 6.2 2.8 6.4 6.2V38H8v-4Z" />
      <path d="M34 17.6h11.4c1.7 0 3.2.6 4.4 1.8l5 5.2" opacity="0.7" />
      <circle cx="27" cy="38" r="5" />
      <circle cx="70" cy="38" r="5" />
      <path d="M20 8c0-2 1.2-3.4 2.6-3.4S25.2 6 25.2 8c0 1.8-2.6 4-2.6 4S20 9.8 20 8Z" opacity="0.8" />
      <path d="M39 6c0-2 1.2-3.4 2.6-3.4S44.2 4 44.2 6c0 1.8-2.6 4-2.6 4S39 7.8 39 6Z" opacity="0.55" />
    </svg>
  );
}

function BrowserBar({ path }: { path: string }) {
  return (
    <div className="flex h-7 shrink-0 items-center gap-3 border-b border-line bg-bg/50 px-3">
      <span aria-hidden className="flex w-7 items-center gap-1.5">
        <span className="block size-[5px] rounded-full bg-line-strong" />
        <span className="block size-[5px] rounded-full bg-line-strong" />
        <span className="block size-[5px] rounded-full bg-line-strong" />
      </span>
      <span className="mx-auto flex h-[18px] min-w-0 max-w-[64%] items-center gap-1.5 rounded-full border border-line bg-bg-deep px-2.5 font-mono text-[0.5rem] leading-none tracking-[0.02em] text-faint">
        <LockIcon />
        <span className="truncate">{path}</span>
      </span>
      <span aria-hidden className="w-7 shrink-0" />
    </div>
  );
}

function Window({ path, children }: { path: string; children: ReactNode }) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[10px] border border-line-strong/70 bg-bg-deep shadow-[var(--shadow-lift)]">
      <BrowserBar path={path} />
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}

function Bars({
  heights,
  accentIndex,
  className = "",
}: {
  heights: string[];
  accentIndex?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-end gap-1 ${className}`}>
      {heights.map((height, i) => (
        <span
          key={i}
          className={`flex-1 rounded-t-[2px] ${
            i === accentIndex ? "bg-accent" : "bg-line-strong"
          } ${height}`}
        />
      ))}
    </div>
  );
}

function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative flex h-[88%] aspect-[9/18] flex-col overflow-hidden rounded-[16px] border border-line-strong/70 bg-bg-elev p-[3px] shadow-[var(--shadow-lift)] ${className}`}
    >
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[13px] bg-bg-deep">
        <span aria-hidden className="mx-auto mt-1 h-[3px] w-8 shrink-0 rounded-full bg-line-strong" />
        {children}
      </div>
    </div>
  );
}

/* --------------------------- case mockups --------------------------- */

/** 1 · АСКО PLUS / Asko Support — review admin for a fuel + EV-charge network. */
function DashboardMockup() {
  const nav = ["Отзывы", "Станции", "Менеджеры", "Статистика", "Настройки"];

  const kpis: { label: string; value: string; delta?: string; star?: boolean }[] = [
    { label: "Новые", value: "24", delta: "+6" },
    { label: "Обработано", value: "118", delta: "+12" },
    { label: "Средняя", value: "4,8", star: true },
  ];

  return (
    <Window path={DOMAINS.dashboard}>
      <div className="flex h-full">
        <aside className="hidden w-[22%] shrink-0 flex-col border-r border-line p-3 md:flex">
          <div className="flex items-center gap-1.5">
            <span className="grid size-4 place-items-center rounded-[3px] bg-accent font-display text-[0.5rem] font-semibold leading-none text-accent-ink">
              А
            </span>
            <span className="font-display text-[0.5rem] font-medium uppercase tracking-[0.16em] text-fg">
              АСКО
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            {nav.map((label, i) => (
              <span
                key={label}
                className={`flex h-[18px] items-center gap-1.5 rounded-[4px] px-1.5 text-[0.5rem] leading-none ${
                  i === 0 ? "bg-glass text-fg" : "text-faint"
                }`}
              >
                <span
                  className={`size-1 rounded-full ${i === 0 ? "bg-accent" : "bg-line-strong"}`}
                />
                {label}
              </span>
            ))}
          </div>
          <div className="mt-auto rounded-[5px] border border-line p-2">
            <span className="block font-mono text-[0.4375rem] uppercase leading-none tracking-[0.08em] text-faint">
              Онлайн
            </span>
            <span className="mt-1 block font-display text-[0.625rem] leading-none text-fg">
              4 / 5
            </span>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="block font-mono text-[0.4375rem] uppercase leading-none tracking-[0.14em] text-faint">
                Модерация · Asko Support
              </span>
              <span className="mt-1 block font-display text-[0.625rem] leading-none text-fg">
                Отзывы клиентов
              </span>
            </div>
            <span className="shrink-0 rounded-[4px] bg-accent px-2 py-1 font-mono text-[0.4375rem] uppercase leading-none tracking-[0.06em] text-accent-ink">
              + Ссылка
            </span>
          </div>

          <div className="mt-2.5 grid shrink-0 grid-cols-3 gap-1.5">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="rounded-[5px] border border-line bg-bg/40 p-1.5">
                <span className="block font-mono text-[0.4375rem] uppercase leading-none tracking-[0.06em] text-faint">
                  {kpi.label}
                </span>
                <span className="mt-1 flex items-baseline justify-between gap-1">
                  <span className="font-display text-[0.625rem] leading-none text-fg">
                    {kpi.value}
                  </span>
                  {kpi.star ? (
                    <StarGlyph className="size-2 text-accent" />
                  ) : (
                    <span className="font-mono text-[0.4375rem] leading-none text-accent">
                      {kpi.delta}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-1.5 grid gap-1.5 md:min-h-0 md:flex-1 md:grid-cols-[1.6fr_1fr]">
            <div className="flex flex-col rounded-[5px] border border-line bg-bg/40 p-2">
              <div className="flex shrink-0 items-center justify-between">
                <span className="font-mono text-[0.4375rem] uppercase tracking-[0.06em] text-faint">
                  Отзывы за неделю
                </span>
                <span className="font-mono text-[0.4375rem] leading-none text-fg">318</span>
              </div>
              <Bars
                heights={[
                  "h-[38%]",
                  "h-[58%]",
                  "h-[44%]",
                  "h-[72%]",
                  "h-[56%]",
                  "h-[92%]",
                  "h-[68%]",
                ]}
                accentIndex={5}
                className="mt-2 h-9 md:min-h-0 md:flex-1"
              />
              <div className="mt-1 flex shrink-0 justify-between font-mono text-[0.375rem] uppercase leading-none tracking-[0.04em] text-faint">
                {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
            </div>

            <div className="hidden flex-col rounded-[5px] border border-line bg-bg/40 p-2 md:flex">
              <span className="shrink-0 font-mono text-[0.4375rem] uppercase tracking-[0.06em] text-faint">
                Последние
              </span>
              <div className="mt-1.5 flex flex-col gap-1.5 md:flex-1 md:justify-between">
                {[
                  { id: "№1842", place: "АЗС №12", stars: 5, state: "Принято" },
                  { id: "№1841", place: "ЭЗС №4", stars: 4, state: "В работе" },
                  { id: "№1840", place: "АЗС №7", stars: 5, state: "Новый" },
                ].map((row) => (
                  <div
                    key={row.id}
                    className="flex items-center justify-between gap-1.5 border-b border-line pb-1.5 last:border-b-0 last:pb-0"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-mono text-[0.4375rem] leading-none text-fg">
                        {row.id} · {row.place}
                      </span>
                      <span className="mt-1 flex items-center gap-[1px] text-accent">
                        {Array.from({ length: row.stars }).map((_, i) => (
                          <StarGlyph key={i} className="size-1.5" />
                        ))}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full border border-line px-1 py-0.5 font-mono text-[0.375rem] uppercase leading-none tracking-[0.02em] text-muted">
                      {row.state}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
}

/** 2 · ШАХ LOUNGE — real screenshots of the site with a lightbox. */
function ShahLightbox({
  index,
  closeRef,
  onClose,
  onPrev,
  onNext,
  onSelect,
}: {
  index: number;
  closeRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}) {
  const shot = SHAH_GALLERY[index];

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-bg-deep/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Фотографии сайта ШАХ LOUNGE"
      onClick={onClose}
    >
      <div
        className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 md:px-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="min-w-0">
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-accent">
            ШАХ LOUNGE · {index + 1} / {SHAH_GALLERY.length}
          </span>
          <p className="mt-1 truncate text-sm text-fg">{shot.caption}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href="https://shah-hookah-bar.ru/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-fg transition-colors hover:border-accent hover:text-accent sm:inline-flex"
          >
            Перейти на сайт
            <ArrowUpRight aria-hidden className="size-3.5" />
          </a>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Закрыть фотографии"
            className="grid size-11 place-items-center rounded-full border border-line text-fg transition-colors hover:border-accent hover:text-accent"
          >
            <Close aria-hidden className="size-5" />
          </button>
        </div>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center p-4 md:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onPrev}
          aria-label="Предыдущее фото"
          className="absolute left-2 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-bg-deep/80 text-fg backdrop-blur transition-colors hover:border-accent hover:text-accent md:left-6"
        >
          <ArrowRight aria-hidden className="size-5 rotate-180" />
        </button>

        <Image
          src={shot.src}
          alt={shot.alt}
          className="max-h-full w-auto max-w-full rounded-lg border border-line object-contain"
        />

        <button
          type="button"
          onClick={onNext}
          aria-label="Следующее фото"
          className="absolute right-2 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-bg-deep/80 text-fg backdrop-blur transition-colors hover:border-accent hover:text-accent md:right-6"
        >
          <ArrowRight aria-hidden className="size-5" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 border-t border-line px-4 py-3">
        {SHAH_GALLERY.map((item, i) => (
          <button
            key={item.caption}
            type="button"
            aria-label={`Фото ${i + 1}: ${item.caption}`}
            aria-current={i === index}
            onClick={() => onSelect(i)}
            className={`h-1.5 w-8 rounded-full transition-colors ${
              i === index ? "bg-accent" : "bg-line-strong hover:bg-fg/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function LandingMockup() {
  const [active, setActive] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") {
        setActive((i) => (i === null ? i : (i + 1) % SHAH_GALLERY.length));
      }
      if (event.key === "ArrowLeft") {
        setActive((i) => (i === null ? i : (i - 1 + SHAH_GALLERY.length) % SHAH_GALLERY.length));
      }
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [active]);

  return (
    <>
      <Window path={DOMAINS.landing}>
        <div className="relative h-full w-full overflow-hidden bg-bg-deep">
          <button
            type="button"
            onClick={() => setActive(0)}
            aria-label="Открыть фотографии сайта ШАХ LOUNGE"
            className="group/photo absolute inset-0 block cursor-zoom-in"
          >
            <Image
              src={shahHero}
              alt="Главный экран сайта ШАХ LOUNGE"
              fill
              sizes="(max-width: 1024px) 92vw, 860px"
              className="object-cover object-top transition-transform duration-500 group-hover/photo:scale-[1.02]"
            />
            <span className="pointer-events-none absolute right-2 top-2 rounded-full border border-line-strong bg-bg-deep/85 px-2 py-1 font-mono text-[0.4375rem] uppercase tracking-[0.08em] text-fg opacity-0 backdrop-blur transition-opacity group-hover/photo:opacity-100">
              {SHAH_GALLERY.length} фото
            </span>
          </button>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/35 to-transparent" />

          <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <span className="font-mono text-[0.4375rem] uppercase tracking-[0.14em] text-accent">
                Сайт · shah-hookah-bar.ru
              </span>
              <p className="mt-1 font-display text-[0.75rem] leading-[1.1] tracking-[-0.02em] text-fg md:text-[0.9375rem]">
                Кальянная и кофейня в Махачкале
              </p>
            </div>

            <div className="pointer-events-auto hidden shrink-0 items-center gap-1.5 md:flex">
              {SHAH_GALLERY.slice(1).map((shot, index) => (
                <button
                  key={shot.caption}
                  type="button"
                  onClick={() => setActive(index + 1)}
                  aria-label={`Открыть фото: ${shot.caption}`}
                  className="relative block h-9 w-14 overflow-hidden rounded-[4px] border border-line-strong/70 bg-bg-deep transition-transform duration-150 hover:scale-105 hover:border-accent"
                >
                  <Image src={shot.src} alt="" fill sizes="56px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Window>

      {active !== null
        ? createPortal(
            <ShahLightbox
              index={active}
              closeRef={closeRef}
              onClose={() => setActive(null)}
              onPrev={() =>
                setActive((i) => (i === null ? i : (i - 1 + SHAH_GALLERY.length) % SHAH_GALLERY.length))
              }
              onNext={() =>
                setActive((i) => (i === null ? i : (i + 1) % SHAH_GALLERY.length))
              }
              onSelect={(index) => setActive(index)}
            />,
            document.body,
          )
        : null}
    </>
  );
}

/** 3 · E13-WASH — terminal with tariffs for a robotic car wash. */
function CommerceMockup() {
  const tariffs: { name: string; price: string; time: string; highlight?: boolean }[] = [
    { name: "Экспресс", price: "490 ₽", time: "3 мин" },
    { name: "Стандарт", price: "790 ₽", time: "5 мин", highlight: true },
    { name: "Премиум", price: "1 200 ₽", time: "8 мин" },
  ];

  return (
    <Window path={DOMAINS.commerce}>
      <div className="flex h-full flex-col">
        <div className="flex h-8 shrink-0 items-center justify-between gap-2 border-b border-line px-3">
          <span className="font-display text-[0.5625rem] font-medium uppercase tracking-[0.2em] text-fg">
            E13-WASH
          </span>
          <span className="hidden items-center gap-3 font-mono text-[0.4375rem] uppercase tracking-[0.08em] text-faint md:flex">
            <span>Мойки</span>
            <span className="text-accent">Тарифы</span>
          </span>
          <span className="flex items-center gap-1 rounded-full border border-line px-1.5 py-0.5 font-mono text-[0.4375rem] uppercase leading-none tracking-[0.04em] text-fg">
            <span className="size-1 rounded-full bg-accent animate-pulse-soft" />
            24/7
          </span>
        </div>

        <div className="flex min-h-0 flex-1 gap-2 p-3">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex flex-wrap items-center gap-1">
              {["Экспресс", "Стандарт", "Премиум"].map((filter, i) => (
                <span
                  key={filter}
                  className={`rounded-full border px-1.5 py-0.5 font-mono text-[0.4375rem] uppercase leading-none tracking-[0.04em] ${
                    i === 1 ? "border-line-strong bg-glass text-fg" : "border-line text-faint"
                  }`}
                >
                  {filter}
                </span>
              ))}
              <span className="ml-auto font-mono text-[0.4375rem] leading-none text-faint">
                Терминал · 4
              </span>
            </div>

            <div className="mt-2 grid flex-1 grid-cols-3 gap-1.5">
              {tariffs.map((tariff) => (
                <div
                  key={tariff.name}
                  className={`relative flex flex-col overflow-hidden rounded-[5px] border p-1.5 ${
                    tariff.highlight
                      ? "border-accent/50 bg-accent/[0.06]"
                      : "border-line bg-bg/40"
                  }`}
                >
                  {tariff.highlight ? (
                    <span className="absolute right-1 top-1 rounded-full bg-accent px-1 py-0.5 font-mono text-[0.3125rem] uppercase leading-none text-accent-ink">
                      Хит
                    </span>
                  ) : null}
                  <div className="flex flex-1 items-center justify-center py-1">
                    <CarWashGlyph
                      className={`w-[76%] ${tariff.highlight ? "text-accent-dim" : "text-line-strong"}`}
                    />
                  </div>
                  <span className="block truncate font-mono text-[0.4375rem] uppercase leading-none tracking-[0.04em] text-fg">
                    {tariff.name}
                  </span>
                  <span className="mt-1 flex items-baseline justify-between gap-1">
                    <span
                      className={`font-display text-[0.5rem] leading-none ${
                        tariff.highlight ? "text-accent" : "text-fg"
                      }`}
                    >
                      {tariff.price}
                    </span>
                    <span className="font-mono text-[0.3125rem] leading-none text-faint">
                      {tariff.time}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden w-[32%] shrink-0 flex-col rounded-[6px] border border-line bg-bg/40 p-2 md:flex">
            <div className="flex items-center justify-between gap-1">
              <span className="font-mono text-[0.4375rem] uppercase tracking-[0.08em] text-fg">
                Оплата
              </span>
              <span className="flex shrink-0 items-center gap-1">
                <span className="size-1 rounded-full bg-accent animate-pulse-soft" />
                <span className="font-mono text-[0.3125rem] uppercase leading-none tracking-[0.04em] text-faint">
                  Терминал онлайн
                </span>
              </span>
            </div>

            <div className="mt-2 flex items-baseline justify-between border-b border-line pb-1.5">
              <span className="font-mono text-[0.375rem] uppercase leading-none tracking-[0.06em] text-faint">
                К оплате
              </span>
              <span className="font-display text-[0.625rem] leading-none text-fg">790 ₽</span>
            </div>

            <span className="mt-2 block rounded-[4px] bg-accent py-1 text-center font-mono text-[0.4375rem] uppercase leading-none tracking-[0.04em] text-accent-ink">
              Оплатить картой
            </span>

            <div className="mt-auto flex items-center justify-between border-t border-line pt-1.5">
              <span className="font-mono text-[0.375rem] leading-none text-faint">QR / СБП</span>
              <span className="grid size-4 place-items-center rounded-[2px] border border-line-strong">
                <span className="grid grid-cols-2 gap-[1px]">
                  <span className="size-[2px] bg-fg" />
                  <span className="size-[2px] bg-fg" />
                  <span className="size-[2px] bg-fg" />
                  <span className="size-[2px] bg-fg" />
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
}

/** 4 · E13-CHARGE — payment screen of the EV charging app (ЮKassa). */
function MobileMockup() {
  return (
    <div className="relative flex h-full w-full items-center justify-center gap-4">
      <span aria-hidden className="pointer-events-none absolute inset-0 dot-field opacity-[0.1]" />

      <PhoneFrame className="-rotate-[1.5deg]">
        <div className="flex flex-1 flex-col p-1.5">
          <div className="flex items-center justify-between">
            <span className="font-display text-[0.4375rem] uppercase leading-none tracking-[0.06em] text-fg">
              E13-CHARGE
            </span>
            <span className="size-1 rounded-full bg-accent animate-pulse-soft" />
          </div>

          <span className="mt-2 font-mono text-[0.375rem] uppercase leading-none tracking-[0.06em] text-faint">
            Баланс
          </span>
          <span className="mt-0.5 font-display text-[0.5625rem] leading-none text-fg">1 240 ₽</span>

          <span className="mt-1 flex h-4 items-center justify-center rounded-[4px] bg-accent font-mono text-[0.375rem] uppercase leading-none tracking-[0.04em] text-accent-ink">
            Пополнить баланс
          </span>

          <div className="mt-1.5 rounded-[4px] border border-line p-1.5">
            <div className="flex items-center justify-between gap-1">
              <span className="font-mono text-[0.375rem] leading-none text-fg">ЭЗС №12</span>
              <span className="font-mono text-[0.3125rem] leading-none text-accent">Свободна</span>
            </div>
            <span className="mt-1 block font-mono text-[0.3125rem] uppercase leading-none tracking-[0.04em] text-faint">
              150 кВт · CCS2
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-line pt-1">
            <span className="font-mono text-[0.3125rem] leading-none text-faint">•• 4242</span>
            <span className="font-mono text-[0.3125rem] uppercase leading-none tracking-[0.04em] text-accent">
              ЮKassa
            </span>
          </div>

          <div className="mt-1 flex items-center justify-between border-t border-line pt-1">
            {["Зарядки", "Оплата", "Профиль"].map((tab, i) => (
              <span
                key={tab}
                className={`font-mono text-[0.3125rem] uppercase leading-none tracking-[0.03em] ${
                  i === 1 ? "text-accent" : "text-faint"
                }`}
              >
                {tab}
              </span>
            ))}
          </div>
        </div>
      </PhoneFrame>

      <PhoneFrame className="hidden rotate-[1.5deg] sm:flex">
        <div className="flex flex-1 flex-col p-1.5">
          <div className="flex items-center justify-between">
            <span className="font-display text-[0.4375rem] leading-none text-fg">ЭЗС №12</span>
            <span className="rounded-full border border-line px-1 py-0.5 font-mono text-[0.3125rem] leading-none text-faint">
              CCS2
            </span>
          </div>
          <span className="mt-2 font-mono text-[0.375rem] uppercase leading-none tracking-[0.06em] text-faint">
            Мощность
          </span>
          <span className="mt-0.5 font-display text-[0.5rem] leading-none text-fg">150 кВт</span>
          <span className="mt-1 font-mono text-[0.3125rem] leading-none text-accent">Свободна</span>

          <div className="mt-2 flex flex-col gap-1">
            {[
              ["Коннектор", "CCS2"],
              ["Сеть", "E13"],
            ].map(([label, value]) => (
              <span
                key={label}
                className="flex items-center justify-between border-b border-line pb-1 last:border-b-0 last:pb-0"
              >
                <span className="font-mono text-[0.3125rem] leading-none text-faint">{label}</span>
                <span className="font-mono text-[0.3125rem] leading-none text-fg">{value}</span>
              </span>
            ))}
          </div>
        </div>
      </PhoneFrame>

      <div className="absolute bottom-[13%] right-[6%] hidden items-center gap-1 rounded-full border border-line bg-bg-deep/90 px-2 py-1 font-mono text-[0.375rem] uppercase leading-none tracking-[0.06em] text-muted backdrop-blur-sm md:flex">
        <LockIcon />
        ЮKassa · оплата
      </div>
    </div>
  );
}

/** 5 · E13-MONITORING / EVMap — charging-station registry and map. */
function ConfiguratorMockup() {
  const stations = [
    { name: "ЭЗС №12", status: "работает", on: true },
    { name: "ЭЗС №4", status: "ТО", on: false },
    { name: "ЭЗС №7", status: "offline", on: false },
  ];

  return (
    <Window path={DOMAINS.configurator}>
      <div className="flex h-full flex-col">
        <div className="flex h-8 shrink-0 items-center gap-2 border-b border-line px-3">
          <span className="font-display text-[0.5625rem] font-medium uppercase tracking-[0.24em] text-fg">
            E13 MONITORING
          </span>
          <span className="hidden font-mono text-[0.4375rem] uppercase tracking-[0.06em] text-faint md:inline">
            EVMap · реестр ЭЗС
          </span>
          <span className="ml-auto shrink-0 rounded-full border border-line px-1.5 py-0.5 font-mono text-[0.4375rem] uppercase leading-none tracking-[0.04em] text-fg">
            OCPP 1.6J
          </span>
        </div>

        <div className="grid min-h-0 flex-1 gap-2 p-3 md:grid-cols-[1.2fr_0.9fr]">
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-[6px] border border-line bg-bg/40">
              <span className="absolute left-2 top-2 z-10 font-mono text-[0.4375rem] uppercase tracking-[0.08em] text-faint">
                Карта · ЭЗС
              </span>
              <span aria-hidden className="grid-field absolute inset-0 opacity-40" />
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden
                className="absolute inset-0 h-full w-full"
              >
                <path
                  d="M18 62 40 44 64 54 82 32"
                  fill="none"
                  strokeWidth="0.5"
                  strokeDasharray="2 2"
                  className="stroke-line-strong"
                />
              </svg>
              <span
                aria-hidden
                className="absolute left-[16%] top-[44%] flex flex-col items-center gap-0.5"
              >
                <span className="rounded-[3px] border border-accent/40 bg-bg-deep px-1 py-0.5 font-mono text-[0.3125rem] uppercase leading-none tracking-[0.04em] text-accent">
                  №12
                </span>
                <span className="size-1.5 rounded-full border border-accent bg-accent/40" />
              </span>
              <span
                aria-hidden
                className="absolute left-[38%] top-[36%] size-1 rounded-full border border-line-strong bg-bg-elev"
              />
              <span
                aria-hidden
                className="absolute left-[62%] top-[50%] size-1 rounded-full border border-line-strong bg-bg-elev"
              />
              <span
                aria-hidden
                className="absolute left-[80%] top-[28%] size-1 rounded-full border border-line-strong bg-bg-elev"
              />
            </div>

            <div className="flex shrink-0 flex-col gap-1">
              {stations.map((station) => (
                <span
                  key={station.name}
                  className="flex items-center justify-between gap-2 border-b border-line pb-1 last:border-b-0 last:pb-0"
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span
                      className={`size-1 shrink-0 rounded-full ${
                        station.on ? "bg-accent" : "bg-line-strong"
                      }`}
                    />
                    <span className="truncate font-mono text-[0.375rem] leading-none text-fg">
                      {station.name}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 font-mono text-[0.3125rem] uppercase leading-none tracking-[0.04em] ${
                      station.on ? "text-accent" : "text-faint"
                    }`}
                  >
                    {station.status}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="hidden flex-col rounded-[6px] border border-line bg-bg/40 p-2 md:flex">
            <span className="font-mono text-[0.4375rem] uppercase tracking-[0.1em] text-faint">
              Паспорт станции
            </span>
            <span className="mt-1 block font-display text-[0.5625rem] leading-none text-fg">
              ЭЗС №12
            </span>

            <div className="mt-1.5 flex flex-col gap-1">
              {[
                ["Мощность", "150 кВт"],
                ["Разъёмы", "CCS2 / GB-T"],
                ["Протокол", "OCPP 1.6J"],
                ["Документы", "5/6"],
              ].map(([label, value]) => (
                <span
                  key={label}
                  className="flex items-center justify-between gap-1 border-b border-line pb-1 last:border-b-0 last:pb-0"
                >
                  <span className="font-mono text-[0.3125rem] leading-none text-faint">{label}</span>
                  <span className="font-mono text-[0.3125rem] leading-none text-fg">{value}</span>
                </span>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-1 border-t border-line pt-1.5">
              {[
                { label: "Паспорт", on: true },
                { label: "ТО", on: true },
                { label: "Гарантия", on: false },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-1.5">
                  <span
                    className={`grid size-2.5 place-items-center rounded-[2px] border ${
                      item.on ? "border-accent bg-accent" : "border-line-strong"
                    }`}
                  >
                    {item.on ? (
                      <svg
                        viewBox="0 0 24 24"
                        className="size-1.5 text-accent-ink"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={4}
                        aria-hidden
                      >
                        <path d="m5 13 4 4L19 7" />
                      </svg>
                    ) : null}
                  </span>
                  <span className="font-mono text-[0.3125rem] leading-none text-faint">
                    {item.label}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
}

/* ----------------------------- selector ----------------------------- */

const MOCKUPS: Record<CaseStudy["visual"], () => ReactNode> = {
  dashboard: DashboardMockup,
  landing: LandingMockup,
  commerce: CommerceMockup,
  configurator: ConfiguratorMockup,
  mobile: MobileMockup,
};

export default function CaseVisual({
  visual,
  tone,
}: {
  visual: CaseStudy["visual"];
  tone: CaseStudy["tone"];
}) {
  const Mockup = MOCKUPS[visual];

  return (
    <div
      aria-hidden
      className="relative h-full w-full overflow-hidden"
      style={{ backgroundImage: TONE_BACKDROP[tone] }}
    >
      <span
        aria-hidden
        className="grain pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
      />
      <div className="relative h-full w-full p-3 md:p-5">
        <Mockup />
      </div>
    </div>
  );
}
