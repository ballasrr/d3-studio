import type { ReactNode } from "react";

import type { CaseStudy } from "@/content/site";

/* ------------------------------------------------------------------ */
/* Case visuals are built from DOM + inline SVG: browser chrome, real  */
/* Russian UI labels, charts, tables and price grids. No raster art.   */
/* ------------------------------------------------------------------ */

const DOMAINS: Record<CaseStudy["visual"], string> = {
  dashboard: "orbita.ru/cabinet",
  landing: "sever-kvartal.ru",
  commerce: "stravinsky.store",
  mobile: "axiom.finance/app",
  configurator: "molot-pro.ru/configurator",
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

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-1.5" fill="currentColor" aria-hidden>
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-2 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
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

function SneakerGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 88 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M8 34c0-3.4 2.4-5.6 6.4-6.6l9.4-8.2c2-1.8 4.4-1.8 6.2.2l4.6 4.4 13.6 3.8C55 29.5 59 31 59 34H8Z" />
      <path d="M24 18.8 20 27M31 17l-3.6 8.6" />
      <path d="M8 34h55" />
    </svg>
  );
}

function BuildingGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 96"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M14 82 80 48l66 34" opacity="0.45" />
      <path d="M30 74V44l22-11 22 11v30" />
      <path d="M30 44l22-11 22 11" opacity="0.6" />
      <path d="M37 55h7M37 63h7M37 71h7M52 50v24" opacity="0.8" />
      <path d="M88 78V38l19-9.5L126 38v40" />
      <path d="M88 38l19-9.5L126 38" opacity="0.6" />
      <path d="M96 49h7M96 57h7M96 65h7M109 49h7M109 57h7M109 65h7" opacity="0.8" />
      <path d="M60 84h44" opacity="0.35" />
    </svg>
  );
}

function DeskGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 150 96"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M22 46 75 22l53 24-53 24-53-24Z" />
      <path d="M22 46v6l53 24 53-24v-6" opacity="0.7" />
      <path d="M38 56v22M112 56v22M62 67v20M88 67v20" opacity="0.75" />
      <path d="M22 84h36M92 84h36" opacity="0.4" />
      <path d="M22 34v12M128 34v12" opacity="0.5" />
      <path d="M18 40h8M124 40h8" opacity="0.5" />
    </svg>
  );
}

/* --------------------------- case mockups --------------------------- */

