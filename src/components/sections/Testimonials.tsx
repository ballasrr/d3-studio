import { site } from "@/content/site";

import Counter from "@/components/ui/Counter";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { Star } from "@/components/ui/icons";

const { testimonials } = site;
/* Reuse the numbers the studio already publishes instead of inventing proof. */
const ratingStat = site.hero.stats[2];
const projectsStat = site.hero.stats[0];

function Stars({ label, size = "size-3.5" }: { label: string; size?: string }) {
  return (
    <span role="img" aria-label={label} className="flex items-center gap-0.5 text-accent">
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} className={size} />
      ))}
    </span>
  );
}

function Monogram({
  initials,
  size = "size-11",
  text = "text-[0.625rem]",
}: {
  initials: string;
  size?: string;
  text?: string;
}) {
  return (
    <span
      aria-hidden
      className={`grid ${size} shrink-0 place-items-center rounded-full border border-line bg-bg-deep font-display ${text} font-medium tracking-[0.08em] text-fg`}
    >
      {initials}
    </span>
  );
}

function Score() {
  const decimals = ratingStat.decimals ?? 0;
  const rating = ratingStat.value.toLocaleString("ru-RU", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <div className="flex flex-col gap-2.5 lg:items-end lg:text-right">
      <div className="flex items-center gap-3">
        <Stars label={`Средняя оценка ${rating} из 5`} />
        <span className="flex items-baseline gap-1 font-display text-[1rem] leading-none tracking-[-0.02em] tabular-nums text-fg">
          <Counter value={ratingStat.value} decimals={decimals} />
          <span className="font-mono text-[0.6875rem] tracking-[0.06em] text-muted">
            {ratingStat.suffix}
          </span>
        </span>
      </div>
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
        <Counter value={projectsStat.value} /> {projectsStat.label}
      </p>
    </div>
  );
}

export default function Testimonials() {
  const [lead, ...supporting] = testimonials.items;

  return (
    <section
      id="testimonials"
      className="section-y shell scroll-mt-[calc(var(--nav-h)+16px)] border-t border-line"
    >
      <Reveal>
        <SectionHeading
          index={testimonials.index}
          label={testimonials.label}
          title={testimonials.title}
          accent={testimonials.accent}
          description={testimonials.description}
          actions={<Score />}
        />
      </Reveal>

      <Stagger className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-12">
        <StaggerItem className="lg:col-span-12">
          <figure className="grid gap-8 rounded-lg border border-line bg-glass p-6 transition-colors duration-200 hover:border-line-strong sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-10">
            <div className="flex flex-col gap-6 lg:col-span-8">
              <div className="flex items-start justify-between gap-6">
                <Stars label="Оценка 5 из 5" />
                <span
                  aria-hidden
                  className="translate-y-2 font-display text-[2.75rem] leading-[0.6] text-accent/70"
                >
                  “
                </span>
              </div>
              <blockquote className="text-pretty text-[1.0625rem] leading-[1.55] tracking-[-0.015em] text-fg/90 sm:text-[1.25rem] lg:text-[1.5rem] lg:leading-[1.42]">
                {lead.quote}
              </blockquote>
            </div>

            <figcaption className="flex items-center gap-4 border-t border-line pt-6 lg:col-span-4 lg:flex-col lg:items-start lg:gap-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <Monogram initials={lead.initials} size="size-12" text="text-[0.6875rem]" />
              <div className="flex min-w-0 flex-col gap-1">
                <span className="font-display text-[1.0625rem] font-medium leading-[1.2] tracking-[-0.02em] text-fg">
                  {lead.name}
                </span>
                <span className="text-[0.8125rem] leading-[1.45] text-muted">{lead.role}</span>
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                  {lead.company}
                </span>
              </div>
            </figcaption>
          </figure>
        </StaggerItem>

        {supporting.map((item) => (
          <StaggerItem key={item.name} className="lg:col-span-6">
            <figure className="flex h-full flex-col justify-between gap-6 rounded-md border border-line bg-bg-elev/60 p-6 transition-colors duration-200 hover:border-line-strong">
              <div className="flex flex-col gap-4">
                <Stars label="Оценка 5 из 5" size="size-3" />
                <blockquote className="text-pretty text-[0.9375rem] leading-[1.65] text-muted">
                  {item.quote}
                </blockquote>
              </div>
              <figcaption className="flex items-center gap-3 border-t border-line pt-4">
                <Monogram initials={item.initials} size="size-9" text="text-[0.5625rem]" />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-[0.875rem] font-medium leading-[1.3] text-fg">
                    {item.name}
                  </span>
                  <span className="text-[0.75rem] leading-[1.4] text-muted">
                    {item.role} · {item.company}
                  </span>
                </div>
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
