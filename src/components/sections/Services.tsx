import type { ComponentType, SVGProps } from "react";

import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { ArrowUpRight, AppIcon, BoltIcon, CartIcon, CubeIcon, SiteIcon } from "@/components/ui/icons";
import { site } from "@/content/site";
import type { Service } from "@/content/site";

const serviceIcons: Record<Service["icon"], ComponentType<SVGProps<SVGSVGElement>>> = {
  site: SiteIcon,
  bolt: BoltIcon,
  app: AppIcon,
  cart: CartIcon,
  cube: CubeIcon,
};

export default function Services() {
  const services = site.services;

  return (
    <section
      id="services"
      className="section-y shell relative overflow-x-clip border-t border-line"
    >
      <Reveal>
        <SectionHeading
          index={services.index}
          label={services.label}
          title={services.title}
          accent={services.accent}
          description={services.description}
        />
      </Reveal>

      <Stagger className="mt-14 grid gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-6">
        {services.items.map((item) => {
          const Icon = serviceIcons[item.icon];

          return (
            <StaggerItem
              key={item.id}
              className={item.wide ? "lg:col-span-4" : "lg:col-span-2"}
            >
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-glass p-6 transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:bg-glass-strong md:p-7">
                {item.wide ? (
                  <Icon
                    aria-hidden
                    className="pointer-events-none absolute -bottom-7 -right-5 size-40 text-fg/[0.03]"
                  />
                ) : null}

                <header className="flex items-start justify-between gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-[10px] border border-line bg-bg-deep text-fg transition-colors duration-200 group-hover:border-accent/40 group-hover:text-accent">
                    <Icon className="size-5" />
                  </span>
                  <span className="type-label pt-1">{item.index}</span>
                </header>

                <h3 className="mt-6 font-display text-[1.3rem] font-medium leading-[1.12] tracking-[-0.03em] text-fg md:text-[1.45rem]">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-[54ch] text-[0.9375rem] leading-[1.6] text-muted">
                  {item.description}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.625rem] uppercase leading-none tracking-[0.1em] text-faint transition-colors duration-200 group-hover:text-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <div className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
                    <span className="text-[0.9375rem] font-medium tabular-nums text-fg">
                      {item.price}
                    </span>
                    <span className="type-label">{item.term}</span>
                  </div>
                </div>
              </article>
            </StaggerItem>
          );
        })}

        <StaggerItem className="lg:col-span-4">
          <a
            href="#contact"
            className="group relative flex h-full flex-col justify-between gap-10 overflow-hidden rounded-[18px] border border-line bg-bg-elev p-6 transition-[border-color,background-color] duration-200 hover:border-accent/40 hover:bg-glass md:p-7"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -top-12 right-0 size-40 rounded-full bg-accent/[0.07] blur-2xl"
            />
            <div className="flex items-start justify-between gap-4">
              <span className="type-label pt-1">S.06</span>
              <span className="grid size-11 place-items-center rounded-full border border-accent/40 text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-accent-ink">
                <ArrowUpRight className="size-5" />
              </span>
            </div>
            <div>
              <p className="font-display text-[1.3rem] font-medium leading-[1.15] tracking-[-0.03em] text-fg md:text-[1.45rem]">
                Не нашли свою задачу?
              </p>
              <p className="mt-2 text-[0.9375rem] leading-[1.6] text-muted">
                Расскажите — соберём с нуля.
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-accent">
                {site.contact.form.submit}
              </span>
              <span aria-hidden className="h-px flex-1 bg-line" />
            </div>
          </a>
        </StaggerItem>
      </Stagger>
    </section>
  );
}