function DashboardMockup() {
  const nav = ["Обзор", "Заявки", "Рейсы", "Документы", "Оплаты", "Парк"];

  return (
    <Window path={DOMAINS.dashboard}>
      <div className="flex h-full">
        <aside className="hidden w-[21%] shrink-0 flex-col border-r border-line p-3 md:flex">
          <div className="flex items-center gap-1.5">
            <span className="grid size-4 place-items-center rounded-[3px] bg-accent font-display text-[0.5rem] font-semibold leading-none text-accent-ink">
              O
            </span>
            <span className="font-display text-[0.5rem] font-medium uppercase tracking-[0.16em] text-fg">
              ORBITA
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            {nav.map((label, i) => (
              <span
                key={label}
                className={`flex h-[18px] items-center gap-1.5 rounded-[4px] px-1.5 text-[0.5rem] leading-none ${
                  i === 1 ? "bg-glass text-fg" : "text-faint"
                }`}
              >
                <span
                  className={`size-1 rounded-full ${i === 1 ? "bg-accent" : "bg-line-strong"}`}
                />
                {label}
              </span>
            ))}
          </div>
          <div className="mt-auto rounded-[5px] border border-line p-2">
            <span className="block font-mono text-[0.4375rem] uppercase leading-none tracking-[0.08em] text-faint">
              Свободно
            </span>
            <span className="mt-1 block font-display text-[0.625rem] leading-none text-fg">
              12 / 24
            </span>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="block font-mono text-[0.4375rem] uppercase leading-none tracking-[0.14em] text-faint">
                Рабочий стол
              </span>
              <span className="mt-1 block font-display text-[0.625rem] leading-none text-fg">
                Заявки на перевозку
              </span>
            </div>
            <span className="shrink-0 rounded-[4px] bg-accent px-2 py-1 font-mono text-[0.4375rem] uppercase leading-none tracking-[0.06em] text-accent-ink">
              + Заявка
            </span>
          </div>

          <div className="mt-2.5 grid shrink-0 grid-cols-3 gap-1.5">
            {[
              { label: "Активные", value: "24", delta: "+6" },
              { label: "В пути", value: "8", delta: "+2" },
              { label: "Ср. подача", value: "2ч 14м", delta: "−11%" },
            ].map((kpi) => (
              <div key={kpi.label} className="rounded-[5px] border border-line bg-bg/40 p-1.5">
                <span className="block font-mono text-[0.4375rem] uppercase leading-none tracking-[0.06em] text-faint">
                  {kpi.label}
                </span>
                <span className="mt-1 flex items-baseline justify-between gap-1">
                  <span className="font-display text-[0.625rem] leading-none text-fg">
                    {kpi.value}
                  </span>
                  <span className="font-mono text-[0.4375rem] leading-none text-accent">
                    {kpi.delta}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <div className="mt-1.5 grid gap-1.5 md:min-h-0 md:flex-1 md:grid-cols-[1.6fr_1fr]">
            <div className="flex flex-col rounded-[5px] border border-line bg-bg/40 p-2">
              <div className="flex shrink-0 items-center justify-between">
                <span className="font-mono text-[0.4375rem] uppercase tracking-[0.06em] text-faint">
                  Рейсы за неделю
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
                  { id: "№1842", route: "Москва — Казань", state: "В пути" },
                  { id: "№1841", route: "Тверь — СПб", state: "Оплачен" },
                  { id: "№1840", route: "Мск — Сочи", state: "Новая" },
                ].map((row) => (
                  <div
                    key={row.id}
                    className="flex items-center justify-between gap-2 border-b border-line pb-1.5 last:border-b-0 last:pb-0"
                  >
                    <span className="min-w-0">
                      <span className="block font-mono text-[0.4375rem] leading-none text-fg">
                        {row.id}
                      </span>
                      <span className="mt-0.5 block truncate text-[0.4375rem] leading-none text-faint">
                        {row.route}
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

function LandingMockup() {
  return (
    <Window path={DOMAINS.landing}>
      <div className="flex h-full flex-col">
        <div className="flex h-8 shrink-0 items-center justify-between border-b border-line px-3">
          <span className="font-display text-[0.5625rem] font-medium uppercase tracking-[0.3em] text-fg">
            СЕВЕР
          </span>
          <span className="hidden items-center gap-3 font-mono text-[0.4375rem] uppercase tracking-[0.08em] text-faint md:flex">
            <span>Квартиры</span>
            <span>Двор</span>
            <span>Ипотека</span>
            <span>Ход стройки</span>
          </span>
          <span className="rounded-full border border-line px-1.5 py-0.5 font-mono text-[0.4375rem] uppercase leading-none tracking-[0.04em] text-fg">
            Бронь
          </span>
        </div>

        <div className="grid min-h-0 flex-1 gap-3 p-3 md:grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-col justify-center">
            <span className="font-mono text-[0.4375rem] uppercase tracking-[0.14em] text-faint">
              ЖК «Северный» · сдача 2027
            </span>
            <span className="mt-1.5 font-display text-[0.875rem] font-medium leading-[1.02] tracking-[-0.04em] text-fg md:text-[1.125rem]">
              Двор, в котором
              <br />
              хочется жить
            </span>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-accent px-2 py-1 font-mono text-[0.4375rem] uppercase leading-none tracking-[0.04em] text-accent-ink">
                Выбрать квартиру
              </span>
              <span className="flex items-center gap-1 rounded-full border border-line px-2 py-1 font-mono text-[0.4375rem] uppercase leading-none tracking-[0.04em] text-muted">
                <PlayGlyph /> 3D-тур по двору
              </span>
            </div>
            <div className="mt-2.5 flex items-center gap-3 border-t border-line pt-2 font-mono text-[0.375rem] uppercase tracking-[0.04em] text-faint">
              <span>12 корпусов</span>
              <span className="size-[3px] rounded-full bg-line-strong" />
              <span>4 га парка</span>
              <span className="size-[3px] rounded-full bg-line-strong" />
              <span>метро 8 мин</span>
            </div>
          </div>

          <div className="relative hidden overflow-hidden rounded-[6px] border border-line bg-bg/40 md:block">
            <span className="absolute left-2 top-2 font-mono text-[0.4375rem] uppercase tracking-[0.08em] text-faint">
              Двор · 3D
            </span>
            <BuildingGlyph className="absolute inset-0 m-auto w-[86%] text-line-strong" />
            <span className="absolute bottom-2 right-2 rounded-full border border-line bg-bg-deep/80 px-2 py-1 font-mono text-[0.4375rem] uppercase leading-none tracking-[0.04em] text-muted">
              Смотреть
            </span>
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-3 gap-1.5 border-t border-line px-3 py-2">
          {[
            { type: "Студия", area: "24 м²", price: "7,9 млн ₽" },
            { type: "1-комн", area: "38 м²", price: "11,2 млн ₽" },
            { type: "2-комн", area: "54 м²", price: "15,6 млн ₽" },
          ].map((plan) => (
            <div
              key={plan.type}
              className="flex items-center justify-between gap-2 rounded-[5px] border border-line px-2 py-1.5"
            >
              <span className="min-w-0">
                <span className="block truncate font-mono text-[0.4375rem] uppercase leading-none tracking-[0.04em] text-fg">
                  {plan.type}
                </span>
                <span className="mt-0.5 block font-mono text-[0.375rem] leading-none text-faint">
                  {plan.area}
                </span>
              </span>
              <span className="shrink-0 font-display text-[0.5rem] leading-none text-fg">
                {plan.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}

function CommerceMockup() {
  const products = [
    { name: "Кеды Runner 02", price: "24 900 ₽", old: "31 900 ₽", ar: true },
    { name: "Сумка Tote 04", price: "18 400 ₽" },
    { name: "Лоферы City 01", price: "29 600 ₽" },
  ];

  return (
    <Window path={DOMAINS.commerce}>
      <div className="flex h-full flex-col">
        <div className="flex h-8 shrink-0 items-center justify-between gap-2 border-b border-line px-3">
          <span className="font-display text-[0.5625rem] font-medium uppercase tracking-[0.2em] text-fg">
            STRAVINSKY
          </span>
          <span className="hidden items-center gap-3 font-mono text-[0.4375rem] uppercase tracking-[0.08em] text-faint md:flex">
            <span>Новинки</span>
            <span>Обувь</span>
            <span>Сумки</span>
            <span className="text-accent">AR-примерка</span>
          </span>
          <span className="flex items-center gap-1 rounded-full border border-line px-1.5 py-0.5 font-mono text-[0.4375rem] uppercase leading-none tracking-[0.04em] text-fg">
            <span className="grid size-2.5 place-items-center rounded-full bg-accent font-mono text-[0.3125rem] leading-none text-accent-ink">
              2
            </span>
            Корзина
          </span>
        </div>

        <div className="flex min-h-0 flex-1 gap-2 p-3">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex flex-wrap items-center gap-1">
              {["Все", "Обувь", "Сумки", "Аксессуары"].map((filter, i) => (
                <span
                  key={filter}
                  className={`rounded-full border px-1.5 py-0.5 font-mono text-[0.4375rem] uppercase leading-none tracking-[0.04em] ${
                    i === 1
                      ? "border-line-strong bg-glass text-fg"
                      : "border-line text-faint"
                  }`}
                >
                  {filter}
                </span>
              ))}
              <span className="ml-auto font-mono text-[0.4375rem] leading-none text-faint">
                4 000 SKU
              </span>
            </div>

            <div className="mt-2 grid flex-1 grid-cols-3 gap-1.5">
              {products.map((product) => (
                <div
                  key={product.name}
                  className="flex flex-col overflow-hidden rounded-[5px] border border-line bg-bg/40"
                >
                  <div className="relative flex flex-1 items-center justify-center bg-linear-to-br from-glass to-transparent">
                    <SneakerGlyph className="w-[74%] text-line-strong" />
                    {product.ar ? (
                      <span className="absolute left-1 top-1 rounded-full border border-accent/40 bg-bg-deep/80 px-1 py-0.5 font-mono text-[0.375rem] uppercase leading-none text-accent">
                        AR
                      </span>
                    ) : null}
                    {product.old ? (
                      <span className="absolute right-1 top-1 rounded-full bg-accent px-1 py-0.5 font-mono text-[0.375rem] uppercase leading-none text-accent-ink">
                        −22%
                      </span>
                    ) : null}
                  </div>
                  <div className="px-1.5 pb-1.5 pt-1">
                    <span className="block truncate text-[0.4375rem] leading-none text-fg">
                      {product.name}
                    </span>
                    <span className="mt-1 flex items-baseline gap-1">
                      <span className="font-display text-[0.5rem] leading-none text-fg">
                        {product.price}
                      </span>
                      {product.old ? (
                        <span className="font-mono text-[0.375rem] leading-none text-faint line-through">
                          {product.old}
                        </span>
                      ) : null}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden w-[33%] shrink-0 flex-col rounded-[6px] border border-line bg-bg/40 p-2 md:flex">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.4375rem] uppercase tracking-[0.08em] text-fg">
                AR-примерка
              </span>
              <span className="size-1 rounded-full bg-accent animate-pulse-soft" />
            </div>
            <div className="relative mt-1.5 flex flex-1 items-center justify-center rounded-[4px] border border-dashed border-line-strong/60">
              <SneakerGlyph className="w-[78%] text-accent-dim" />
              <span className="absolute bottom-1 left-1 right-1 text-center font-mono text-[0.375rem] leading-none text-faint">
                Наведите камеру на стопу
              </span>
            </div>
            <span className="mt-1.5 rounded-[4px] bg-accent py-1 text-center font-mono text-[0.4375rem] uppercase leading-none tracking-[0.04em] text-accent-ink">
              Включить камеру
            </span>
          </div>
        </div>
      </div>
    </Window>
  );
}

function ConfiguratorMockup() {
  return (
    <Window path={DOMAINS.configurator}>
      <div className="flex h-full flex-col">
        <div className="flex h-8 shrink-0 items-center gap-2 border-b border-line px-3">
          <span className="font-display text-[0.5625rem] font-medium uppercase tracking-[0.26em] text-fg">
            MOLOT
          </span>
          <span className="hidden font-mono text-[0.4375rem] uppercase tracking-[0.06em] text-faint md:inline">
            Каталог · 1 800 позиций
          </span>
          <span className="ml-auto flex h-[18px] w-[34%] items-center gap-1 truncate rounded-full border border-line bg-bg px-2 font-mono text-[0.4375rem] text-faint">
            <SearchIcon />
            <span className="truncate">Стол оператора</span>
          </span>
          <span className="shrink-0 rounded-full border border-line px-1.5 py-0.5 font-mono text-[0.4375rem] uppercase leading-none tracking-[0.04em] text-fg">
            Заявка · 1
          </span>
        </div>

        <div className="grid min-h-0 flex-1 gap-2 p-3 md:grid-cols-[0.9fr_1.05fr_0.85fr]">
          <div className="relative hidden overflow-hidden rounded-[6px] border border-line bg-bg/40 md:block">
            <span className="absolute left-2 top-2 font-mono text-[0.4375rem] uppercase tracking-[0.08em] text-faint">
              Предпросмотр
            </span>
            <DeskGlyph className="absolute inset-0 m-auto w-[82%] text-line-strong" />
            <span className="absolute bottom-1.5 left-2 font-mono text-[0.375rem] leading-none text-faint">
              1200 × 700 × 750
            </span>
          </div>

          <div className="flex min-w-0 flex-col gap-2">
            <div>
              <span className="font-mono text-[0.4375rem] uppercase tracking-[0.1em] text-faint">
                Материал
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
                {["ЛДСП", "МДФ", "Металл"].map((material, i) => (
                  <span
                    key={material}
                    className={`rounded-[3px] border px-1.5 py-0.5 font-mono text-[0.4375rem] leading-none ${
                      i === 0
                        ? "border-accent/40 bg-accent/10 text-accent"
                        : "border-line text-faint"
                    }`}
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.4375rem] uppercase tracking-[0.1em] text-faint">
                  Ширина
                </span>
                <span className="font-mono text-[0.4375rem] leading-none text-fg">1200 мм</span>
              </div>
              <div className="relative mt-1.5 h-[3px] rounded-full bg-line">
                <span className="absolute inset-y-0 left-0 w-[64%] rounded-full bg-accent" />
                <span className="absolute -top-[3px] left-[64%] size-[9px] -translate-x-1/2 rounded-full border border-accent bg-bg-deep" />
              </div>
            </div>

            <div className="hidden sm:block">
              <span className="font-mono text-[0.4375rem] uppercase tracking-[0.1em] text-faint">
                Цвет
              </span>
              <div className="mt-1 flex items-center gap-1">
                <span className="size-3 rounded-full border border-line-strong bg-fg ring-2 ring-accent" />
                <span className="size-3 rounded-full border border-line-strong bg-bg-elev" />
                <span className="size-3 rounded-full border border-line-strong bg-accent-dim" />
                <span className="size-3 rounded-full border border-line-strong bg-line-strong" />
                <span className="ml-1 font-mono text-[0.375rem] leading-none text-faint">графит</span>
              </div>
            </div>

            <div className="mt-auto hidden flex-col gap-1 sm:flex">
              {[
                { label: "Тумба 2 шт", on: true },
                { label: "Подсветка", on: true },
                { label: "Колёса", on: false },
              ].map((option) => (
                <span key={option.label} className="flex items-center gap-1.5">
                  <span
                    className={`grid size-2.5 place-items-center rounded-[2px] border ${
                      option.on ? "border-accent bg-accent" : "border-line-strong"
                    }`}
                  >
                    {option.on ? (
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
                  <span className="font-mono text-[0.375rem] leading-none text-faint">
                    {option.label}
                  </span>
                </span>
              ))}
            </div>

            <div className="mt-1 flex items-baseline justify-between border-t border-line pt-1.5 sm:hidden">
              <span className="font-mono text-[0.375rem] uppercase leading-none tracking-[0.06em] text-faint">
                Итого
              </span>
              <span className="font-display text-[0.5625rem] leading-none text-fg">
                142 400 ₽
              </span>
            </div>
          </div>

          <div className="hidden flex-col rounded-[6px] border border-line bg-bg/40 p-2 md:flex">
            <span className="font-mono text-[0.4375rem] uppercase tracking-[0.1em] text-faint">
              Комплектация
            </span>
            <div className="mt-1.5 flex flex-col gap-1">
              {[
                ["База", "89 000 ₽"],
                ["Тумбы 2 шт", "24 000 ₽"],
                ["Подсветка", "12 000 ₽"],
              ].map(([label, price]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-2 border-b border-line pb-1 last:border-b-0 last:pb-0"
                >
                  <span className="font-mono text-[0.375rem] leading-none text-faint">{label}</span>
                  <span className="font-mono text-[0.375rem] leading-none text-fg">{price}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto border-t border-line pt-1.5">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[0.4375rem] uppercase leading-none tracking-[0.06em] text-faint">
                  Итого
                </span>
                <span className="font-display text-[0.625rem] leading-none text-fg">
                  142 400 ₽
                </span>
              </div>
              <span className="mt-1.5 block rounded-[4px] bg-accent py-1 text-center font-mono text-[0.4375rem] uppercase leading-none tracking-[0.04em] text-accent-ink">
                В заявку
              </span>
            </div>
          </div>
        </div>
      </div>
    </Window>
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

function MobileMockup() {
  return (
    <div className="relative flex h-full w-full items-center justify-center gap-4">
      <span aria-hidden className="pointer-events-none absolute inset-0 dot-field opacity-[0.1]" />

      <PhoneFrame className="-rotate-[1.5deg]">
        <div className="flex flex-1 flex-col p-1.5">
          <div className="flex items-center justify-between">
            <span className="font-display text-[0.4375rem] leading-none text-fg">Отчёт</span>
            <span className="font-mono text-[0.375rem] leading-none text-faint">Окт</span>
          </div>
          <span className="mt-2 font-mono text-[0.375rem] uppercase leading-none tracking-[0.06em] text-faint">
            Выручка
          </span>
          <span className="mt-0.5 font-display text-[0.5rem] leading-none text-fg">4,18 млн ₽</span>
          <span className="mt-0.5 font-mono text-[0.375rem] leading-none text-accent">+12,4%</span>
          <Bars
            heights={["h-[40%]", "h-[62%]", "h-[48%]", "h-[84%]", "h-[58%]"]}
            accentIndex={3}
            className="mt-1.5 h-8"
          />
          <div className="mt-1.5 flex flex-col gap-1">
            {[
              ["Москва", "2,1 млн"],
              ["СПб", "0,9 млн"],
              ["Казань", "0,6 млн"],
            ].map(([city, value]) => (
              <span
                key={city}
                className="flex items-center justify-between border-b border-line pb-1 last:border-b-0 last:pb-0"
              >
                <span className="font-mono text-[0.375rem] leading-none text-faint">{city}</span>
                <span className="font-mono text-[0.375rem] leading-none text-fg">{value}</span>
              </span>
            ))}
          </div>
        </div>
      </PhoneFrame>

      <PhoneFrame className="hidden rotate-[1.5deg] sm:flex">
        <div className="flex flex-1 flex-col p-1.5">
          <div className="flex items-center justify-between">
            <span className="font-display text-[0.4375rem] leading-none text-fg">Филиалы</span>
            <span className="rounded-full border border-line px-1 py-0.5 font-mono text-[0.3125rem] leading-none text-faint">
              60
            </span>
          </div>
          <span className="mt-2 flex h-4 items-center gap-1 rounded-full border border-line bg-bg px-1.5 font-mono text-[0.3125rem] text-faint">
            <SearchIcon />
            Поиск
          </span>
          <div className="mt-2 flex flex-col gap-1.5">
            {[
              ["Москва", "18", "+4"],
              ["Санкт-Петербург", "11", "+2"],
              ["Казань", "7", "−1"],
              ["Новосибирск", "5", "+1"],
            ].map(([city, count, delta]) => (
              <span key={city} className="flex items-center justify-between gap-1">
                <span className="min-w-0 truncate font-mono text-[0.375rem] leading-none text-faint">
                  {city}
                </span>
                <span className="flex shrink-0 items-baseline gap-1">
                  <span className="font-display text-[0.375rem] leading-none text-fg">{count}</span>
                  <span className="font-mono text-[0.3125rem] leading-none text-accent">{delta}</span>
                </span>
              </span>
            ))}
          </div>
          <div className="mt-auto flex items-center justify-between border-t border-line pt-1">
            {["Обзор", "Отчёт", "Роли"].map((tab, i) => (
              <span
                key={tab}
                className={`font-mono text-[0.3125rem] uppercase leading-none tracking-[0.04em] ${
                  i === 1 ? "text-accent" : "text-faint"
                }`}
              >
                {tab}
              </span>
            ))}
          </div>
        </div>
      </PhoneFrame>

      <div className="absolute left-[7%] top-[14%] hidden rounded-[6px] border border-line bg-bg-deep/90 p-2 backdrop-blur-sm md:block">
        <span className="block font-display text-[0.6875rem] leading-none text-accent">−3 дня</span>
        <span className="mt-1 block font-mono text-[0.375rem] uppercase leading-none tracking-[0.06em] text-faint">
          к отчётности
        </span>
      </div>
      <div className="absolute bottom-[13%] right-[6%] hidden rounded-full border border-line bg-bg-deep/90 px-2 py-1 font-mono text-[0.375rem] uppercase leading-none tracking-[0.06em] text-muted backdrop-blur-sm md:block">
        API · 12 отчётов
      </div>
    </div>
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
