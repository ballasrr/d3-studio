import Link from "next/link";

/** D3 mark: isometric cube (the third dimension) + wordmark. */
export function D3Mark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    >
      <path d="M16 3.2 28 9.6v12.8L16 28.8 4 22.4V9.6L16 3.2Z" />
      <path d="m4 9.6 12 6.4 12-6.4M16 16v12.8" />
      <path d="M16 3.2 28 9.6 16 16 4 9.6 16 3.2Z" fill="var(--accent)" stroke="none" opacity="0.9" />
    </svg>
  );
}

export default function Logo({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="D3 — на главную"
      className={`group inline-flex items-center gap-3 ${className}`}
    >
      <D3Mark className="size-7 text-fg transition-transform duration-500 ease-out group-hover:rotate-[-8deg] md:size-8" />
      <span className="flex items-baseline gap-2">
        <span className="font-display text-[1.15rem] font-semibold tracking-[-0.06em] text-fg">
          D3
          <span className="text-accent">.</span>
        </span>
        {!compact ? (
          <span className="type-label hidden text-faint sm:inline">digital production</span>
        ) : null}
      </span>
    </Link>
  );
}
