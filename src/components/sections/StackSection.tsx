import SectionHeading from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { site } from "@/content/site";

export default function StackSection() {
  const stack = site.stack;

  return (
    <section className="section-y shell relative border-t border-line">
      <SectionHeading
        label={stack.label}
        title={stack.title}
        description={stack.description}
      />

      <Stagger className="mt-16 lg:mt-20">
        {stack.groups.map((group, groupIndex) => (
          <StaggerItem
            key={group.title}
            className="grid gap-5 border-t border-line py-8 md:grid-cols-12 md:items-baseline md:gap-8 md:py-10"
          >
            <div className="flex items-baseline gap-4 md:col-span-4">
              <span aria-hidden className="type-label">
                {String(groupIndex + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-[1.4rem] font-medium leading-[1.1] tracking-[-0.03em] text-fg md:text-[1.6rem]">
                {group.title}
              </h3>
            </div>

            <div className="md:col-span-7">
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item}>
                    <span className="inline-flex h-9 items-center rounded-full border border-line bg-glass px-4 font-mono text-[0.75rem] tracking-[0.01em] text-muted transition-[border-color,color,background-color] duration-150 hover:border-accent/60 hover:text-fg">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden md:col-span-1 md:block md:text-right">
              <span className="type-label">
                {String(group.items.length).padStart(2, "0")}
              </span>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <div aria-hidden className="hairline" />
    </section>
  );
}
