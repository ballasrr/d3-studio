import { site } from "@/content/site";

import LeadForm from "@/components/forms/LeadForm";
import { Reveal } from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowUpRight } from "@/components/ui/icons";

const { contact } = site;
const { contacts } = site;
const metaItems = contact.meta.slice(0, 3);

function MetaRow({ item }: { item: (typeof contact.meta)[number] }) {
  const href = "href" in item ? item.href : undefined;
  const external = href?.startsWith("http") ?? false;

  return (
    <div className="flex flex-col gap-1.5 py-3">
      <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
        {item.label}
      </dt>
      <dd className="text-[0.9375rem] leading-[1.5] text-fg">
        {href ? (
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
            className="group inline-flex min-h-11 items-center gap-1.5 transition-colors duration-150 hover:text-accent"
          >
            {item.value}
            <ArrowUpRight className="size-3.5 text-faint transition-colors duration-150 group-hover:text-accent" />
          </a>
        ) : (
          <span className="text-muted">{item.value}</span>
        )}
      </dd>
    </div>
  );
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="section-y shell scroll-mt-[calc(var(--nav-h)+16px)] border-t border-line"
    >
      <Reveal>
        <SectionHeading
          index={contact.index}
          label={contact.label}
          title={contact.title}
          accent={contact.accent}
          description={contact.description}
        />
      </Reveal>

      <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
        <Reveal className="max-lg:order-2 lg:col-span-5" delay={0.05}>
          <div className="flex flex-col gap-8 lg:sticky lg:top-[calc(var(--nav-h)+40px)]">
            <dl className="divide-y divide-line border-y border-line">
              {metaItems.map((item) => (
                <MetaRow key={item.label} item={item} />
              ))}
            </dl>

            <div className="rounded-md border border-line bg-glass p-5 sm:p-6">
              <div className="flex items-center gap-2.5">
                <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent animate-pulse-soft" />
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-accent">
                  Ответ
                </span>
              </div>
              <p className="mt-3 text-pretty text-[0.9375rem] leading-[1.6] text-fg">
                {contacts.response}
              </p>
              <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                {contacts.hours}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal className="max-lg:order-1 lg:col-span-7" delay={0.1}>
          <div className="relative overflow-hidden rounded-lg glass p-5 sm:p-7 lg:p-8">
            <span aria-hidden className="absolute left-7 top-0 h-px w-16 bg-accent/70 sm:left-9" />
            <LeadForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
