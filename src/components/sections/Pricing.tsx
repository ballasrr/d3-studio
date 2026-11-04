import { site } from "@/content/site";

import MagneticButton from "@/components/ui/MagneticButton";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRight, Check } from "@/components/ui/icons";

const { pricing } = site;

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="section-y shell scroll-mt-[calc(var(--nav-h)+16px)] border-t border-line"
    >
      <Reveal>
        <SectionHeading
          index={pricing.index}
          label={pricing.label}
          title={pricing.title}
          accent={pricing.accent}
          description={pricing.description}
        />
      </Reveal>

      <Stagger className="mt-12 grid gap-4 lg:mt-20 lg:grid-cols-3 lg:items-stretch">
        {pricing.plans.map((plan, index) => {
          const popular = Boolean(plan.popular);
          return (
            <StaggerItem key={plan.id} className={popular ? "max-lg:order-first" : undefined}>
              <article
                className={[
                  "relative flex h-full flex-col rounded-lg border p-6 transition-colors duration-200 sm:p-7 lg:p-8",
                  popular
                    ? "accent-glow border-accent/45 bg-bg-elev lg:-translate-y-3"
                    : "border-line bg-bg-deep/60 hover:border-line-strong",
                ].join(" ")}
              >
                <div className="flex min-h-6 items-center justify-between gap-3">
                  {popular ? (
                    <span className="inline-flex h-6 items-center rounded-full bg-accent px-3 font-mono text-[0.625rem] uppercase leading-none tracking-[0.12em] text-accent-ink">
                      Чаще всего выбирают
                    </span>
                  ) : (
                    <span
                      aria-hidden
                      className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  )}
                </div>

                <h3 className="mt-5 font-display text-[1.375rem] font-medium leading-[1.15] tracking-[-0.025em] text-fg lg:text-[1.125rem] xl:text-[1.375rem]">
                  {plan.name}
                </h3>

                <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-1.5">
                  <span className="font-display text-[clamp(1.875rem,3vw,2.5rem)] font-medium leading-none tracking-[-0.035em] tabular-nums text-fg">
                    {plan.price}
                  </span>
                  <span className="pb-1 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-muted">
                    {plan.term}
                  </span>
                </div>

                <p className="mt-5 text-pretty text-[0.9375rem] leading-[1.6] text-muted">
                  {plan.description}
                </p>

                <ul className="mt-6 flex flex-col gap-3.5 border-t border-line pt-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-px size-[18px] shrink-0 text-accent" />
                      <span className="text-[0.9375rem] leading-[1.5] text-fg/85">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <MagneticButton
                    href="#contact"
                    variant={popular ? "primary" : "outline"}
                    size="md"
                    className="w-full"
                    icon={<ArrowRight className="size-4" />}
                  >
                    {plan.cta}
                  </MagneticButton>
                </div>
              </article>
            </StaggerItem>
          );
        })}
      </Stagger>

      <Reveal className="mt-12 lg:mt-16">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
            Дополнительно
          </span>
          <span aria-hidden className="h-px flex-1 bg-line" />
        </div>
        <ul className="mt-5 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-3">
          {pricing.addons.map((addon) => (
            <li
              key={addon.title}
              className="flex flex-col gap-2 bg-bg px-5 py-4 transition-colors duration-150 hover:bg-bg-deep"
            >
              <span className="text-[0.9375rem] leading-[1.4] text-fg">{addon.title}</span>
              <span className="font-mono text-[0.75rem] tabular-nums tracking-[0.02em] text-muted">
                {addon.price}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-[78ch] text-[0.8125rem] leading-[1.6] text-muted">
          {pricing.note}
        </p>
      </Reveal>
    </section>
  );
}
