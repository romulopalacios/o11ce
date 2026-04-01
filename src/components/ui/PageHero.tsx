interface PageHeroProps {
  title: string;
  subtitle: string;
  meta: string;
}

export function PageHero({ title, subtitle, meta }: PageHeroProps) {
  return (
    <section className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-8 sm:px-6 lg:flex-row lg:items-end lg:px-8 lg:py-12">
        <div className="max-w-4xl">
          <p className="mb-2 text-xs font-semibold tracking-wider text-blue-500 uppercase">
            {meta}
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        </div>

        <div className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-300">
          {subtitle}
        </div>
      </div>
    </section>
  );
}
