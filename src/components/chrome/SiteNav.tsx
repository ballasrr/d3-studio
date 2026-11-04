"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import Logo from "@/components/ui/Logo";
import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowUpRight, Close } from "@/components/ui/icons";
import { site } from "@/content/site";
import { DUR, EASE, MQ, SCROLL_EVENT, STAGGER } from "@/lib/motion";

const LINKS = site.nav;
const MENU_ID = "site-menu";

/**
 * Fixed chrome header.
 *
 * - Transparent over the hero; after 24px of scroll it gains glass, a hairline
 *   and shrinks 76px -> 64px.
 * - Under 1024px a fullscreen menu takes over: scroll is locked through the
 *   shared Lenis events, focus jumps to the close button, Tab is trapped in the
 *   dialog and Escape (or a link, or a tap on the backdrop) closes it and
 *   returns focus to the trigger.
 */
export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  /* Glass + shrink once the hero starts leaving the top edge. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* The dialog is mobile-only: never leave it open across a resize. */
  useEffect(() => {
    const query = window.matchMedia(MQ.desktop);
    const onChange = () => {
      if (query.matches) setOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  /* Scroll lock, focus management, Escape, focus trap. */
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const coarsePointer = !window.matchMedia(MQ.finePointer).matches;
    const trigger = toggleRef.current;

    // Lenis is stopped by the event; touch scrolling is native, so on coarse
    // pointers the body itself has to stop scrolling (no visible scrollbar
    // there, so nothing shifts).
    if (coarsePointer) document.body.style.overflow = "hidden";
    window.dispatchEvent(new Event(SCROLL_EVENT.lock));

    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const items = dialogRef.current
        ? Array.from(
            dialogRef.current.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
          )
        : [];
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const inside = Boolean(active) && Boolean(dialogRef.current?.contains(active));

      if (event.shiftKey && (!inside || active === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!inside || active === last)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (coarsePointer) document.body.style.overflow = previousOverflow;
      window.dispatchEvent(new Event(SCROLL_EVENT.unlock));
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  /* Unlock before the browser handles the anchor, so Lenis can scroll to it. */
  const closeMenu = () => {
    window.dispatchEvent(new Event(SCROLL_EVENT.unlock));
    setOpen(false);
  };

  return (
    <>
      <header
        aria-hidden={open || undefined}
        className={[
          "fixed inset-x-0 top-0 z-[60] transition-[background-color,border-color,backdrop-filter] duration-300 ease-out",
          scrolled && !open
            ? "border-b border-line bg-bg/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        ].join(" ")}
      >
        <div
          className={[
            "shell flex items-center justify-between gap-4 transition-[height] duration-300 ease-out",
            scrolled ? "h-16" : "h-[76px]",
          ].join(" ")}
        >
          <Logo />

          <div className="flex items-center gap-2 sm:gap-3 xl:gap-5">
            <nav aria-label="Основная навигация" className="hidden lg:block">
              <ul className="flex items-center gap-0.5">
                {LINKS.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="group relative inline-flex h-11 items-center px-3.5 text-[0.8125rem] font-medium tracking-[-0.005em] text-muted transition-colors duration-200 hover:text-fg"
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-3.5 bottom-[9px] h-px origin-right scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <span className="hidden items-center gap-2 rounded-full border border-line bg-glass px-3 py-1.5 xl:inline-flex">
              <span
                aria-hidden="true"
                className="relative flex size-1.5 items-center justify-center"
              >
                <span className="absolute inset-0 rounded-full bg-accent animate-pulse-soft" />
                <span className="relative size-1.5 rounded-full bg-accent" />
              </span>
              <span className="font-mono text-[0.6875rem] tracking-[0.06em] text-muted">
                {site.hero.availability}
              </span>
            </span>

            <div className="hidden sm:block">
              <MagneticButton
                href={site.hero.primaryCta.href}
                size="sm"
                icon={<ArrowUpRight className="size-3.5" />}
              >
                {site.hero.primaryCta.label}
              </MagneticButton>
            </div>

            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls={MENU_ID}
              aria-label="Открыть меню"
              aria-haspopup="dialog"
              onClick={() => setOpen((value) => !value)}
              className="group relative flex size-11 items-center justify-center rounded-full border border-line text-fg transition-colors duration-200 hover:border-line-strong hover:bg-glass lg:hidden"
            >
              <span aria-hidden="true" className="relative block h-3 w-5">
                <span className="absolute inset-x-0 top-0 h-px bg-current transition-transform duration-300 ease-out group-hover:-translate-y-0.5" />
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-[0.72] bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="site-menu"
            ref={dialogRef}
            id={MENU_ID}
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: DUR.ui, ease: EASE.inOutQuart }}
            className="fixed inset-0 z-[90] flex flex-col overflow-y-auto overscroll-contain bg-bg-deep lg:hidden"
            onClick={(event) => {
              if (!(event.target as HTMLElement).closest("a,button")) closeMenu();
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 grid-field opacity-40"
            />

            <div className="shell relative flex h-[76px] shrink-0 items-center justify-between border-b border-line">
              <div onClick={closeMenu}>
                <Logo />
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={closeMenu}
                aria-label="Закрыть меню"
                className="flex size-11 items-center justify-center rounded-full border border-line text-fg transition-colors duration-200 hover:border-line-strong hover:bg-glass"
              >
                <Close className="size-5" />
              </button>
            </div>

            <nav aria-label="Мобильная навигация" className="shell relative mt-3 flex-1">
              <ul className="border-t border-line">
                {LINKS.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={reduce ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      reduce
                        ? { duration: 0 }
                        : {
                            duration: DUR.enter,
                            delay: 0.08 + index * STAGGER,
                            ease: EASE.outExpo,
                          }
                    }
                    className="border-b border-line"
                  >
                    <a
                      href={item.href}
                      onClick={closeMenu}
                      className="group flex min-h-[56px] items-center justify-between gap-4 py-2"
                    >
                      <span className="font-display text-[clamp(2.05rem,9.5vw,3.25rem)] font-medium leading-[1] tracking-[-0.04em] text-fg transition-colors duration-200 group-hover:text-accent">
                        {item.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="font-mono text-[0.6875rem] tracking-[0.18em] text-faint transition-colors duration-200 group-hover:text-accent"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="shell relative mt-auto pb-7 pt-6">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-5">
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                  <span className="font-mono text-[0.6875rem] tracking-[0.06em] text-muted">
                    {site.hero.availability}
                  </span>
                </span>
                <span aria-hidden="true" className="h-3 w-px bg-line" />
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint">
                  {site.contacts.city}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-x-4">
                <a
                  href={`mailto:${site.contacts.email}`}
                  className="group flex min-h-11 flex-col justify-center"
                >
                  <span className="type-label mb-1">Почта</span>
                  <span className="text-[0.9375rem] font-medium text-fg transition-colors duration-200 group-hover:text-accent">
                    {site.contacts.email}
                  </span>
                </a>
                <a
                  href={site.contacts.telegramUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex min-h-11 flex-col justify-center"
                >
                  <span className="type-label mb-1">Telegram</span>
                  <span className="text-[0.9375rem] font-medium text-fg transition-colors duration-200 group-hover:text-accent">
                    {site.contacts.telegram}
                  </span>
                </a>
              </div>

              <MagneticButton
                href={site.hero.primaryCta.href}
                size="md"
                className="mt-5 w-full"
                icon={<ArrowUpRight className="size-4" />}
                onClick={closeMenu}
              >
                {site.hero.primaryCta.label}
              </MagneticButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
