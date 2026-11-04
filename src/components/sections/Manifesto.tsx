import Counter from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { site } from "@/content/site";

type Metric = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  note: string;
};

/** Accent index numerals — explicit type classes so no utility conflicts. */
const indexClass =
  "font-mono text-[0.6875rem] leading-none tracking-[0.14em] tabular-nums text-accent";

export default function Manifesto() {
  const manifesto = site.manifesto;
  // Metrics are declared inline in the content deck; the `note` context line
  // is only used here, so it stays local to this section.
  const metrics = manifesto.metrics as Metric[];

  return (
    <section id="approach" className="section-y shell relative overflow-x-clip">
      {/* Quiet depth: an oversized outlined D3 cropped into the header air. */}
      <div className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute right-0 top-[-0.12em] hidden select-none font-display text-[clamp(8rem,17vw,15rem)] font-medium leading-[0.8] tracking-[-0.07em] text-outline opacity-60 lg:block"
        >
          D3
        </span>
        <Reveal>
          <SectionHeading
            index={manifesto.index}
            label={manifesto.label}
            title={manifesto.title}
            accent={manifesto.accent}
          />
        </Reveal>
      </div>

      <div className="mt-16 grid gap-10 md:mt-20 lg:grid-cols-12 lg:gap-8">
        {manifesto.body.map((paragraph, i) => (
          <Reveal
            key={i}
            delay={i * 0.08}
            className={i === 0 ? "lg:col-span-6" : "lg:col-span-5 lg:col-start-8"}
          >
            <div className="border-t border-line pt-5">
              <span aria-hidden className={indexClass}>
                {`0${i + 1}`}
              </span>
              <p
                className={
                  i === 0
                    ? "mt-4 max-w-[48ch] text-[1.0625rem] leading-[1.55] text-fg/90 md:text-[1.1875rem]"
                    : "type-body mt-4 max-w-[46ch]"
                }
              >
                {paragraph}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-8">
        <ol className="list-none lg:col-span-7">
          {manifesto.points.map((point, i) => (
            <li key={point.title} className="border-t border-line first:border-t-0">
              <Reveal
                delay={i * 0.06}
                className="grid grid-cols-[2rem_1fr] gap-4 py-6 md:grid-cols-[2.5rem_1fr] md:py-7"
              >
                <>
                  <span aria-hidden className={`${indexClass} pt-1`}>
                    {`0${i + 1}`}
                  </span>
                  <div>
                    <h3 className="text-[1.0625rem] font-medium tracking-[-0.01em] text-fg md:text-[1.125rem]">
                      {point.title}
                    </h3>
                    <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-[1.65] text-muted">
                      {point.text}
                    </p>
                  </div>
                </>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="lg:col-span-4 lg:col-start-9 lg:border-l lg:border-line lg:pl-8">
          <ul className="list-none">
            {metrics.map((metric, i) => (
              <li key={metric.label} className="border-t border-line py-6 first:border-t-0 first:pt-0">
                <Reveal delay={i * 0.06}>
                  <p className="font-display text-[clamp(2.5rem,3.4vw,3.5rem)] font-medium leading-[0.95] tracking-[-0.045em] tabular-nums text-fg">
                    <Counter
                      value={metric.value}
                      decimals={metric.decimals}
                      prefix={metric.prefix}
                      suffix={metric.suffix}
                    />
                  </p>
                  <p className="mt-2 text-[0.9375rem] text-fg/90">{metric.label}</p>
                  <p className="type-label mt-1.5">{metric.note}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
