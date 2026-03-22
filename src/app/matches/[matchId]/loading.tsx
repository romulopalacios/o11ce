export default function MatchDetailLoading() {
  return (
    <section className="py-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-[var(--surface)] rounded-[10px] border border-[var(--border)] h-[72px] w-full mb-[6px]"
        />
      ))}
    </section>
  );
}
