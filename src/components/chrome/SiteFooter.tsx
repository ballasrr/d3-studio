import { site } from "@/content/site";
import Logo from "@/components/ui/Logo";
import { ArrowUp, ArrowUpRight, Mail, Send } from "@/components/ui/icons";

/**
 * Shared footer. No ids of its own — it only points at sections owned by the
 * page. Layout: closing CTA, brand + contacts, three link columns, legal rail,
 * and the oversized outlined wordmark cropped by the bottom edge.
 */
export default function SiteFooter() {
  const { footer, contacts, hero, contact } = site;

  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg-deep">
      {/* ---------- closing CTA ---------- */}
      <div className="shell pt-16 sm:pt-20 md:pt-24">
        <div className="flex items-center justify-between gap-6">
          <p className="flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
            {contact.label}
          </p>
          <p className="hidden font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint sm:block">
            {contacts.hours}
          </p>
        </div>

        <a
          href={hero.primaryCta.href}
          className="group mt-8 flex items-center justify-between gap-6 border-b border-line pb-10 sm:mt-10 sm:pb-14"
        >
          <span className="type-h2 max-w-[15ch] text-balance text-fg transition-colors duration-200 group-hover:text-accent">
            {hero.primaryCta.label}
          </span>
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-accent-dim text-accent transition-colors duration-200 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink sm:size-16 md:size-20">
            <ArrowUpRight className="size-5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:size-7" />
          </span>
        </a>

        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
          <p className="type-body max-w-[46ch] text-balance">{footer.tagline}</p>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line px-3.5 py-2">
            <span
              aria-hidden="true"
              className="relative flex size-1.5 items-center justify-center"
            >
              <span className="absolute inset-0 rounded-full bg-accent animate-pulse-soft" />
              <span className="relative size-1.5 rounded-full bg-accent" />
            </span>
            <span className="font-mono text-[0.6875rem] tracking-[0.06em] text-muted">
              {hero.availability}
            </span>
          </span>
        </div>
      </div>

      {/* ---------- brand, contacts, link columns ---------- */}
      <div className="shell mt-12 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <Logo />

          <div className="mt-6 flex flex-col items-start">
            <a
              href={`mailto:${contacts.email}`}
              className="group flex min-h-11 items-center gap-3 text-[0.9375rem] font-medium text-muted transition-colors duration-200 hover:text-fg"
            >
              <Mail className="size-4 shrink-0 text-faint transition-colors duration-200 group-hover:text-accent" />
              {contacts.email}
            </a>
            <a
              href={contacts.telegramUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex min-h-11 items-center gap-3 text-[0.9375rem] font-medium text-muted transition-colors duration-200 hover:text-fg"
            >
              <Send className="size-4 shrink-0 text-faint transition-colors duration-200 group-hover:text-accent" />
              {contacts.telegram}
            </a>
            <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint">
              {contacts.city}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:col-span-8">
          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="type-label mb-4">{column.title}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group flex min-h-11 items-center gap-2.5 text-[0.875rem] text-muted transition-colors duration-200 hover:text-fg"
                    >
                      <span
                        aria-hidden="true"
                        className="h-px w-3 origin-left scale-x-0 bg-accent transition-transform duration-200 group-hover:scale-x-100"
                      />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* ---------- legal rail ---------- */}
      <div className="shell mt-12 md:mt-16">
        <div className="flex flex-col gap-2 border-t border-line py-5 md:flex-row md:items-center md:justify-between md:gap-6">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint">
            {footer.legal}
          </p>
          <p className="hidden font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-faint md:block">
            {footer.madeWith}
          </p>
          <a
            href="#main"
            className="group inline-flex min-h-11 w-fit items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted transition-colors duration-200 hover:text-fg"
          >
            {footer.backToTop}
            <ArrowUp className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      {/* ---------- oversized wordmark, cropped by the bottom edge ---------- */}
      <div aria-hidden="true" className="pointer-events-none mt-8 -mb-[2.5vw] select-none">
        <span className="block text-center font-display text-[clamp(8rem,40vw,42rem)] font-medium leading-[0.66] tracking-[-0.06em] text-outline">
          {site.name}
        </span>
      </div>
    </footer>
  );
}
