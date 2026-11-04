"use client";

import { useState } from "react";

import { site } from "@/content/site";

import { ArrowUpRight, Mail, Send } from "@/components/ui/icons";

const { faq } = site;
const { contacts } = site;

function AccordionMark({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className={[
        "relative grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-200",
        open ? "border-accent/60 text-accent" : "border-line text-muted",
      ].join(" ")}
    >
      <span className="h-px w-3.5 bg-current" />
      <span
        className={[
          "absolute h-3.5 w-px bg-current transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "scale-y-0" : "scale-y-100",
        ].join(" ")}
      />
    </span>
  );
}

function Title() {
  const at = faq.title.indexOf(faq.accent);
  return (
    <h2 className="text-balance font-display text-[clamp(2rem,3.6vw,3rem)] font-medium leading-[1.0] tracking-[-0.035em] text-fg">
      {at >= 0 ? (
        <>
          {faq.title.slice(0, at)}
          <span className="text-accent">{faq.accent}</span>
          {faq.title.slice(at + faq.accent.length)}
        </>
      ) : (
        faq.title
      )}
    </h2>
  );
}

const contactLinks = [
  {
    label: "Telegram",
    value: contacts.telegram,
    href: contacts.telegramUrl,
    external: true,
    icon: Send,
  },
  {
    label: "Почта",
    value: contacts.email,
    href: `mailto:${contacts.email}`,
    external: false,
    icon: Mail,
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="section-y shell scroll-mt-[calc(var(--nav-h)+16px)] border-t border-line"
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-8 lg:col-span-5 lg:sticky lg:top-[calc(var(--nav-h)+32px)] lg:self-start">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-accent">
                {faq.index}
              </span>
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted">
                {faq.label}
              </span>
              <span aria-hidden className="h-px flex-1 bg-line" />
            </div>
            <Title />
            <p className="max-w-[42ch] text-pretty text-[1rem] leading-[1.6] text-muted">
              {faq.description}
            </p>
          </div>

          <div className="rounded-md border border-line bg-glass p-5 sm:p-6">
            <p className="text-[0.9375rem] font-medium text-fg">Не нашли ответ?</p>
            <p className="mt-2 text-[0.8125rem] leading-[1.55] text-muted">{contacts.response}</p>
            <ul className="mt-4 flex flex-col border-t border-line">
              {contactLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label} className="border-b border-line last:border-b-0">
                    <a
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                      className="group flex min-h-11 items-center justify-between gap-4 py-3 transition-colors duration-150 hover:text-accent"
                    >
                      <span className="flex items-center gap-2.5 text-[0.875rem] text-fg transition-colors duration-150 group-hover:text-accent">
                        <Icon className="size-4 text-faint transition-colors duration-150 group-hover:text-accent" />
                        {link.label}
                      </span>
                      <span className="flex items-center gap-1.5 font-mono text-[0.75rem] text-muted transition-colors duration-150 group-hover:text-accent">
                        {link.value}
                        <ArrowUpRight className="size-3.5 text-faint transition-colors duration-150 group-hover:text-accent" />
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ul>
            {faq.items.map((item, index) => {
              const open = openIndex === index;
              const triggerId = `faq-trigger-${index}`;
              const panelId = `faq-panel-${index}`;
              const number = String(index + 1).padStart(2, "0");

              return (
                <li key={item.q} className="border-t border-line last:border-b">
                  <h3>
                    <button
                      id={triggerId}
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(open ? null : index)}
                      className="group flex w-full items-center justify-between gap-5 py-5 text-left transition-colors duration-150"
                    >
                      <span className="flex min-w-0 items-baseline gap-4">
                        <span
                          aria-hidden
                          className="font-mono text-[0.6875rem] tabular-nums tracking-[0.08em] text-faint"
                        >
                          {number}
                        </span>
                        <span
                          className={[
                            "text-[0.9375rem] leading-[1.4] tracking-[-0.01em] transition-colors duration-150 sm:text-[1.0625rem]",
                            open ? "text-fg" : "text-muted group-hover:text-fg",
                          ].join(" ")}
                        >
                          {item.q}
                        </span>
                      </span>
                      <AccordionMark open={open} />
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    aria-hidden={!open}
                    className={[
                      "grid transition-[grid-template-rows] duration-[240ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    ].join(" ")}
                  >
                    <div className="overflow-hidden">
                      <p
                        className={[
                          "max-w-[62ch] pb-6 pl-[1.9375rem] pr-4 text-[0.9375rem] leading-[1.65] text-muted text-pretty transition-[opacity,transform] duration-[240ms] ease-out",
                          open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
                        ].join(" ")}
                      >
                        {item.a}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
