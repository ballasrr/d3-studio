import Marquee from "@/components/ui/Marquee";
import { site } from "@/content/site";

/**
 * Client wordmarks as typography — no logo image files, no stock art.
 * Each name keeps its own type treatment so the strip reads like a roster
 * rather than a repeated tag.
 */
const wordmarkStyles: Record<string, string> = {
  display: "font-display text-[1.25rem] font-medium uppercase tracking-[-0.055em] text-fg",
  sans: "font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.22em] text-fg",
  mono: "font-mono text-[0.75rem] uppercase tracking-[0.3em] text-fg",
  outline: "font-display text-[1.375rem] font-medium uppercase tracking-[-0.04em] text-outline",
};

export default function ProofMarquee() {
  const items = site.proof.items.map((item) => (
    <span
      key={item.name}
      className={`${wordmarkStyles[item.style] ?? wordmarkStyles.sans} whitespace-nowrap`}
    >
      {item.name}
    </span>
  ));

  return (
    <section aria-label={site.proof.label} className="relative border-y border-line bg-bg-deep/60">
      <div className="shell flex flex-col gap-5 py-6 md:h-[88px] md:flex-row md:items-center md:gap-10 md:py-0">
        <div className="flex shrink-0 items-center gap-2.5">
          <span aria-hidden className="size-1.5 rounded-full bg-accent animate-pulse-soft" />
          <p className="type-eyebrow">{site.proof.label}</p>
        </div>
        <span aria-hidden className="hidden h-4 w-px shrink-0 bg-line md:block" />
        <div className="edge-fade-x min-w-0 flex-1 opacity-[0.55] transition-opacity duration-200 hover:opacity-100">
          <Marquee items={items} duration={62} gapClassName="gap-16 md:gap-24" />
        </div>
      </div>
    </section>
  );
}
