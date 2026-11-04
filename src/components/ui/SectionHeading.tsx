import type { ReactNode } from "react";

type SectionHeadingProps = {
  index?: string;
  label: string;
  title: ReactNode | string;
  /** A word inside `title` (when it is a string) to paint with the accent. */
  accent?: string;
  description?: string;
  className?: string;
  actions?: ReactNode;
};

/** Shared section header: index + label rule, oversized H2, optional lead. */
export default function SectionHeading({
  index,
  label,
  title,
  accent,
  description,
  className = "",
  actions,
}: SectionHeadingProps) {
  let renderedTitle: ReactNode = title;
  if (typeof title === "string" && accent) {
    const at = title.indexOf(accent);
    if (at >= 0) {
      renderedTitle = (
        <>
          {title.slice(0, at)}
          <span className="text-accent">{accent}</span>
          {title.slice(at + accent.length)}
        </>
      );
    }
  }

  return (
    <div className={`flex flex-col gap-8 md:gap-10 ${className}`}>
      <div className="flex items-center gap-4">
        {index ? (
          <span className="type-label text-accent">{index}</span>
        ) : null}
        <span className="type-eyebrow">{label}</span>
        <span aria-hidden className="h-px flex-1 bg-line" />
      </div>
      <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-12">
        <h2 className="type-h2 min-w-0 text-balance lg:col-span-7">{renderedTitle}</h2>
        {description ? (
          <p className="type-body min-w-0 max-w-[52ch] text-pretty lg:col-span-4 lg:col-start-9">
            {description}
          </p>
        ) : null}
        {actions ? (
          <div className="min-w-0 lg:col-span-3 lg:col-start-10">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}
