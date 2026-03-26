interface PageHeroProps {
  title: string;
  subtitle: string;
  meta: string;
}

export function PageHero({ title, subtitle, meta }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="relative mx-auto flex max-w-[1360px] items-end justify-between gap-4 px-4 py-9 sm:px-6 sm:py-11">
        <div>
          <p className="mb-2 font-mono text-[10px] tracking-[.18em] uppercase text-[var(--text2)]">
            {meta}
          </p>
          <h1 className="font-display text-[42px] leading-none tracking-[.025em] text-white sm:text-[56px]">
            {title}
          </h1>
        </div>

        <div className="rounded-full border border-[var(--b2)]/70 bg-[var(--brand-navy)]/72 px-3 py-1.5 font-mono text-[10px] tracking-[.12em] uppercase text-[var(--text2)]">
          {subtitle}
        </div>
      </div>
    </section>
  );
}
